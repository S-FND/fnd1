import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, FileText, Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { httpClient } from '@/lib/httpClient';
import { ENV } from "@/config/env";
const API_URL = ENV.API_URL;

interface ESMSDocument {
  id: string;
  title: string;
  subItems?: string[];
  fileChange: boolean;
  isApplicable: string;
  fileName?: string;
  fileUrl?: string;
}

interface ESMSDocumentSection {
  id: string;
  title: string;
  description: string;
  documents: ESMSDocument[];
}

const ESMSPage: React.FC = () => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    sectionId: string;
    documentId: string;
    documentTitle: string;
    fileUrl?: string;
  }>({
    open: false,
    sectionId: '',
    documentId: '',
    documentTitle: '',
    fileUrl: ''
  });

  const [documentSections, setDocumentSections] = useState<ESMSDocumentSection[]>([
    {
      id: 'compliance',
      title: 'Compliance - Registration/Filing/Returns/Reports',
      description: 'Legal compliance documents and regulatory registrations',
      documents: [
        { id: 'env-clearance', title: 'Environmental clearances', fileChange: false, isApplicable: "yes" },
        { id: 'hazard-waste', title: 'Hazardous waste authorizations', fileChange: false, isApplicable: "yes" },
        { id: 'epr-ewaste', title: 'EPR Registration and Filing - E-waste', fileChange: false, isApplicable: "yes" },
        { id: 'epr-used-oil', title: 'EPR Registration and Filing - Used Oil', fileChange: false, isApplicable: "yes" },
        { id: 'epr-plastic', title: 'EPR Registration and Filing - Plastic', fileChange: false, isApplicable: "yes" },
        { id: 'epr-battery', title: 'EPR Registration and Filing - Battery', fileChange: false, isApplicable: "yes" },
        { id: 'epr-tyre', title: 'EPR Registration and Filing - Tyre', fileChange: false, isApplicable: "yes" },
        { id: 'waste-recycling', title: 'Authorized waste recycling/disposal certificates', fileChange: false, isApplicable: "yes" },
        {
          id: 'pollution-consent',
          title: 'State Pollution Control Board Consent',
          subItems: ['Consent to Establish', 'Consent to Operate'],
          fileChange: false,
          isApplicable: "yes"
        },
        { id: 'trem-card', title: 'TREM Card for Transportation', fileChange: false, isApplicable: "yes" },
        { id: 'building-stability', title: 'Building Stability Certificate', fileChange: false, isApplicable: "yes" },
        { id: 'electrical-inspector', title: 'Electrical Inspector for operation of Generator set(s)', fileChange: false, isApplicable: "yes" },
        { id: 'industrial-order', title: 'Industrial Standing Order approved from Factory Inspector', fileChange: false, isApplicable: "yes" },
        { id: 'psara-license', title: 'PSARA license of the Security Agency (under Private Security Agency Regulation Act)', fileChange: false, isApplicable: "yes" },
        { id: 'factory-plan', title: 'Factory Approved Plan by DISH (Dept. of Industrial Safety & Health)', fileChange: false, isApplicable: "yes" },
        { id: 'env-statement', title: 'Environmental Statement in Form V', fileChange: false, isApplicable: "yes" },
        { id: 'esia-reports', title: 'Environmental & Social Impact Assessment (ESIA/EIA) Reports', fileChange: false, isApplicable: "yes" },
        { id: 'bore-well', title: 'Registration Certificate of bore well', fileChange: false, isApplicable: "yes" },
        { id: 'groundwater-license', title: 'Groundwater use license/registration (Central Ground Water Authority)', fileChange: false, isApplicable: "yes" },
        { id: 'factories-license', title: 'Factories Act License', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-principal', title: 'Labor Department Registrations - Principal Employer', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-minimum-wages', title: 'Labor Department Registrations - Minimum wages', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-muster-roll', title: 'Labor Department Registrations - Muster roll', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-accident', title: 'Labor Department Registrations - Accident/incident', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-leave-compliance', title: 'Labor Department Registrations - Leave compliance as per S&E Act', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-holiday-list', title: 'Labor Department Registrations - Holiday List as per S&E Act', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-interstate', title: 'Labor Department Registrations - Inter-state Migrant labor Registration', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-construction', title: 'Labor Department Registrations - Building & Other Construction Workers', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-welfare', title: 'Labor Department Registrations - Labor Welfare Fund', fileChange: false, isApplicable: "yes" },
        { id: 'labor-reg-trade-union', title: 'Labor Department Registrations - Trade Union', fileChange: false, isApplicable: "yes" },
        { id: 'labor-register-overtime', title: 'Labor Department Registers - Overtime', fileChange: false, isApplicable: "yes" },
        { id: 'labor-register-wages', title: 'Labor Department Registers - Wages (including deductions, fines, advances)', fileChange: false, isApplicable: "yes" },
        { id: 'labor-register-attendance', title: 'Labor Department Registers - Muster roll / Attendance', fileChange: false, isApplicable: "yes" },
        { id: 'labor-register-accident', title: 'Labor Department Registers - Accident/incident', fileChange: false, isApplicable: "yes" },
        { id: 'labor-register-maternity', title: 'Labor Department Registers - Maternity Benefit register', fileChange: false, isApplicable: "yes" },
        { id: 'labor-register-grievance', title: 'Labor Department Registers - Grievance Register', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-factory', title: 'Labor Department Annual returns filing - Factory Annual Return (Form 21)', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-minimum-wages', title: 'Labor Department Annual returns filing - Minimum wages', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-muster-roll', title: 'Labor Department Annual returns filing - Muster roll', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-accident', title: 'Labor Department Annual returns filing - Accident/incident', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-contract', title: 'Labor Department Annual returns filing - Contract labor', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-maternity', title: 'Labor Department Annual returns filing - Maternity Benefits', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-interstate', title: 'Labor Department Annual returns filing - Inter-state Migrant labor', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-construction', title: 'Labor Department Annual returns filing - Building & Other Construction Workers', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-welfare', title: 'Labor Department Annual returns filing - Labor Welfare Fund', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-trade-union', title: 'Labor Department Annual returns filing - Trade Union', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-posh', title: 'Labor Department Annual returns filing - POSH', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-gratuity', title: 'Labor Department Annual returns filing - Gratuity', fileChange: false, isApplicable: "yes" },
        { id: 'labor-returns-bonus', title: 'Labor Department Annual returns filing - Payment of Bonus', fileChange: false, isApplicable: "yes" },
        { id: 'display-abstracts', title: 'Display Requirements- Facility - Abstracts of major Acts (Wages, Bonus, Equal Remuneration, Minimum Wage, Child Labour, etc.)', fileChange: false, isApplicable: "yes" },
        { id: 'display-name-address', title: 'Display Requirements- Facility - Name & address of the establishment', fileChange: false, isApplicable: "yes" },
        { id: 'display-working-hours', title: 'Display Requirements- Facility - Working hours', fileChange: false, isApplicable: "yes" },
        { id: 'display-holidays', title: 'Display Requirements- Facility - List of holidays', fileChange: false, isApplicable: "yes" },
        { id: 'display-factory-license', title: 'Display Requirements- Facility - Factory license', fileChange: false, isApplicable: "yes" },
        { id: 'display-fssai', title: 'Display Requirements- Facility - FSSAI License', fileChange: false, isApplicable: "yes" },
        { id: 'display-emergency', title: 'Display Requirements- Facility - Emergency Contacts', fileChange: false, isApplicable: "yes" },
        { id: 'display-grievance', title: 'Display Requirements- Facility - Grievance Redressal Mechanism Policy and Procedure (English and Local language)', fileChange: false, isApplicable: "yes" },
        { id: 'esic-registration', title: 'ESIC Registration', fileChange: false, isApplicable: "yes" },
        { id: 'epfo-registration', title: 'EPFO Registration', fileChange: false, isApplicable: "yes" },
        { id: 'professional-tax', title: 'Professional Tax Registration', fileChange: false, isApplicable: "yes" },
        { id: 'shops-establishment', title: 'Shops and Establishment Registration', fileChange: false, isApplicable: "yes" },
        { id: 'building-occupancy', title: 'Building Occupancy Certificate (BOC)', fileChange: false, isApplicable: "yes" },
        { id: 'fire-noc', title: 'Fire NOC', fileChange: false, isApplicable: "yes" },
        { id: 'fssai-cert', title: 'FSSAI Certification', fileChange: false, isApplicable: "yes" },
        { id: 'cdsco-registration', title: 'CDSCO Registration', fileChange: false, isApplicable: "yes" },
        { id: 'electricity-serc', title: 'Electricity Regulatory Registration - SERC (State Electricity Regulatory Commission)', fileChange: false, isApplicable: "yes" },
        { id: 'electricity-cerc', title: 'Electricity Regulatory Registration - CERC (Central Electricity Regulatory Commission)', fileChange: false, isApplicable: "yes" },
        { id: 'msme-registration', title: 'MSME (Udyam) Registration', fileChange: false, isApplicable: "yes" },
        { id: 'ssi-registration', title: 'National Small-Scale Industries Registration', fileChange: false, isApplicable: "yes" },
        { id: 'iec-certificate', title: 'Importer-Exporter Code Certificate', fileChange: false, isApplicable: "yes" },
        { id: 'trade-license', title: 'Trade License', fileChange: false, isApplicable: "yes" },
        { id: 'legal-metrology', title: 'Legal Metrology Certificate', fileChange: false, isApplicable: "yes" },
        { id: 'bis-certificate', title: 'BIS Certificate', fileChange: false, isApplicable: "yes" },
        { id: 'rohs-certificate', title: 'RoHS Certificate', fileChange: false, isApplicable: "yes" },
      ]
    },
    {
      id: 'policies',
      title: 'Policies/SOPs',
      description: 'Corporate policies and standard operating procedures',
      documents: [
        { id: 'esg-policy', title: 'Environmental, Social, and Governance Policy', fileChange: false, isApplicable: "yes" },
        { id: 'code-conduct', title: 'Code of Conduct and Business Ethics', fileChange: false, isApplicable: "yes" },
        { id: 'ehs-policy', title: 'Environment, Health, Safety (EHS) Policy', fileChange: false, isApplicable: "yes" },
        { id: 'human-rights', title: 'Human Rights and Fair Labor Policy', fileChange: false, isApplicable: "yes" },
        { id: 'equal-opportunity', title: 'Equal Opportunity Policy', fileChange: false, isApplicable: "yes" },
        { id: 'diversity-policy', title: 'Diversity, Equity & Inclusion Policy', fileChange: false, isApplicable: "yes" },
        { id: 'gender-equality', title: 'Gender Equality Policy', fileChange: false, isApplicable: "yes" },
        { id: 'employee-handbook', title: 'Employee Handbook', fileChange: false, isApplicable: "yes" },
        { id: 'hr-policy', title: 'HR Policy and Procedures', fileChange: false, isApplicable: "yes" },
        { id: 'anti-bribery', title: 'Anti-Bribery and Anti-Corruption Policy', fileChange: false, isApplicable: "yes" },
        { id: 'whistleblower', title: 'Whistleblower Policy', fileChange: false, isApplicable: "yes" },
        { id: 'grievance-redressal', title: 'Grievance Redressal Policy', fileChange: false, isApplicable: "yes" },
        { id: 'responsible-sourcing', title: 'Responsible Sourcing & Supply Chain Policy', fileChange: false, isApplicable: "yes" },
        { id: 'stakeholder-engagement', title: 'Stakeholder Engagement Plan', fileChange: false, isApplicable: "yes" },
        { id: 'community-development', title: 'Community Development Policy', fileChange: false, isApplicable: "yes" },
        { id: 'data-privacy', title: 'Data Privacy and Protection Policy', fileChange: false, isApplicable: "yes" },
        { id: 'occupational-health', title: 'Occupational Health and Safety Policy', fileChange: false, isApplicable: "yes" },
        { id: 'energy-management', title: 'Energy Management Policy', fileChange: false, isApplicable: "yes" },
        { id: 'biodiversity-conservation', title: 'Biodiversity Conservation Policy', fileChange: false, isApplicable: "yes" },
        { id: 'waste-management', title: 'Waste Management Policy', fileChange: false, isApplicable: "yes" },
        { id: 'water-resource', title: 'Water Resource Management Policy', fileChange: false, isApplicable: "yes" },
        { id: 'land-acquisition', title: 'Land Acquisition and Resettlement Policy', fileChange: false, isApplicable: "yes" },
        { id: 'child-labor', title: 'Child Labor & Forced Labor Prohibition Policy', fileChange: false, isApplicable: "yes" },
        { id: 'retrenchment-policy', title: 'Retrenchment Policy', fileChange: false, isApplicable: "yes" },
        { id: 'posh-policy', title: 'Prevention of Sexual Harassment (POSH) Policy', fileChange: false, isApplicable: "yes" },
        { id: 'risk-management', title: 'Risk Management Framework (including E&S risks)', fileChange: false, isApplicable: "yes" },
        { id: 'materiality-assessment', title: 'Materiality Assessment Framework', fileChange: false, isApplicable: "yes" },
        { id: 'supplier-code', title: 'Supplier Code of Conduct', fileChange: false, isApplicable: "yes" },
        { id: 'monitoring-sop', title: 'Monitoring & Measurement SOP (for ESG KPIs and compliance tracking)', fileChange: false, isApplicable: "yes" },
        { id: 'record-keeping', title: 'Record Keeping & Documentation SOP', fileChange: false, isApplicable: "yes" },
        { id: 'hira', title: 'Hazard Identification and Risk Assessment (HIRA)', fileChange: false, isApplicable: "yes" },
        { id: 'ppe-usage', title: 'PPE Usage Policy and SOP', fileChange: false, isApplicable: "yes" },
        { id: 'job-safety', title: 'Job/Process Safety Analysis', fileChange: false, isApplicable: "yes" },
        { id: 'legal-compliance', title: 'Legal Compliance Register', fileChange: false, isApplicable: "yes" },
        { id: 'emergency-response', title: 'Emergency Response and Preparedness Plan', fileChange: false, isApplicable: "yes" },
        { id: 'fire-safety', title: 'Fire and Electrical Safety Certificates and SOP', fileChange: false, isApplicable: "yes" },
        { id: 'incident-management', title: 'Incident Management Policy and Register', fileChange: false, isApplicable: "yes" },
        { id: 'first-aid', title: 'First Aid Policy and Consumption Records', fileChange: false, isApplicable: "yes" },
      ]
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem('fandoro-user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };
  const entityId = getUserEntityId();
  const token = localStorage.getItem('fandoro-token');

  useEffect(() => {
    if (entityId) {
      loadESMSData();
    }
  }, [entityId]);

  const loadESMSData = async () => {
    try {
      setIsLoading(true);
      const response: any = await httpClient.get(`document/esms/${entityId}`);
      if (response.data && response.data.data) {
        const savedData = response.data.data;

        setDocumentSections(prevSections =>
          prevSections.map(section => ({
            ...section,
            documents: section.documents.map(doc => {
              const fieldName = doc.id.replace(/-/g, '_');

              if (savedData[fieldName]) {
                const savedDoc = savedData[fieldName];

                if (Array.isArray(savedDoc.file_path) && savedDoc.file_path.length > 0) {
                  const fileUrl = savedDoc.file_path[0];
                  const transformedUrl = `https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/${fileUrl}`;
                  return {
                    id: doc.id,
                    title: doc.title,
                    subItems: doc.subItems,
                    fileChange: true,
                    isApplicable: "yes",
                    fileName: savedDoc.file_path[0].split('/').pop() || '',
                    fileUrl: transformedUrl
                  };
                }
                else if (savedDoc.isApplicable === "no") {
                  return {
                    ...doc, // Keep all existing doc properties
                    isApplicable: "no",
                    fileChange: false,
                    fileName: undefined,
                    fileUrl: undefined
                  };
                }
              }
              return doc;
            })
          }))
        );
      }
    } catch (error) {
      console.error('Error loading ESMS ', error);
      // toast.error('Failed to load ESMS data');
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentNumber = (sectionIndex: number, docIndex: number, documentId: string): string => {
    const baseNumber = `${sectionIndex + 1}.${docIndex + 1}`;

    if (documentId.startsWith('epr-')) {
      const eprSubItems = ['epr-ewaste', 'epr-used-oil', 'epr-plastic', 'epr-battery', 'epr-tyre'];
      const eprIndex = eprSubItems.indexOf(documentId);
      if (eprIndex !== -1) {
        const letter = String.fromCharCode(97 + eprIndex);
        return `${sectionIndex + 1}.3.${letter}`;
      }
    }

    if (documentId.startsWith('labor-reg-')) {
      const laborRegSubItems = [
        'labor-reg-principal', 'labor-reg-minimum-wages', 'labor-reg-muster-roll',
        'labor-reg-accident', 'labor-reg-leave-compliance', 'labor-reg-holiday-list',
        'labor-reg-interstate', 'labor-reg-construction', 'labor-reg-welfare', 'labor-reg-trade-union'
      ];
      const laborRegIndex = laborRegSubItems.indexOf(documentId);
      if (laborRegIndex !== -1) {
        const letter = String.fromCharCode(97 + laborRegIndex);
        return `${sectionIndex + 1}.17.${letter}`;
      }
    }

    if (documentId.startsWith('labor-register-')) {
      const laborRegisterSubItems = [
        'labor-register-overtime', 'labor-register-wages', 'labor-register-attendance',
        'labor-register-accident', 'labor-register-maternity', 'labor-register-grievance'
      ];
      const laborRegisterIndex = laborRegisterSubItems.indexOf(documentId);
      if (laborRegisterIndex !== -1) {
        const letter = String.fromCharCode(97 + laborRegisterIndex);
        return `${sectionIndex + 1}.18.${letter}`;
      }
    }

    if (documentId.startsWith('labor-returns-')) {
      const laborReturnsSubItems = [
        'labor-returns-factory', 'labor-returns-minimum-wages', 'labor-returns-muster-roll',
        'labor-returns-accident', 'labor-returns-contract', 'labor-returns-maternity',
        'labor-returns-interstate', 'labor-returns-construction', 'labor-returns-welfare',
        'labor-returns-trade-union', 'labor-returns-posh', 'labor-returns-gratuity', 'labor-returns-bonus'
      ];
      const laborReturnsIndex = laborReturnsSubItems.indexOf(documentId);
      if (laborReturnsIndex !== -1) {
        const letter = String.fromCharCode(97 + laborReturnsIndex);
        return `${sectionIndex + 1}.19.${letter}`;
      }
    }

    if (documentId.startsWith('display-')) {
      const displaySubItems = [
        'display-abstracts', 'display-name-address', 'display-working-hours', 'display-holidays',
        'display-factory-license', 'display-fssai', 'display-emergency', 'display-grievance'
      ];
      const displayIndex = displaySubItems.indexOf(documentId);
      if (displayIndex !== -1) {
        const letter = String.fromCharCode(97 + displayIndex);
        return `${sectionIndex + 1}.20.${letter}`;
      }
    }

    if (documentId.startsWith('electricity-')) {
      const electricitySubItems = ['electricity-serc', 'electricity-cerc'];
      const electricityIndex = electricitySubItems.indexOf(documentId);
      if (electricityIndex !== -1) {
        const letter = String.fromCharCode(97 + electricityIndex);
        return `${sectionIndex + 1}.29.${letter}`;
      }
    }

    if (sectionIndex === 0) {
      if (docIndex >= 7) {
        return `${sectionIndex + 1}.${docIndex - 3}`;
      }
    }

    return baseNumber;
  };

  const handleFileUpload = async (sectionId: string, documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const fileName = files[0].name;
        const formData = new FormData();

        const fieldName = documentId.replace(/-/g, '_') + '_file';
        formData.append(fieldName, files[0]);

        const dataToSave = {
          entityId: entityId,
          [documentId.replace(/-/g, '_')]: {
            file_path: [fileName],
            fileChange: true
          }
        };

        formData.append('data', JSON.stringify(dataToSave));

        for (let [key, value] of formData.entries()) {
          console.log(key, value.constructor.name, value);
        }
        const response = await fetch(`${API_URL}/document/esms`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        await loadESMSData();
        toast.success(`Document "${fileName}" uploaded successfully`);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload document');
      }
    }
  };

  const handleNotApplicableToggle = async (sectionId: string, documentId: string, checked: boolean) => {
    try {
      setDocumentSections(prev =>
        prev.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              documents: section.documents.map(doc => {
                if (doc.id === documentId) {
                  return {
                    ...doc,
                    isApplicable: checked ? "no" : "yes",
                    fileChange: checked ? false : doc.fileChange,
                    fileName: checked ? undefined : doc.fileName
                  };
                }
                return doc;
              })
            };
          }
          return section;
        })
      );

      const dataToSave = {
        entityId: entityId,
        [documentId.replace(/-/g, '_')]: {
          answer: checked ? "no" : "yes",
          isApplicable: checked ? "no" : "yes",
          fileChange: checked ? false : true
        }
      };

      await httpClient.post('document/esms', {
        data: JSON.stringify(dataToSave)
      });

      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating document status:', error);
      toast.error('Failed to update document status');
    }
  };

  const handleDeleteDocument = async (sectionId: string, documentId: string, documentTitle: string, fileUrl?: string) => {
    try {
      setDeleteDialog({
        open: true,
        sectionId,
        documentId,
        documentTitle,
        fileUrl
      });
    } catch (error) {
      console.error('Error initiating document deletion:', error);
      toast.error('Failed to initiate document deletion');
    }
  };

  const confirmDeleteDocument = async () => {
    try {
      const { sectionId, documentId, documentTitle, fileUrl } = deleteDialog;

      if (fileUrl) {
        const filePath = fileUrl.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/', '');

        const payload :any = {
          filesToDelete: [filePath]
        };

        const response = await fetch(`${API_URL}/document/esms`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            filesToDelete: [filePath],
          })
        });
      }
      
      setDocumentSections(prev => prev.map(section =>
        section.id === sectionId
          ? {
            ...section,
            documents: section.documents.map(doc =>
              doc.id === documentId
                ? { ...doc, fileChange: false, fileName: undefined, fileUrl: undefined }
                : doc
            )
          }
          : section
      ));

      toast.success(`Document "${documentTitle}" has been archived`);
      setDeleteDialog({ open: false, sectionId: '', documentId: '', documentTitle: '', fileUrl: '' });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to archive document');
    }
  };

  const calculateSectionProgress = (section: ESMSDocumentSection) => {
    const applicableDocuments = section.documents.filter(doc => doc.isApplicable === "yes");
    const uploadedDocuments = applicableDocuments.filter(doc => doc.fileChange);
    return applicableDocuments.length > 0 ? (uploadedDocuments.length / applicableDocuments.length) * 100 : 100;
  };

  const calculateOverallProgress = () => {
    const allApplicableDocuments = documentSections.flatMap(section =>
      section.documents.filter(doc => doc.isApplicable === "yes")
    );
    const allUploadedDocuments = allApplicableDocuments.filter(doc => doc.fileChange);
    return allApplicableDocuments.length > 0 ? (allUploadedDocuments.length / allApplicableDocuments.length) * 100 : 100;
  };

  const handleViewFile = (fileUrl: string) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const saveAllDocuments = async () => {
    try {
      setIsLoading(true);

      const dataToSave: any = {
        entityId: entityId
      };

      documentSections.forEach(section => {
        section.documents.forEach(doc => {
          const fieldKey = doc.id.replace(/-/g, '_');
          dataToSave[fieldKey] = {
            fileChange: doc.fileChange,
            isApplicable: doc.isApplicable,
            fileName: doc.fileName,
            fileUrl: doc.fileUrl
          };
        });
      });

      await httpClient.post('document/esms', {
        data: JSON.stringify(dataToSave)
      });

      toast.success('Data saved successfully');
    } catch (error) {
      console.error('Error saving documents:', error);
      toast.error('Failed to save documents');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Environmental and Social Management System (ESMS)</h1>
        <p className="text-muted-foreground">
          Comprehensive ESG management framework and documentation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ESMS Completion Progress</CardTitle>
          <CardDescription>
            Overall document completion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(calculateOverallProgress())}%</span>
              </div>
              <Progress value={calculateOverallProgress()} className="h-3" />
            </div>

            {documentSections.map(section => (
              <div key={section.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{section.title}</span>
                  <span>{Math.round(calculateSectionProgress(section))}%</span>
                </div>
                <Progress value={calculateSectionProgress(section)} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {documentSections.map((section, sectionIndex) => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {sectionIndex + 1}
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </div>
              <Badge variant="outline">
                {section.documents.filter(doc => doc.isApplicable === "yes" && doc.fileChange).length} / {section.documents.filter(doc => doc.isApplicable === "yes").length} completed
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.documents.map((document, docIndex) => (
                <div key={document.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {getDocumentNumber(sectionIndex, docIndex, document.id)}
                        </span>
                        <h4 className="font-medium">{document.title}</h4>
                        {document.fileChange && (
                          <Badge variant="default" className="ml-2">
                            <Check className="w-3 h-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                        {/* {document.isApplicable && (
                          <Badge variant="secondary" className="ml-2">
                            N/A
                          </Badge>
                        )} */}
                      </div>

                      {document.subItems && document.subItems.length > 0 && (
                        <div className="ml-4 mt-2">
                          <p className="text-sm text-muted-foreground mb-1">Sub-items:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {document.subItems.map((subItem, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                {subItem}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {document.fileName && (
                        <div className="mt-2">
                          <Badge variant="outline">
                            <FileText className="w-3 h-3 mr-1" />
                            {document.fileName}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`na-${document.id}`}
                          checked={document.isApplicable === "no"}
                          onCheckedChange={(checked) => handleNotApplicableToggle(section.id, document.id, checked as boolean)}
                        />
                        <Label htmlFor={`na-${document.id}`} className="text-sm">
                          Not Applicable
                        </Label>
                      </div>

                      {document.isApplicable === "yes" && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            id={`upload-${section.id}-${document.id}`}
                            className="hidden"
                            onChange={(e) => {
                              handleFileUpload(section.id, document.id, e);
                            }}
                            accept=".pdf,.doc,.docx,.xlsx,.xls"
                          />

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const fileInput = window.document.getElementById(`upload-${section.id}-${document.id}`);
                              if (fileInput) {
                                fileInput.click();
                              }
                            }}
                            disabled={isLoading}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {document.fileChange ? 'Replace' : 'Upload'}
                          </Button>
                          {document.fileChange && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewFile(document.fileUrl)}
                                className="text-blue-600 hover:text-blue-800"
                                disabled={isLoading}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteDocument(section.id, document.id, document.title, document.fileUrl)}
                                className="text-destructive hover:text-destructive"
                                disabled={isLoading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button
          onClick={saveAllDocuments}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Saving...' : 'Save All Documents'}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.documentTitle}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDocument}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ESMSPage;