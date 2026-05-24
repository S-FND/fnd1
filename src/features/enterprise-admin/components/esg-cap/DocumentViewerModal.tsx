import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { httpClient } from "@/lib/httpClient";
// import { AuthModal } from "./AuthModal";

interface DocumentRecord {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

interface DocumentViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklistItemId: string | number;
  uploadedDocuments:{
    filename: string;
    mimetype: string;
    size: number;
    s3Link: string;
  }[]
  // onDocumentDeleted: () => void;
}

export const DocumentViewerModal = ({ 
  open, 
  onOpenChange, 
  checklistItemId,
  // onDocumentDeleted 
  uploadedDocuments
}: DocumentViewerModalProps) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (open) {
      loadDocuments();
    }
  }, [open, checklistItemId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        setShowAuthModal(true);
        return;
      }

      // const { data, error } = await supabase
      //   .from('compliance_documents')
      //   .select('*')
      //   .eq('checklist_item_id', checklistItemId)
      //   .order('uploaded_at', { ascending: false });

      // if (error) throw error;
      // setDocuments(data || []);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: DocumentRecord) => {
    try {
      const { data, error } = await supabase.storage
        .from('compliance-documents')
        .download(doc.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const handleView = async (doc: {filename:string;s3Link:string}) => {
    try {
      const getSignedUrl=await httpClient.get('esgdd/escap/uploaded/evidence-files/signed-urls?key='+doc.filename)
      console.log('getSignedUrl',getSignedUrl)
      if(getSignedUrl.status == 200){
        window.open(getSignedUrl.data['signedUrl'])
      }
      // if (error) throw error;
      // if (data?.signedUrl) {
      //   window.open(data.signedUrl, '_blank');
      // }
    } catch (error) {
      console.error("View error:", error);
      toast.error("Failed to view document");
    }
  };

  const handleDelete = async (doc: DocumentRecord) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('compliance-documents')
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      // const { error: dbError } = await supabase
      //   .from('compliance_documents')
      //   .delete()
      //   .eq('id', doc.id);

      // if (dbError) throw dbError;

      toast.success("Document deleted successfully");
      loadDocuments();
      // onDocumentDeleted();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Uploaded Documents</DialogTitle>
          </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading documents...</p>
          ) : uploadedDocuments?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No documents uploaded yet
            </p>
          ) : (
            uploadedDocuments?.map((doc) => (
              <div 
                key={doc.filename} 
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(doc.size)} • {`${new Date(Number(doc?.s3Link?.split("/").pop()?.split("_")[0]))}`}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(doc)}
                    title="View document"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    // onClick={() => handleDownload(doc)}
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    // onClick={() => handleDelete(doc)}
                    className="text-destructive hover:text-destructive"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
    
    {/* <AuthModal
      open={showAuthModal}
      onOpenChange={setShowAuthModal}
      onAuthSuccess={() => {
        setShowAuthModal(false);
        loadDocuments();
      }}
    /> */}
    </>
  );
};