import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, FileText, Loader2 } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { httpClient } from '@/lib/httpClient';

interface EvidenceFileUploadProps {
  value: File[]; // Array of file URLs
  // onChange: (urls: string[]) => void;
  onChange: (files: File[]) => void;
  label?: string;
  description?: string;
  maxFiles?: number;
  scope: string; // 'scope1', 'scope2', 'scope3', 'scope4',
  uploadedFiles?: { url?: string; name?: string }[]; // Optional prop for already uploaded files
  templateId?: string;
  entryId?: string;
  setReloadData?: (reload: boolean) => void;
}

export const EvidenceFileUpload: React.FC<EvidenceFileUploadProps> = ({
  value = [],
  onChange,
  label = "Supporting Evidence",
  description = "Upload supporting documents (invoices, bills, reports)",
  maxFiles = 5,
  scope,
  uploadedFiles = [],
  templateId,
  entryId,
  setReloadData,
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const selectedFiles = Array.from(files);

    if (value.length + files.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed. Currently ${value.length} uploaded.`,
        variant: "destructive",
      });
      return;
    }

    // setUploading(true);
    onChange([...selectedFiles]);

    // try {
    //   const uploadPromises = Array.from(files).map(async (file) => {
    //     // Validate file size (max 10MB)
    //     if (file.size > 10 * 1024 * 1024) {
    //       throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
    //     }

    //     const fileExt = file.name.split('.').pop();
    //     const fileName = `${uuidv4()}.${fileExt}`;
    //     const filePath = `${scope}/${fileName}`;

    //     // Upload to Supabase Storage
    //     // const { data, error } = await supabase.storage
    //     //   .from('esms-documents')
    //     //   .upload(filePath, file, {
    //     //     cacheControl: '3600',
    //     //     upsert: false,
    //     //   });

    //     // if (error) throw error;

    //     // Get public URL
    //     // const { data: urlData } = supabase.storage
    //     //   .from('esms-documents')
    //     //   .getPublicUrl(filePath);

    //     // return {
    //     //   url: urlData.publicUrl,
    //     //   name: file.name,
    //     //   path: filePath,
    //     // };
    //   });

    //   const uploadedFiles = await Promise.all(uploadPromises);
    //   const newUrls = []
    // //   uploadedFiles.map(f => f.url);

    //   onChange([...value, ...newUrls]);

    //   toast({
    //     title: "Upload Successful",
    //     description: `${uploadedFiles.length} file(s) uploaded successfully.`,
    //   });
    // } catch (error: any) {
    //   console.error('Upload error:', error);
    //   toast({
    //     title: "Upload Failed",
    //     description: error.message || "Failed to upload files. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setUploading(false);
    //   event.target.value = ''; // Reset input
    // }
  };

  const handleRemove = async (urlToRemove: string) => {
    // onChange(value.filter(url => url !== urlToRemove));
    let body = { fileUrl: urlToRemove };
    let deleteFileResponse = await httpClient.post(`ghg-accounting/ghg-data-collection/evidence-files/${entryId}`, {
      ...body
    });
    if (deleteFileResponse.status === 200) {
      toast({
        title: "File Removed",
        description: "Evidence file has been removed.",
      });
      setReloadData && setReloadData(true);
    }
    // onChange(updatedFiles.map(f => f.url) as unknown as File[]);

  };

  const viewEvidenceDocument = async (url: string) => {
    try {
      //window.open(url, '_blank');
      let signedUrlResponse = await httpClient.get(`ghg-accounting/ghg-data-collection/${entryId}/evidence-files/signed-urls?key=${url}`);
      if (signedUrlResponse.status === 200) {
        const signedUrl = signedUrlResponse.data['signedUrl'];
        window.open(signedUrl, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to open the document.",
      });
    }

  }

  const getFileName = (url: string): string => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('?')[0] || 'File';
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Upload Button */}
      {value.length < maxFiles && (
        <div>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.csv"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${scope}`}
          />
          <label htmlFor={`file-upload-${scope}`}>
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files ({value.length}/{maxFiles})
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2 mt-3">
          {uploadedFiles.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-md bg-muted/50"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{getFileName(url.url)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => viewEvidenceDocument(url.url)}
                >
                  View
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(url.url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No evidence files uploaded yet
        </p>
      )}
    </div>
  );
};

export default EvidenceFileUpload;