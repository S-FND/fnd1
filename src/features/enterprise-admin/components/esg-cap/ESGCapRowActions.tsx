
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ESGCapItem } from '../../types/esgDD';
import { ESGCapReviewDialog } from './ESGCapReviewDialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MoreVertical, Upload, Download, FileText, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { DocumentUploadModal } from './DocumentUploadModal';
import { DocumentViewerModal } from './DocumentViewerModal';
import { getPolicyTemplate } from '@/data/policyTemplates';
import { getSOPTemplate } from '@/data/sopTemplates';
import { getLogTemplate } from '@/data/logTemplates';
import { DocumentTemplateModal } from './DocumentTemplateModal';

interface ESGCapRowActionsProps {
  item: ESGCapItem;
  onUpdate: (updatedItem: ESGCapItem) => void;
  buttonEnabled?: boolean;
}

export const ESGCapRowActions: React.FC<ESGCapRowActionsProps> = ({ item, onUpdate, buttonEnabled }) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showNAPrompt, setShowNAPrompt] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [documentCount, setDocumentCount] = useState(0);
  const [isViewAiOpen, setIsViewAiOpen]=useState(false)

  // Simulate document existence per item
  const hasDocument = !!item.actualCompletionDate;

  // Determine document type and get appropriate template
  const getDocumentTemplate = () => {
    return { template: { name: item.documentType, sections: item.sections || [] }, type: "Policy" as const };
    // if (item.data_type !== "attachment") return null;

    // if (item.theme === "Policy") {
    //   return { template: getPolicyTemplate(item.item), type: "Policy" as const };
    // } else if (item.theme === "SOP") {
    //   return { template: getSOPTemplate(item.item), type: "SOP" as const };
    // } else if (item.theme === "Logs") {
    //   return { template: getLogTemplate(item.item), type: "Log" as const };
    // }
    // return null;
  };

  const documentInfo = getDocumentTemplate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    // Simulate upload
    await new Promise(r => setTimeout(r, 1200));
    setUploading(false);
    setIsUploadOpen(false);
    setSelectedFile(null);
    toast.success('Document uploaded successfully', {
      description: `${selectedFile.name} has been attached to "${item.issue}"`,
    });
  };

  const handleDownload = () => {
    if (hasDocument) {
      toast.success('Download started', {
        description: `Downloading document for "${item.issue}"`,
      });
    } else {
      setIsDownloadOpen(true);
    }
  };

  const handleDownloadTemplate = () => {
    if (documentInfo) {
      setShowTemplateModal(true);
    } else {
      toast.error('No template available', {
        description: `No document template found for "${item.item}". Please contact support.`,
      });
    }
  };

  useEffect(() => {
    if (isDownloadOpen && !hasDocument) {
      toast.error('No document available', {
        description: `There is no document uploaded for "${item.issue}". Please upload one first.`,
      });
    }
  }, [isDownloadOpen, hasDocument, item.issue]);

  useEffect(() => {
    if (showTemplateModal && !documentInfo) {
      toast.error('No template available', {
        description: `No document template found for "${item.item}". Please contact support.`,
      });
      setShowTemplateModal(false);
    }
  }, [showTemplateModal, documentInfo, item.item]);

  useEffect(() => {
    console.log("Document count for item", item.id, "is", item.sections?.length || 0);
  }, [item]);

  return (
    <>
      <div className="flex items-center gap-1.5">
        {hasDocument && (
          <Badge variant="outline" className="text-xs gap-1 text-green-700 border-green-300 bg-green-50">
            <FileText className="h-3 w-3" />
            Doc
          </Badge>
        )}
        <Button variant="outline" size="sm" onClick={() => setIsReviewOpen(true)}>
          Review
        </Button>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setIsUploadOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    view Document
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDownloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>{setIsViewAiOpen(true)}}>
                    <Download className="mr-2 h-4 w-4" />
                    View details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>More actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Review Dialog */}
      <ESGCapReviewDialog
        item={item}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onUpdate={onUpdate}
      />

      <DocumentTemplateModal
        open={showTemplateModal}
        onOpenChange={setShowTemplateModal}
        document={documentInfo?.template}
        documentType={documentInfo?.type}
      />

      <DocumentUploadModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        checklistItemId={item.id}
        itemTitle={item.item}
        itemDescription={item.measures}
        itemCategory={item.category}
        itemPolicy={item.documentType}
        itemResource={item.resource}
        itemSourceType={item.sourceType}
        itemTheme={item.theme || "Policy"}
      // onUploadSuccess={() => {
      //   setDocumentCount(prev => prev + 1);
      //   if (onComplete) onComplete();
      // }}
      />
      <DocumentViewerModal
        open={isDownloadOpen}
        onOpenChange={setIsDownloadOpen}
        checklistItemId={item.id}
      // onDocumentDeleted={() => {
      //   const newCount = documentCount - 1;
      //   setDocumentCount(Math.max(0, newCount));

      //   // If no documents remain, mark item as incomplete
      //   if (newCount === 0 && onMarkIncomplete) {
      //     onMarkIncomplete();
      //   }
      // }}
      />

      {/* Upload Document Modal */}
      {/* <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Attach a document to "{item.issue}"
            </DialogDescription>
          </DialogHeader>

          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById(`file-input-${item.id}`)?.click()}
          >
            <input
              id={`file-input-${item.id}`}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.pptx"
              onChange={handleFileSelect}
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <X className="h-3 w-3 mr-1" /> Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Drag & drop a file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: PDF, DOCX, XLSX, CSV, PPTX (max 20MB)
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setIsUploadOpen(false); setSelectedFile(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} disabled={!selectedFile || uploading}>
              {uploading ? 'Uploading…' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* No Document Available Modal */}
      {/* <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>No Document Available</DialogTitle>
            <DialogDescription>
              There is no document uploaded for this item yet. You can upload one using the "Upload Document" option.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDownloadOpen(false)}>
              Close
            </Button>
            <Button onClick={() => { setIsDownloadOpen(false); setIsUploadOpen(true); }}>
              Upload Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <Dialog open={isViewAiOpen} onOpenChange={setIsViewAiOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{item.item}</DialogTitle>
            <DialogDescription>
              ESG Action Plan Details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">

            {/* 🔹 BASIC INFO */}
            <div>
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p><b>Category:</b> {item.category}</p>
                <p><b>Status:</b> {item.status}</p>
                <p><b>Priority:</b> {item.priority}</p>
                <p><b>Assigned To:</b> {item.assignedTo}</p>
                <p><b>Target Date:</b> {item.targetDate}</p>
                <p><b>Actual Date:</b> {item.actualDate}</p>
              </div>
            </div>

            {/* 🔹 AI INSIGHTS */}
            <div>
              <h3 className="font-semibold mb-2">AI Insights</h3>
              <p className="text-sm text-muted-foreground">
                {item.aiResponseRaw.reasoning}
              </p>
              <p className="text-xs mt-1">
                Confidence: {(item.aiResponseRaw.confidence * 100).toFixed(0)}%
              </p>
            </div>

            {/* 🔹 REQUIRED EVIDENCE */}
            {item.aiResponseRaw?.requiredEvidence && (
              <div>
                <h3 className="font-semibold mb-2">Required Evidence</h3>
                <div className="flex flex-wrap gap-2">
                  {item.aiResponseRaw.requiredEvidence.types.map((type: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 🔹 TEMPLATES */}
            {item.aiResponseRaw?.templates?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Suggested Templates</h3>

                <div className="space-y-4">
                  {item.aiResponseRaw.templates.map((template: any, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-muted/20"
                    >
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Type: {template.type} • Format: {template.format}
                      </p>

                      {/* Dynamic Structure Render */}
                      {template.structure?.components && (
                        <ul className="list-disc ml-5 text-sm">
                          {template.structure.components.map((c: string, i: number) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      )}

                      {template.structure?.columns && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {template.structure.columns.map((col: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-gray-200 rounded">
                              {col}
                            </span>
                          ))}
                        </div>
                      )}

                      {template.structure?.sections && (
                        <ul className="list-disc ml-5 text-sm">
                          {template.structure.sections.map((sec: string, i: number) => (
                            <li key={i}>{sec}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewAiOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

};
