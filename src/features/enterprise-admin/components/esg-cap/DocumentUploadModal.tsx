import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { httpClient } from "@/lib/httpClient";
// import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
// import { DialogHeader } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// // import { AuthModal } from "./AuthModal";

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

  // onUploadSuccess: () => void;
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
  setReloadData
  // onUploadSuccess 
}: DocumentUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10485760) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setValidationResult(null);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;

          // For PDFs and binary files, we'll get limited text
          // For text-based files, we get the full content
          if (file.type === 'application/pdf') {
            // PDF text extraction would need a library
            // For now, we'll just note it's a PDF
            resolve(`[PDF Document: ${file.name}]\nNote: Full PDF text extraction requires server-side processing.`);
          } else if (file.type.includes('image')) {
            resolve(`[Image Document: ${file.name}]\nNote: Image content validation based on filename and metadata.`);
          } else {
            // Text-based files
            resolve(content);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));

      // Read as text for most files
      if (file.type.includes('text') || file.type.includes('word') || !file.type) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const validateDocument = async (file: File) => {
    setValidating(true);

    interface AIResponseWrapper {
      data: ESGValidationResponse;
    }
    interface ESGValidationResponse {
      parsed: ESGValidationResult;
      raw: any; // OpenAI raw response (optional: type later)
    }
    try {
      // Extract text from the file
      // const documentText = await extractTextFromFile(file);
      let formData = new FormData();
      formData.append("policyDocument", file);
      formData.append("itemTitle", itemTitle);
      formData.append("itemDescription", itemDescription);
      formData.append("itemTheme", itemTheme);
      formData.append("itemCategory", itemCategory);
      formData.append("itemPolicy", itemPolicy);
      formData.append("itemResource", itemResource || '');
      formData.append("itemSourceType", itemSourceType || '');
      let validate = await httpClient.post<ValidationResult>('esgdd/escap/validate-document', formData);
      console.log("Validation response =>", validate);
      if (validate.status == 201) {
        const validationData: ValidationResult = validate.data;

        if (!validationData.valid) {
          console.log(validationData.issues);
        }

        if (validationData.scores.relevance < 40) {
          console.log('Low relevance');
        }
        // setValidationResult({
        //   valid: validationData.valid,
        //   confidence: validationData.confidence,
        //   reason: validationData.reason,
        //   suggestions:
        //     validationData.suggestions,
        // });
        setValidationResult(validationData);
      }
      // Call validation edge function
      // const { data, error } = await supabase.functions.invoke('validate-document', {
      //   body: {
      //     documentText,
      //     itemTitle,
      //     itemDescription,
      //     itemTheme
      //   }
      // });

      // if (error) {
      //   console.error("Validation error:", error);
      //   toast.error("Failed to validate document. Please try uploading anyway.");
      //   return;
      // }

      // setValidationResult(data);

      // if (data.valid && data.confidence >= 70) {
      //   toast.success("Uploaded Document Validated", {
      //     description: data.reason
      //   });
      // } else {
      //   toast.warning("Validation Warning", {
      //     description: data.reason,
      //     duration: 5000
      //   });
      // }
    } catch (error) {
      console.error("Document validation error:", error);
      toast.error("Unable to validate document. You may proceed with upload.");
    } finally {
      setValidating(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    // Validate document first
    if (!validationResult) {
      await validateDocument(selectedFile);
      return;
    }

    // Show warning if validation failed but allow upload
    // if (!validationResult.valid || validationResult.confidence < 70) {
    //   toast.error("Validation failed, share an updated document", {
    //     description: validationResult.reason + (validationResult.suggestions ? `\n\n${validationResult.suggestions}` : ''),
    //     duration: 7000
    //   });
    //   // Don't proceed with upload if validation failed
    //   return;
    // }

    setUploading(true);
    try {
      // const { data: { user } } = await supabase.auth.getUser();
      // if (!user) {
      //   setUploading(false);
      //   setNeedsAuth(true);
      //   setShowAuthModal(true);
      //   return;
      // }

      // Create unique file path with user ID and timestamp
      // const fileExt = selectedFile.name.split('.').pop();
      // const fileName = `${Date.now()}.${fileExt}`;
      // const filePath = `${user.id}/${checklistItemId}/${fileName}`;

      // Upload to storage
      // const { error: uploadError } = await supabase.storage
      //   .from('compliance-documents')
      //   .upload(filePath, selectedFile);

      let formData = new FormData();
      formData.append("policyDocument", selectedFile);
      formData.append("itemTitle", itemTitle);
      formData.append("itemDescription", itemDescription);
      formData.append("itemTheme", itemTheme);
      formData.append("itemCategory", itemCategory);
      formData.append("itemPolicy", itemPolicy);
      formData.append("itemResource", itemResource || '');
      formData.append("itemSourceType", itemSourceType || '');
      let uploadRes = await httpClient.post<ValidationResult>('esgdd/escap/upload-file/esgcap', formData);

      if (uploadRes.status !== 201) {
        throw new Error("Upload failed");
      }
      toast.success("Document uploaded successfully");
      window.location.reload();
      // Save document record to database
      // const { error: dbError } = await supabase
      //   .from('compliance_documents')
      //   .insert({
      //     user_id: user.id,
      //     checklist_item_id: checklistItemId,
      //     file_name: selectedFile.name,
      //     file_path: filePath,
      //     file_size: selectedFile.size,
      //     mime_type: selectedFile.type
      //   });

      // if (dbError) throw dbError;

      toast.success("Document uploaded successfully");
      setSelectedFile(null);
      setValidationResult(null);
      setReloadData?.(true);
      // onUploadSuccess();
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

          {/* ✅ HEADER */}
          <div className="px-6 py-4 border-b">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
          </div>

          {/* ✅ SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

            {/* Upload */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                  PDF, DOC, DOCX (max 10MB)
                </p>
              </label>
            </div>

            {/* File Preview */}
            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <span className="text-sm truncate flex-1">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setValidationResult(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* ✅ VALIDATION RESULT */}
            {validationResult && (
              <div className="space-y-4">

                {/* STATUS */}
                <div className={`p-4 rounded-md border ${validationResult.valid
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                  }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {validationResult.valid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <p className="font-semibold">
                      {validationResult.valid ? "Validation Passed" : "Validation Failed"}
                    </p>
                  </div>

                  <div className="text-sm space-y-1">
                    <p><strong>Overall Score:</strong> {validationResult.overallScore}%</p>
                    <p><strong>Improvement Needed:</strong> {validationResult.improvementPercentage}%</p>
                    <p><strong>Confidence:</strong> {validationResult.confidence}%</p>
                  </div>
                </div>

                {/* SCORE */}
                <div className="p-3 border rounded-md">
                  <p className="text-sm font-medium mb-2">Score Breakdown</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(validationResult.scores).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MISSING */}
                {validationResult.missingSections?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-red-600">
                      Missing Sections
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {validationResult.missingSections.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-md">
                          {s.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ISSUES */}
                {validationResult.issues?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Issues</p>
                    <ul className="text-xs list-disc pl-5 space-y-1">
                      {validationResult.issues.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* IMPROVEMENTS */}
                {validationResult.suggestedImprovements?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Suggested Improvements</p>
                    <div className="space-y-2">
                      {validationResult.suggestedImprovements.map((item, idx) => (
                        <div key={idx} className="border rounded-md p-2 text-xs bg-muted">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {item.section.replace(/_/g, " ")}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${item.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : item.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="mt-1 text-muted-foreground">
                            {item.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUMMARY */}
                {validationResult.summary && (
                  <div className="p-3 bg-muted rounded-md text-xs">
                    <strong>Summary:</strong> {validationResult.summary}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ✅ FIXED FOOTER */}
          <div className="px-6 py-4 border-t flex gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedFile(null);
                setValidationResult(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>

            {validationResult && (
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
                  : validationResult
                    ? "Upload Document"
                    : "Validate Document"}
            </Button>
          </div>

        </DialogContent>
      </Dialog>

      {/* <AuthModal
      open={showAuthModal}
      onOpenChange={setShowAuthModal}
      onAuthSuccess={() => {
        setShowAuthModal(false);
        if (needsAuth) {
          handleUpload();
          setNeedsAuth(false);
        }
      }}
    /> */}
    </>
  );
};