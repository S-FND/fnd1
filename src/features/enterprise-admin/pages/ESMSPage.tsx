import React, { useState } from 'react';
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

interface ESMSDocument {
  id: string;
  title: string;
  subItems?: string[];
  isUploaded: boolean;
  isNotApplicable: boolean;
  fileName?: string;
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
  }>({
    open: false,
    sectionId: '',
    documentId: '',
    documentTitle: '',
  });

  const getDocumentNumber = (sectionIndex: number, docIndex: number, documentId: string): string => {
    const baseNumber = `${sectionIndex + 1}.${docIndex + 1}`;
    
    // Handle EPR Registration and Filing sub-items with custom numbering
    if (documentId.startsWith('epr-')) {
      const eprSubItems = ['epr-ewaste', 'epr-used-oil', 'epr-plastic', 'epr-battery', 'epr-tyre'];
      const eprIndex = eprSubItems.indexOf(documentId);
      if (eprIndex !== -1) {
        const letter = String.fromCharCode(97 + eprIndex); // 'a', 'b', 'c', etc.
        return `${sectionIndex + 1}.3.${letter}`;
      }
    }
    
    // Handle Labor Department Registrations sub-items
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
    
    // Handle Labor Department Registers sub-items
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
    
    // Handle Labor Department Annual Returns sub-items
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
    
    // Handle Display Requirements sub-items
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
    
    // Handle Electricity Regulatory Registration sub-items
    if (documentId.startsWith('electricity-')) {
      const electricitySubItems = ['electricity-serc', 'electricity-cerc'];
      const electricityIndex = electricitySubItems.indexOf(documentId);
      if (electricityIndex !== -1) {
        const letter = String.fromCharCode(97 + electricityIndex);
        return `${sectionIndex + 1}.29.${letter}`;
      }
    }
    
    // Adjust numbering for documents after sub-items
    if (sectionIndex === 0) { // Compliance section
      if (docIndex >= 7) { // After the 5 EPR items (indices 2-6), adjust by 4
        return `${sectionIndex + 1}.${docIndex - 3}`;
      }
    }
    
    return baseNumber;
  };

  const [documentSections, setDocumentSections] = useState<ESMSDocumentSection[]>([
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
        { id: 'labor-reg-principal', title: 'Labor Department Registrations - Principal Employer', isUploaded: false, isNotApplicable: false },
        { id: 'labor-reg-minimum-wages', title: 'Labor Department Registrations - Minimum wages', isUploaded: false, isNotApplicable: false },
        { id: 'labor-reg-muster-roll', title: 'Labor Department Registrations - Muster roll', isUploaded: false, isNotApplicable: false },
        { id: 'labor-reg-accident', title: 'Labor Department Registrations - Accident/incident', isUploaded: false, isNotApplicable: false },
        { id: 'labor-reg-leave-compliance', title: 'Labor Department Registrations - Leave compliance as per S&E Act', isUploaded: false, isNotApplicable: false },
        { id: 'labor-reg-holiday-list', title: 'Labor Department Registrations - Holiday List as per S&E Act', isUploaded: false, isNotApplicable: false },
        { id: 'labor-reg-interstate', title: 'Labor Department Registrations - Inter-state Migrant labor Registration', isUploaded: false, isNotApplicable: false },
        { id: 'labor-reg-construction', title: 'Labor Department Registrations - Building & Other Construction Workers', isUploaded: false, isNotApplicable: false },
        { id: 'labor-reg-welfare', title: 'Labor Department Registrations - Labor Welfare Fund', isUploaded: false, isNotApplicable: false },
        { id: 'labor-reg-trade-union', title: 'Labor Department Registrations - Trade Union', isUploaded: false, isNotApplicable: false },
        { id: 'labor-register-overtime', title: 'Labor Department Registers - Overtime', isUploaded: false, isNotApplicable: false },
        { id: 'labor-register-wages', title: 'Labor Department Registers - Wages (including deductions, fines, advances)', isUploaded: false, isNotApplicable: false },
        { id: 'labor-register-attendance', title: 'Labor Department Registers - Muster roll / Attendance', isUploaded: false, isNotApplicable: false },
        { id: 'labor-register-accident', title: 'Labor Department Registers - Accident/incident', isUploaded: false, isNotApplicable: false },
        { id: 'labor-register-maternity', title: 'Labor Department Registers - Maternity Benefit register', isUploaded: false, isNotApplicable: false },
        { id: 'labor-register-grievance', title: 'Labor Department Registers - Grievance Register', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-factory', title: 'Labor Department Annual returns filing - Factory Annual Return (Form 21)', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-minimum-wages', title: 'Labor Department Annual returns filing - Minimum wages', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-muster-roll', title: 'Labor Department Annual returns filing - Muster roll', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-accident', title: 'Labor Department Annual returns filing - Accident/incident', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-contract', title: 'Labor Department Annual returns filing - Contract labor', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-maternity', title: 'Labor Department Annual returns filing - Maternity Benefits', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-interstate', title: 'Labor Department Annual returns filing - Inter-state Migrant labor', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-construction', title: 'Labor Department Annual returns filing - Building & Other Construction Workers', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-welfare', title: 'Labor Department Annual returns filing - Labor Welfare Fund', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-trade-union', title: 'Labor Department Annual returns filing - Trade Union', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-posh', title: 'Labor Department Annual returns filing - POSH', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-gratuity', title: 'Labor Department Annual returns filing - Gratuity', isUploaded: false, isNotApplicable: false },
        { id: 'labor-returns-bonus', title: 'Labor Department Annual returns filing - Payment of Bonus', isUploaded: false, isNotApplicable: false },
        { id: 'display-abstracts', title: 'Display Requirements- Facility - Abstracts of major Acts (Wages, Bonus, Equal Remuneration, Minimum Wage, Child Labour, etc.)', isUploaded: false, isNotApplicable: false },
        { id: 'display-name-address', title: 'Display Requirements- Facility - Name & address of the establishment', isUploaded: false, isNotApplicable: false },
        { id: 'display-working-hours', title: 'Display Requirements- Facility - Working hours', isUploaded: false, isNotApplicable: false },
        { id: 'display-holidays', title: 'Display Requirements- Facility - List of holidays', isUploaded: false, isNotApplicable: false },
        { id: 'display-factory-license', title: 'Display Requirements- Facility - Factory license', isUploaded: false, isNotApplicable: false },
        { id: 'display-fssai', title: 'Display Requirements- Facility - FSSAI License', isUploaded: false, isNotApplicable: false },
        { id: 'display-emergency', title: 'Display Requirements- Facility - Emergency Contacts', isUploaded: false, isNotApplicable: false },
        { id: 'display-grievance', title: 'Display Requirements- Facility - Grievance Redressal Mechanism Policy and Procedure (English and Local language)', isUploaded: false, isNotApplicable: false },
        { id: 'esic-registration', title: 'ESIC Registration', isUploaded: false, isNotApplicable: false },
        { id: 'epfo-registration', title: 'EPFO Registration', isUploaded: false, isNotApplicable: false },
        { id: 'professional-tax', title: 'Professional Tax Registration', isUploaded: false, isNotApplicable: false },
        { id: 'shops-establishment', title: 'Shops and Establishment Registration', isUploaded: false, isNotApplicable: false },
        { id: 'building-occupancy', title: 'Building Occupancy Certificate (BOC)', isUploaded: false, isNotApplicable: false },
        { id: 'fire-noc', title: 'Fire NOC', isUploaded: false, isNotApplicable: false },
        { id: 'fssai-cert', title: 'FSSAI Certification', isUploaded: false, isNotApplicable: false },
        { id: 'cdsco-registration', title: 'CDSCO Registration', isUploaded: false, isNotApplicable: false },
        { id: 'electricity-serc', title: 'Electricity Regulatory Registration - SERC (State Electricity Regulatory Commission)', isUploaded: false, isNotApplicable: false },
        { id: 'electricity-cerc', title: 'Electricity Regulatory Registration - CERC (Central Electricity Regulatory Commission)', isUploaded: false, isNotApplicable: false },
        { id: 'msme-registration', title: 'MSME (Udyam) Registration', isUploaded: false, isNotApplicable: false },
        { id: 'ssi-registration', title: 'National Small-Scale Industries Registration', isUploaded: false, isNotApplicable: false },
        { id: 'iec-certificate', title: 'Importer-Exporter Code Certificate', isUploaded: false, isNotApplicable: false },
        { id: 'trade-license', title: 'Trade License', isUploaded: false, isNotApplicable: false },
        { id: 'legal-metrology', title: 'Legal Metrology Certificate', isUploaded: false, isNotApplicable: false },
        { id: 'bis-certificate', title: 'BIS Certificate', isUploaded: false, isNotApplicable: false },
        { id: 'rohs-certificate', title: 'RoHS Certificate', isUploaded: false, isNotApplicable: false },
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
        { id: 'data-privacy', title: 'Data Privacy and Protection Policy', isUploaded: false, isNotApplicable: false },
        { id: 'occupational-health', title: 'Occupational Health and Safety Policy', isUploaded: false, isNotApplicable: false },
        { id: 'energy-management', title: 'Energy Management Policy', isUploaded: false, isNotApplicable: false },
        { id: 'biodiversity-conservation', title: 'Biodiversity Conservation Policy', isUploaded: false, isNotApplicable: false },
        { id: 'waste-management', title: 'Waste Management Policy', isUploaded: false, isNotApplicable: false },
        { id: 'water-resource', title: 'Water Resource Management Policy', isUploaded: false, isNotApplicable: false },
        { id: 'land-acquisition', title: 'Land Acquisition and Resettlement Policy', isUploaded: false, isNotApplicable: false },
        { id: 'child-labor', title: 'Child Labor & Forced Labor Prohibition Policy', isUploaded: false, isNotApplicable: false },
        { id: 'retrenchment-policy', title: 'Retrenchment Policy', isUploaded: false, isNotApplicable: false },
        { id: 'posh-policy', title: 'Prevention of Sexual Harassment (POSH) Policy', isUploaded: false, isNotApplicable: false },
        { id: 'risk-management', title: 'Risk Management Framework (including E&S risks)', isUploaded: false, isNotApplicable: false },
        { id: 'materiality-assessment', title: 'Materiality Assessment Framework', isUploaded: false, isNotApplicable: false },
        { id: 'supplier-code', title: 'Supplier Code of Conduct', isUploaded: false, isNotApplicable: false },
        { id: 'monitoring-sop', title: 'Monitoring & Measurement SOP (for ESG KPIs and compliance tracking)', isUploaded: false, isNotApplicable: false },
        { id: 'record-keeping', title: 'Record Keeping & Documentation SOP', isUploaded: false, isNotApplicable: false },
        { id: 'hira', title: 'Hazard Identification and Risk Assessment (HIRA)', isUploaded: false, isNotApplicable: false },
        { id: 'ppe-usage', title: 'PPE Usage Policy and SOP', isUploaded: false, isNotApplicable: false },
        { id: 'job-safety', title: 'Job/Process Safety Analysis', isUploaded: false, isNotApplicable: false },
        { id: 'legal-compliance', title: 'Legal Compliance Register', isUploaded: false, isNotApplicable: false },
        { id: 'emergency-response', title: 'Emergency Response and Preparedness Plan', isUploaded: false, isNotApplicable: false },
        { id: 'fire-safety', title: 'Fire and Electrical Safety Certificates and SOP', isUploaded: false, isNotApplicable: false },
        { id: 'incident-management', title: 'Incident Management Policy and Register', isUploaded: false, isNotApplicable: false },
        { id: 'first-aid', title: 'First Aid Policy and Consumption Records', isUploaded: false, isNotApplicable: false },
      ]
    }
  ]);

  const handleFileUpload = (sectionId: string, documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setDocumentSections(prev => prev.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              documents: section.documents.map(doc => 
                doc.id === documentId 
                  ? { ...doc, isUploaded: true, fileName }
                  : doc
              )
            }
          : section
      ));
      toast.success(`Document "${fileName}" uploaded successfully`);
    }
  };

  const handleNotApplicableToggle = (sectionId: string, documentId: string, checked: boolean) => {
    setDocumentSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            documents: section.documents.map(doc => 
              doc.id === documentId 
                ? { ...doc, isNotApplicable: checked, isUploaded: checked ? false : doc.isUploaded, fileName: checked ? undefined : doc.fileName }
                : doc
            )
          }
        : section
    ));
  };

  const handleDeleteDocument = (sectionId: string, documentId: string, documentTitle: string) => {
    setDeleteDialog({
      open: true,
      sectionId,
      documentId,
      documentTitle,
    });
  };

  const confirmDeleteDocument = () => {
    const { sectionId, documentId, documentTitle } = deleteDialog;
    
    setDocumentSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            documents: section.documents.map(doc => 
              doc.id === documentId 
                ? { ...doc, isUploaded: false, fileName: undefined }
                : doc
            )
          }
        : section
    ));

    toast.success(`Document "${documentTitle}" has been deleted`);
    setDeleteDialog({ open: false, sectionId: '', documentId: '', documentTitle: '' });
  };

  const calculateSectionProgress = (section: ESMSDocumentSection) => {
    const applicableDocuments = section.documents.filter(doc => !doc.isNotApplicable);
    const uploadedDocuments = applicableDocuments.filter(doc => doc.isUploaded);
    return applicableDocuments.length > 0 ? (uploadedDocuments.length / applicableDocuments.length) * 100 : 100;
  };

  const calculateOverallProgress = () => {
    const allApplicableDocuments = documentSections.flatMap(section => 
      section.documents.filter(doc => !doc.isNotApplicable)
    );
    const allUploadedDocuments = allApplicableDocuments.filter(doc => doc.isUploaded);
    return allApplicableDocuments.length > 0 ? (allUploadedDocuments.length / allApplicableDocuments.length) * 100 : 100;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Environmental and Social Management System (ESMS)</h1>
        <p className="text-muted-foreground">
          Comprehensive ESG management framework and documentation
        </p>
      </div>

      {/* Overall Progress */}
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

      {/* Document Sections */}
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
                {section.documents.filter(doc => !doc.isNotApplicable && doc.isUploaded).length} / {section.documents.filter(doc => !doc.isNotApplicable).length} completed
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
                        {document.isUploaded && (
                          <Badge variant="default" className="ml-2">
                            <Check className="w-3 h-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                        {document.isNotApplicable && (
                          <Badge variant="secondary" className="ml-2">
                            N/A
                          </Badge>
                        )}
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
                          checked={document.isNotApplicable}
                          onCheckedChange={(checked) => handleNotApplicableToggle(section.id, document.id, checked as boolean)}
                        />
                        <Label htmlFor={`na-${document.id}`} className="text-sm">
                          Not Applicable
                        </Label>
                      </div>

                      {!document.isNotApplicable && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            id={`upload-${section.id}-${document.id}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(section.id, document.id, e)}
                            accept=".pdf,.doc,.docx,.xlsx,.xls"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.document.getElementById(`upload-${section.id}-${document.id}`)?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {document.isUploaded ? 'Replace' : 'Upload'}
                          </Button>
                          {document.isUploaded && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteDocument(section.id, document.id, document.title)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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