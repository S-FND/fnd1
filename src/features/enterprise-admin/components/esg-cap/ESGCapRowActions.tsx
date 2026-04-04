
import React, { useState, useCallback } from 'react';
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

interface ESGCapRowActionsProps {
  item: ESGCapItem;
  onUpdate: (updatedItem: ESGCapItem) => void;
}

export const ESGCapRowActions: React.FC<ESGCapRowActionsProps> = ({ item, onUpdate }) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Simulate document existence per item
  const hasDocument = !!item.actualCompletionDate;

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

  return (
    <>
      <div className="flex items-center gap-1.5">
        {hasDocument && (
          <Badge variant="outline" className="text-xs gap-1 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950">
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
                    Download Document
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

      {/* Upload Document Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Attach a document to "{item.issue}"
            </DialogDescription>
          </DialogHeader>

          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive
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
      </Dialog>

      {/* No Document Available Modal */}
      <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
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
      </Dialog>
    </>
  );
};
