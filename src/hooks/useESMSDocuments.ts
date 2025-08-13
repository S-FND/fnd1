import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface ESMSDocument {
  id: string;
  title: string;
  subItems?: string[];
  isUploaded: boolean;
  isNotApplicable: boolean;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface ESMSDocumentSection {
  id: string;
  title: string;
  description: string;
  documents: ESMSDocument[];
}

export const useESMSDocuments = () => {
  const { user } = useAuth();
  const [documentSections, setDocumentSections] = useState<ESMSDocumentSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Load documents from database
  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('esms_documents')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      // Transform database data back to the expected format
      const sectionsMap = new Map<string, ESMSDocumentSection>();
      
      // Initialize with default structure
      initializeDefaultSections(sectionsMap);

      // Update with saved data
      data?.forEach(doc => {
        const section = sectionsMap.get(doc.section_id);
        if (section) {
          const docIndex = section.documents.findIndex(d => d.id === doc.document_id);
          if (docIndex !== -1) {
            section.documents[docIndex] = {
              ...section.documents[docIndex],
              isUploaded: doc.is_uploaded,
              isNotApplicable: doc.is_not_applicable,
              fileName: doc.file_name || undefined,
              fileUrl: doc.file_url || undefined,
              fileSize: doc.file_size || undefined,
              mimeType: doc.mime_type || undefined,
            };
          }
        }
      });

      setDocumentSections(Array.from(sectionsMap.values()));
    } catch (error) {
      console.error('Error loading ESMS documents:', error);
      toast.error('Failed to load documents');
      // Initialize with default structure on error
      const sectionsMap = new Map<string, ESMSDocumentSection>();
      initializeDefaultSections(sectionsMap);
      setDocumentSections(Array.from(sectionsMap.values()));
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = async (sectionId: string, documentId: string, updates: Partial<ESMSDocument>) => {
    if (!user) return;

    try {
      const documentData = {
        user_id: user.id,
        section_id: sectionId,
        document_id: documentId,
        title: updates.title || '',
        is_uploaded: updates.isUploaded ?? false,
        is_not_applicable: updates.isNotApplicable ?? false,
        file_name: updates.fileName,
        file_url: updates.fileUrl,
        file_size: updates.fileSize,
        mime_type: updates.mimeType,
      };

      const { error } = await supabase
        .from('esms_documents')
        .upsert(documentData, { onConflict: 'user_id,document_id' });

      if (error) throw error;

      // Update local state
      setDocumentSections(prev => prev.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              documents: section.documents.map(doc => 
                doc.id === documentId 
                  ? { ...doc, ...updates }
                  : doc
              )
            }
          : section
      ));

    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    }
  };

  const uploadFile = async (sectionId: string, documentId: string, file: File) => {
    if (!user) return;

    try {
      const fileName = `${user.id}/${documentId}-${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('esms-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('esms-documents')
        .getPublicUrl(fileName);

      await saveDocument(sectionId, documentId, {
        isUploaded: true,
        fileName: file.name,
        fileUrl: publicUrl,
        fileSize: file.size,
        mimeType: file.type,
      });

      toast.success(`Document "${file.name}" uploaded successfully`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const initializeDefaultSections = (sectionsMap: Map<string, ESMSDocumentSection>) => {
    // Add your default ESMS sections here
    const defaultSections: ESMSDocumentSection[] = [
      {
        id: 'compliance',
        title: 'Compliance - Registration/Filing/Returns/Reports',
        description: 'Legal compliance documents and regulatory registrations',
        documents: [
          { id: 'env-clearance', title: 'Environmental clearances', isUploaded: false, isNotApplicable: false },
          { id: 'hazard-waste', title: 'Hazardous waste authorizations', isUploaded: false, isNotApplicable: false },
          { id: 'epr-ewaste', title: 'EPR Registration and Filing - E-waste', isUploaded: false, isNotApplicable: false },
          { id: 'epr-used-oil', title: 'EPR Registration and Filing - Used Oil', isUploaded: false, isNotApplicable: false },
          { id: 'epr-plastic', title: 'EPR Registration and Filing - Plastic', isUploaded: false, isNotApplicable: false },
          { id: 'epr-battery', title: 'EPR Registration and Filing - Battery', isUploaded: false, isNotApplicable: false },
          { id: 'epr-tyre', title: 'EPR Registration and Filing - Tyre', isUploaded: false, isNotApplicable: false },
          { id: 'waste-recycling', title: 'Authorized waste recycling/disposal certificates', isUploaded: false, isNotApplicable: false },
          { 
            id: 'pollution-consent', 
            title: 'State Pollution Control Board Consent',
            subItems: ['Consent to Establish', 'Consent to Operate'],
            isUploaded: false, 
            isNotApplicable: false 
          },
          { id: 'trem-card', title: 'TREM Card for Transportation', isUploaded: false, isNotApplicable: false },
          { id: 'building-stability', title: 'Building Stability Certificate', isUploaded: false, isNotApplicable: false },
          { id: 'electrical-inspector', title: 'Electrical Inspector for operation of Generator set(s)', isUploaded: false, isNotApplicable: false },
          { id: 'industrial-order', title: 'Industrial Standing Order approved from Factory Inspector', isUploaded: false, isNotApplicable: false },
          { id: 'psara-license', title: 'PSARA license of the Security Agency (under Private Security Agency Regulation Act)', isUploaded: false, isNotApplicable: false },
          { id: 'factory-plan', title: 'Factory Approved Plan by DISH (Dept. of Industrial Safety & Health)', isUploaded: false, isNotApplicable: false },
          { id: 'env-statement', title: 'Environmental Statement in Form V', isUploaded: false, isNotApplicable: false },
          { id: 'esia-reports', title: 'Environmental & Social Impact Assessment (ESIA/EIA) Reports', isUploaded: false, isNotApplicable: false },
          { id: 'bore-well', title: 'Registration Certificate of bore well', isUploaded: false, isNotApplicable: false },
          { id: 'groundwater-license', title: 'Groundwater use license/registration (Central Ground Water Authority)', isUploaded: false, isNotApplicable: false },
          { id: 'factories-license', title: 'Factories Act License', isUploaded: false, isNotApplicable: false },
        ]
      },
      {
        id: 'policies',
        title: 'Policies/SOPs',
        description: 'Corporate policies and standard operating procedures',
        documents: [
          { id: 'esg-policy', title: 'Environmental, Social, and Governance Policy', isUploaded: false, isNotApplicable: false },
          { id: 'code-conduct', title: 'Code of Conduct and Business Ethics', isUploaded: false, isNotApplicable: false },
          { id: 'ehs-policy', title: 'Environment, Health, Safety (EHS) Policy', isUploaded: false, isNotApplicable: false },
          { id: 'human-rights', title: 'Human Rights and Fair Labor Policy', isUploaded: false, isNotApplicable: false },
          { id: 'equal-opportunity', title: 'Equal Opportunity Policy', isUploaded: false, isNotApplicable: false },
          { id: 'diversity-policy', title: 'Diversity, Equity & Inclusion Policy', isUploaded: false, isNotApplicable: false },
          { id: 'gender-equality', title: 'Gender Equality Policy', isUploaded: false, isNotApplicable: false },
          { id: 'employee-handbook', title: 'Employee Handbook', isUploaded: false, isNotApplicable: false },
          { id: 'hr-policy', title: 'HR Policy and Procedures', isUploaded: false, isNotApplicable: false },
          { id: 'anti-bribery', title: 'Anti-Bribery and Anti-Corruption Policy', isUploaded: false, isNotApplicable: false },
          { id: 'whistleblower', title: 'Whistleblower Policy', isUploaded: false, isNotApplicable: false },
          { id: 'grievance-redressal', title: 'Grievance Redressal Policy', isUploaded: false, isNotApplicable: false },
          { id: 'responsible-sourcing', title: 'Responsible Sourcing & Supply Chain Policy', isUploaded: false, isNotApplicable: false },
          { id: 'stakeholder-engagement', title: 'Stakeholder Engagement Plan', isUploaded: false, isNotApplicable: false },
          { id: 'community-development', title: 'Community Development Policy', isUploaded: false, isNotApplicable: false },
        ]
      }
    ];

    defaultSections.forEach(section => {
      sectionsMap.set(section.id, section);
    });
  };

  return {
    documentSections,
    loading,
    saveDocument,
    uploadFile,
    loadDocuments,
  };
};