import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableHeader, TableHead, TableBody, TableRow, TableCell
} from "@/components/ui/table";
import { FileText, Eye, Download, Loader2, Trash2, Archive } from 'lucide-react';
import { toast } from 'sonner';
import { httpClient } from '@/lib/httpClient';
import { logger } from '@/hooks/logger';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// --- Types ---
export interface UploadedDocument {
  id: string;
  capItemId?: string;
  capItemName?: string;
  indicatorLabel?: string;
  filename: string;
  s3Link?: string;
  signedUrl?: string;
  fileUrl?: string;
  uploadedBy?: string;
  uploadedAt?: string | number;
  status?: string;
  size?: number;
}

interface ESGCapDocumentsDialogProps {
  open: boolean;
  onClose: () => void;
  entityId: string | null;
}

// --- Component ---
const ESGCapDocumentsDialog: React.FC<ESGCapDocumentsDialogProps> = ({
  open,
  onClose,
  entityId,
}) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [openingDoc, setOpeningDoc] = useState<string | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UploadedDocument | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  // Fetch all documents for entity
  const fetchDocuments = async () => {
    if (!entityId) {
      toast.error("No entity ID found");
      return;
    }

    setLoading(true);
    try {
      const response: any = await httpClient.get(
        `esgdd/escap/uploaded/evidence-files/all?entityId=${entityId}`
      );

      if (response?.status === 200 && response.data?.status === true) {
        let docs = response.data.data || [];
        docs = docs.filter((doc: UploadedDocument) => {
          const hasCapItem =
            doc.capItemName &&
            !["", "-", "—"].includes(doc.capItemName.trim());
        
          const hasIndicator =
            doc.indicatorLabel &&
            !["", "-", "—"].includes(doc.indicatorLabel.trim());
        
          return hasCapItem || hasIndicator;
        });

        setDocuments(docs || []);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      logger.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const handleDelete = (doc: UploadedDocument) => {
    setConfirmDelete(doc);
  };

  const confirmDeleteDocument = async () => {
    if (!confirmDelete) return;
    
    const doc = confirmDelete;
    setDeletingDocId(doc.id);

    try {
      const params = new URLSearchParams({
        fileName: doc.filename,
        actionItemId: doc.capItemId || '',
        validationDocId: doc.id,
      });

      const response: any = await httpClient.delete(
        `esgdd/escap/delete-file-esgcap?${params.toString()}`
      );

      if (response?.status === 200 && response.data?.success === true) {
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
        toast.success(`Deleted ${doc.filename}`);
      } else {
        throw new Error(response?.data?.message || 'Delete failed');
      }
    } catch (error: any) {
      logger.error("Delete error:", error);
      toast.error(error?.response?.data?.message || `Failed to delete ${doc.filename}`);
    } finally {
      setDeletingDocId(null);
      setConfirmDelete(null);
    }
  };

  // Fetch when dialog opens
  useEffect(() => {
    if (open && entityId) {
      fetchDocuments();
    }
  }, [open, entityId]);

  // --- VIEW: Open signedUrl in new tab ---
  const handleView = (doc: UploadedDocument) => {
    const url = doc.signedUrl || doc.fileUrl;
    
    if (!url) {
      toast.error("No view URL available for this document");
      return;
    }

    setOpeningDoc(doc.id);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => setOpeningDoc(null), 500);
  };

  // --- DOWNLOAD SINGLE: Use signedUrl to download file ---
  const handleDownload = async (doc: UploadedDocument) => {
    const url = doc.signedUrl || doc.fileUrl;
    
    if (!url) {
      toast.error("No download URL available");
      return;
    }

    try {
      setOpeningDoc(doc.id);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = doc.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success(`Downloaded ${doc.filename}`);
    } catch (error) {
      logger.error("Download failed:", error);
      toast.error(`Failed to download ${doc.filename}`);
      window.open(url, '_blank');
    } finally {
      setOpeningDoc(null);
    }
  };

  // --- DOWNLOAD ALL: Download all documents as ZIP ---
  const handleDownloadAll = async () => {
    if (documents.length === 0) {
      toast.error("No documents to download");
      return;
    }

    setDownloadingAll(true);
    toast.info(`Preparing download for ${documents.length} documents...`);

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Fetch all files and add to zip
      const fetchPromises = documents.map(async (doc) => {
        const url = doc.signedUrl || doc.fileUrl;
        if (!url) return;

        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed: ${doc.filename}`);
          
          const blob = await response.blob();
          
          // Create folder structure: CAP Item / Indicator / filename
          const folderName = (doc.capItemName || 'Unknown').replace(/[^a-z0-9]/gi, '_');
          const filePath = `${folderName}/${doc.filename}`;
          
          zip.file(filePath, blob);
        } catch (err) {
          logger.error(`Failed to fetch ${doc.filename}:`, err);
          // Add error note in zip
          zip.file(`_errors/${doc.filename}.txt`, `Failed to download: ${doc.filename}\nError: ${err}`);
        }
      });

      await Promise.all(fetchPromises);

      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = window.URL.createObjectURL(zipBlob);
      
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `ESG_CAP_Documents_${entityId}_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(zipUrl);

      toast.success(`Downloaded ${documents.length} documents as ZIP`);
    } catch (error) {
      logger.error("Download all failed:", error);
      toast.error("Failed to create ZIP file");
    } finally {
      setDownloadingAll(false);
    }
  };

  // Formatters
  const formatDate = (ts?: string | number) => {
    if (!ts) return '—';
    const date = typeof ts === 'string' ? new Date(ts) : new Date(ts);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '—';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ['B', 'KB', 'MB', 'GB'][i];
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-blue-600" />
                  All Uploaded Documents
                </DialogTitle>
                <DialogDescription>
                  {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
                </DialogDescription>
              </div>
              
              {/* --- DOWNLOAD ALL BUTTON --- */}
              {documents.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAll}
                  disabled={downloadingAll}
                  className="flex items-center gap-2"
                >
                  {downloadingAll ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                  {downloadingAll ? 'Preparing...' : 'Download All'}
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-slate-500">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                <FileText className="w-12 h-12 opacity-50" />
                <p className="text-lg font-medium">No documents uploaded yet</p>
                <p className="text-sm">Documents will appear here once uploaded</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <Table className="w-full text-sm">
                  <TableHeader className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <TableRow>
                      <TableHead className="px-4 py-3 text-left font-medium">CAP Item</TableHead>
                      <TableHead className="px-4 py-3 text-left font-medium">Indicator</TableHead>
                      <TableHead className="px-4 py-3 text-left font-medium">File / Note</TableHead>
                      <TableHead className="px-4 py-3 text-left font-medium">Uploaded</TableHead>
                      <TableHead className="px-4 py-3 text-center font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-muted/30">
                        {/* CAP Item */}
                        <TableCell className="px-4 py-3">
                          <div className="font-medium max-w-[200px] truncate" title={doc.capItemName || '—'}>
                            {doc.capItemName || '—'}
                          </div>
                        </TableCell>

                        {/* Indicator */}
                        <TableCell className="px-4 py-3">
                          <div className="max-w-[180px] truncate" title={doc.indicatorLabel || '—'}>
                            {doc.indicatorLabel || '—'}
                          </div>
                        </TableCell>

                        {/* File */}
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                            <span className="font-medium truncate max-w-[200px]" title={doc.filename}>
                              {doc.filename}
                            </span>
                          </div>
                          {doc.size && (
                            <span className="text-xs text-muted-foreground ml-6">
                              {formatSize(doc.size)}
                            </span>
                          )}
                        </TableCell>

                        {/* Uploaded Info */}
                        <TableCell className="px-4 py-3">
                          <div className="text-xs text-muted-foreground">
                            <div>{formatDate(doc.uploadedAt)}</div>
                            {doc.uploadedBy && <div>by {doc.uploadedBy}</div>}
                            {doc.status && (
                              <Badge
                                variant={doc.status === 'final' ? 'default' : 'secondary'}
                                className="mt-1 text-xs"
                              >
                                {doc.status}
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            {/* View */}
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={openingDoc === doc.id || downloadingAll}
                              onClick={() => handleView(doc)}
                              title="View"
                            >
                              {openingDoc === doc.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            
                            {/* Download */}
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={openingDoc === doc.id || downloadingAll}
                              onClick={() => handleDownload(doc)}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingDocId === doc.id || downloadingAll}
                              onClick={() => handleDelete(doc)}
                              title="Delete"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {deletingDocId === doc.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold">{confirmDelete?.filename}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDocument} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ESGCapDocumentsDialog;