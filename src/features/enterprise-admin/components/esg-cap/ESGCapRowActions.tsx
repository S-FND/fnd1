
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
import { AiDialog } from '@/components/esg-cap/AiDialog';
import { AiInsightsDialog } from './AiInsights';
import { DocumentMultiTemplateModal } from './DocumentMultiTemplateModal';
import DocumentSummaryDialog from './document-summary-review';
// import Loader from '@/components/ui/loader';

interface ESGCapRowActionsProps {
  item: ESGCapItem;
  onUpdate: (updatedItem: ESGCapItem) => void;
  buttonEnabled?: boolean;
  setReloadData?: (reload: boolean) => void;
  finalPlan?: boolean;
}

export const ESGCapRowActions: React.FC<ESGCapRowActionsProps> = ({ item, onUpdate, buttonEnabled, setReloadData, finalPlan }) => {
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
  const [isViewAiOpen, setIsViewAiOpen] = useState(false)

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
        {(import.meta.env.VITE_AI_ESGCAP_ENABLED || import.meta.env.VITE_AI_ESGCAP_ENABLED == 'true') && <TooltipProvider delayDuration={300}>
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
                    View Document
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDownloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </DropdownMenuItem>
                  {/* {item.aiResponseRaw && <DropdownMenuItem onClick={() => { setIsViewAiOpen(true) }}>
                    <Download className="mr-2 h-4 w-4" />
                    View AI Insights
                  </DropdownMenuItem>} */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>More actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>}
      </div>

      {/* Review Dialog */}
      <ESGCapReviewDialog
        item={item}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onUpdate={onUpdate}
        buttonEnabled
        finalPlan
      />

      {/* <DocumentTemplateModal
        open={showTemplateModal}
        onOpenChange={setShowTemplateModal}
        document={documentInfo?.template}
        documentType={documentInfo?.type}
      /> */}
      {/* <DocumentTemplateModal
        open={showTemplateModal}
        onOpenChange={setShowTemplateModal}
        item={item}
      /> */}
      <DocumentMultiTemplateModal
        open={showTemplateModal}
        onOpenChange={setShowTemplateModal}
        item={item}
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
        setReloadData={setReloadData}
      />
      <DocumentSummaryDialog
        open={isDownloadOpen}
        files={item.fileUploadedData}
        onClose={() => {
          setIsDownloadOpen(false);
        }}
      />

      <AiInsightsDialog open={isViewAiOpen} onOpenChange={setIsViewAiOpen} item={item} />
    </>
  );

};
