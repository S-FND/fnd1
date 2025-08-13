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
import { useESMSDocuments, ESMSDocument, ESMSDocumentSection } from '@/hooks/useESMSDocuments';

const ESMSPage: React.FC = () => {
  const { documentSections, loading, saveDocument, uploadFile } = useESMSDocuments();
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

  const handleFileUpload = async (sectionId: string, documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Find the document to get its title
      const section = documentSections.find(s => s.id === sectionId);
      const document = section?.documents.find(d => d.id === documentId);
      
      if (document) {
        await uploadFile(sectionId, documentId, file);
      }
    }
  };

  const handleNotApplicableToggle = async (sectionId: string, documentId: string, checked: boolean) => {
    // Find the document to get its title
    const section = documentSections.find(s => s.id === sectionId);
    const document = section?.documents.find(d => d.id === documentId);
    
    if (document) {
      await saveDocument(sectionId, documentId, {
        ...document,
        isNotApplicable: checked,
        isUploaded: checked ? false : document.isUploaded, // Clear uploaded state if marking as N/A
      });
    }
  };

  const handleDeleteDocument = (sectionId: string, documentId: string, documentTitle: string) => {
    setDeleteDialog({
      open: true,
      sectionId,
      documentId,
      documentTitle,
    });
  };

  const handleDelete = async (sectionId: string, documentId: string) => {
    // Find the document to get its title
    const section = documentSections.find(s => s.id === sectionId);
    const document = section?.documents.find(d => d.id === documentId);
    
    if (document) {
      await saveDocument(sectionId, documentId, {
        ...document,
        isUploaded: false,
        isNotApplicable: false,
        fileName: undefined,
        fileUrl: undefined,
      });
    }
    
    setDeleteDialog({ open: false, sectionId: '', documentId: '', documentTitle: '' });
  };

  const confirmDeleteDocument = () => {
    const { sectionId, documentId, documentTitle } = deleteDialog;
    
    handleDelete(sectionId, documentId);
    toast.success(`Document "${documentTitle}" has been deleted`);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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