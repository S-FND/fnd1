import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface IRLFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export const useIRLData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Load data for a specific section and field
  const loadSectionData = async (sectionType: string, fieldKey: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('irl_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('section_type', sectionType)
        .eq('field_key', fieldKey)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

      return data;
    } catch (error) {
      console.error('Error loading IRL data:', error);
      return null;
    }
  };

  // Save data for a specific section and field
  const saveSectionData = async (
    sectionType: string, 
    fieldKey: string, 
    fieldValue: any, 
    files?: IRLFile[]
  ) => {
    if (!user) return;

    try {
      const irlData = {
        user_id: user.id,
        section_type: sectionType,
        field_key: fieldKey,
        field_value: fieldValue as any,
        files: (files || []) as any,
      };

      const { error } = await supabase
        .from('irl_data')
        .upsert(irlData, { onConflict: 'user_id,section_type,field_key' });

      if (error) throw error;

      toast.success('Data saved successfully');
    } catch (error) {
      console.error('Error saving IRL data:', error);
      toast.error('Failed to save data');
    }
  };

  // Upload file and return file info
  const uploadFile = async (sectionType: string, fieldKey: string, file: File): Promise<IRLFile | null> => {
    if (!user) return null;

    try {
      const fileName = `${user.id}/${sectionType}/${fieldKey}-${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('irl-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('irl-files')
        .getPublicUrl(fileName);

      return {
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    }
  };

  // Upload multiple files
  const uploadMultipleFiles = async (
    sectionType: string, 
    fieldKey: string, 
    files: FileList
  ): Promise<IRLFile[]> => {
    const uploadPromises = Array.from(files).map(file => 
      uploadFile(sectionType, fieldKey, file)
    );

    const results = await Promise.all(uploadPromises);
    return results.filter((file): file is IRLFile => file !== null);
  };

  // Delete file from storage
  const deleteFile = async (fileUrl: string) => {
    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${user?.id}/${fileName}`;

      const { error } = await supabase.storage
        .from('irl-files')
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  // Load all data for a section
  const loadSectionAllData = async (sectionType: string) => {
    if (!user) return {};

    try {
      const { data, error } = await supabase
        .from('irl_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('section_type', sectionType);

      if (error) throw error;

      // Transform to key-value pairs
      const sectionData: Record<string, any> = {};
      data?.forEach(item => {
        sectionData[item.field_key] = {
          value: item.field_value,
          files: item.files || [],
        };
      });

      return sectionData;
    } catch (error) {
      console.error('Error loading section data:', error);
      return {};
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loadSectionData,
    saveSectionData,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    loadSectionAllData,
  };
};