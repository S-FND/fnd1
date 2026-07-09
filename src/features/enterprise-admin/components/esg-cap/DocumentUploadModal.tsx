import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { httpClient } from "@/lib/httpClient";

// Define extensions that should skip validation
const NON_VALIDATABLE_EXTENSIONS = ['.zip', '.xlsx', '.xls', '.csv', '.xlsm', '.xlsb'];

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklistItemId: string | number;
  itemTitle: string;
  itemDescription: string;
  itemTheme: "Policy" | "SOP" | "Metrics" | "Logs";
  itemCategory: string;
  itemPolicy: string;
  itemResource?: string;
  itemSourceType?: string;
  setReloadData?: (reload: boolean) => void;
  indicatorLabel?: string;
}

export interface ESGValidationResult {
  valid: boolean;
  confidence: number;
  documentTypeDetected: string;
  isTemplate: boolean;
  scores: {
    relevance: number;
    policyCompleteness: number;
    regulatoryAlignment: number;
    structure: number;
    authenticity: number;
  };
  checks: {
    relevance: boolean;
    policyCompleteness: boolean;
    regulatoryAlignment: boolean;
    structure: boolean;
    authenticity: boolean;
  };
  overallScore: number;
  missingSections: string[];
  reason: string;
  issues: string[];
  suggestions: string[];
}

type ValidationResult = {
  reason?: string;
  suggestions?: string[];
  valid: boolean;
  confidence: number;
  documentTypeDetected: string;
  isTemplate: boolean;
  scores: {
    relevance: number;
    policyCompleteness: number;
    regulatoryAlignment: number;
    structure: number;
    authenticity: number;
  };
  overallScore: number;
  improvementPercentage: number;
  missingSections: string[];
  issues: string[];
  suggestedImprovements: {
    section: string;
    suggestion: string;
    priority: "high" | "medium" | "low";
  }[];
  summary: string;
};

export const DocumentUploadModal = ({
  open,
  onOpenChange,
  checklistItemId,
  itemTitle,
  itemDescription,
  itemTheme,
  itemCategory,
  itemPolicy,
  itemResource,
  itemSourceType,
  setReloadData,
  indicatorLabel
}: DocumentUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [skipValidation, setSkipValidation] = useState(false); // NEW

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10485760) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setValidationResult(null);

      // Check if file extension should skip validation
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      setSkipValidation(NON_VALIDATABLE_EXTENSIONS.includes(ext));
    }
  };

  // Removed extractTextFromFile (unused)

  const validateDocument = async (file: File) => {
    setValidating(true);
    try {
      let formData = new FormData();
      formData.append("policyDocument", file);
      formData.append("itemTitle", itemTitle);
      formData.append("itemDescription", itemDescription);
      formData.append("itemTheme", itemTheme);
      formData.append("itemCategory", itemCategory);
      formData.append("itemPolicy", itemPolicy);
      formData.append("itemResource", itemResource || '');
      formData.append("itemSourceType", itemSourceType || '');
      formData.append("indicatorLabel", indicatorLabel || '');
      
      let validate = await httpClient.post<ValidationResult>('esgdd/escap/validate-document', formData);
      console.log("Validation response =>", validate);
      if (validate.status == 201) {
        const validationData: ValidationResult = validate.data;
        setValidationResult(validationData);
      }
    } catch (error) {
      console.error("Document validation error:", error);
      toast.error("Unable to validate document. Please upload the files in required formats.");
    } finally {
      setValidating(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // If validation is NOT skipped AND we haven't validated yet, do validation first
    if (!skipValidation && !validationResult) {
      await validateDocument(selectedFile);
      // After validation, the button will change to "Upload" – user clicks again to actually upload
      return;
    }

    // Proceed to upload (either validation passed, or validation is skipped)
    setUploading(true);
    try {
      let formData = new FormData();
      formData.append("policyDocument", selectedFile);
      formData.append("itemTitle", itemTitle);
      formData.append("itemDescription", itemDescription);
      formData.append("itemTheme", itemTheme);
      formData.append("itemCategory", itemCategory);
      formData.append("itemPolicy", itemPolicy);
      formData.append("itemResource", itemResource || '');
      formData.append("itemSourceType", itemSourceType || '');
      formData.append("indicatorLabel", indicatorLabel || '');
      formData.append("indicatorResponse", "yes");
      
      let uploadRes = await httpClient.post<ValidationResult>('esgdd/escap/upload-file/esgcap', formData);
      if (uploadRes.status !== 201) {
        throw new Error("Upload failed");
      }
      
      toast.success("Document uploaded successfully");
      setSelectedFile(null);
      setValidationResult(null);
      setSkipValidation(false);
      setReloadData?.(true);
      setTimeout(() => {
        onOpenChange(false);
      }, 300);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] flex flex-col p-0">
          <div className="px-6 py-4 border-b">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* File drop zone */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to select a file or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, ZIP, XLSX, CSV (max 10MB)
                </p>
              </label>
            </div>

            {/* File preview */}
            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <span className="text-sm truncate flex-1">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setValidationResult(null);
                    setSkipValidation(false);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Show validation results only if not skipped */}
            {!skipValidation && validationResult && (
              <div className="space-y-4">
                {/* ... your validation UI blocks (unchanged) ... */}
                {/* I'm omitting the full UI for brevity – keep your existing rendering */}
              </div>
            )}

            {/* Optional: show a message when validation is skipped */}
            {skipValidation && selectedFile && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                ⚡ Validation will be skipped for this file type.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedFile(null);
                setValidationResult(null);
                setSkipValidation(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>

            {/* Show Re-validate only when validation was performed and not skipped */}
            {!skipValidation && validationResult && (
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedFile) {
                    setValidationResult(null);
                    validateDocument(selectedFile);
                  }
                }}
                disabled={!selectedFile || validating}
                className="flex-1"
              >
                Re-validate
              </Button>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading || validating}
              className="flex-1"
            >
              {validating
                ? "Validating..."
                : uploading
                ? "Uploading..."
                : (skipValidation || validationResult)
                ? "Upload Document"
                : "Validate Document"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};