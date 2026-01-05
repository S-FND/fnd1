// hooks/useDocumentVerification.ts
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye } from "lucide-react";

export const useDocumentVerification = (apiHandler: any, onSuccess?: () => void) => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [currentDocToVerify, setCurrentDocToVerify] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem("fandoro-user");
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleCloseModal = useCallback(() => {
    setShowVerifyModal(false);
    setCurrentDocToVerify(null);
  }, []);

  const handleVerifyClick = useCallback((data: any) => {
    console.log('🎯 [useDocumentVerification.handleVerifyClick] START');
    console.log('  Data received:', data);
    
    // The file data could be in data.file or data itself
    const fileData = data.file || data;
    
    // Try to find file_path in different locations
    const filePath = fileData.file_path || fileData.filePath || fileData.url || fileData.document_url;
    
    if (!filePath) {
      console.log('❌ No file path found');
      toast.error("No valid file found for verification");
      return;
    }
    
    console.log('✅ File found, opening modal');
    
    // Extract question info from data or fileData
    const question = data.question || fileData.question || "Document";
    const questionId = data.questionId || fileData.questionId;
    const key = data.key || fileData.key;
    
    // Format dates for input fields (convert DD/MM/YYYY to YYYY-MM-DD)
    let issueDateInput = "";
    let expiryDateInput = "";
    
    if (fileData.issueDate) {
      const [day, month, year] = fileData.issueDate.split('/');
      issueDateInput = `${year}-${month}-${day}`;
    }
    
    if (fileData.expiryDate) {
      const [day, month, year] = fileData.expiryDate.split('/');
      expiryDateInput = `${year}-${month}-${day}`;
    }
    
    setCurrentDocToVerify({
      ...fileData,
      // Ensure we have the metadata
      file_path: filePath,
      question,
      questionId,
      key,
      // Format dates for date inputs
      issueDateInput,
      expiryDateInput,
      isUserVerified: fileData.isUserVerified || false,
      originalData: data // Keep original data for reference
    });
    
    setShowVerifyModal(true);
    console.log('🎯 [useDocumentVerification.handleVerifyClick] END - Modal opened');
  }, []);

  const handleVerifyAndClose = useCallback(async () => {
    if (!currentDocToVerify) return;
    
    setLoading(true);
    try {
      const entityId = getUserEntityId();
      const verificationData = {
        ...currentDocToVerify,
        entityId,
        // Convert dates back to DD/MM/YYYY format for API
        issueDate: currentDocToVerify.issueDateInput 
          ? formatDateForAPI(currentDocToVerify.issueDateInput)
          : currentDocToVerify.issueDate || "Not found",
        expiryDate: currentDocToVerify.expiryDateInput 
          ? formatDateForAPI(currentDocToVerify.expiryDateInput)
          : currentDocToVerify.expiryDate || "",
        isUserVerified: true,
        verifiedAt: new Date().toISOString()
      };

      console.log('📤 Sending verification data:', verificationData);

      // Call the API handler
      const result = await apiHandler(verificationData);
      
      // Handle different response formats
      if (Array.isArray(result)) {
        // Format: [data, error]
        const [data, error] = result;
        if (error) {
          throw new Error(error.message || error || "Verification failed");
        }
        toast.success("Document verified successfully!");
        if (onSuccess) onSuccess();
        return data;
      } else if (result?.error) {
        // Format: { data, error }
        throw new Error(result.error || "Verification failed");
      } else {
        // Assume success
        toast.success("Document verified successfully!");
        if (onSuccess) onSuccess();
        return result;
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message || "Verification failed");
      throw error;
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  }, [apiHandler, currentDocToVerify, onSuccess, handleCloseModal]);

  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return "";
    // Convert YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setCurrentDocToVerify((prev: any) => ({
      ...prev,
      isUserVerified: checked,
    }));
  }, []);

  const handleIssueDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setCurrentDocToVerify((prev: any) => ({
      ...prev,
      issueDateInput: dateValue,
    }));
  }, []);

  const handleExpiryDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setCurrentDocToVerify((prev: any) => ({
      ...prev,
      expiryDateInput: dateValue,
    }));
  }, []);

  const VerificationModal = (
    <Dialog open={showVerifyModal} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Verify Document</DialogTitle>
          <DialogDescription>
            Verify the document details before submission
          </DialogDescription>
        </DialogHeader>
        
        {currentDocToVerify && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{currentDocToVerify.question || "Document"}</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('📄 Opening document:', currentDocToVerify.file_path);
                    window.open(currentDocToVerify.file_path, '_blank');
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Document
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={currentDocToVerify.issueDateInput || ""}
                  onChange={handleIssueDateChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={currentDocToVerify.expiryDateInput || ""}
                  onChange={handleExpiryDateChange}
                  required
                  className={!currentDocToVerify.expiryDateInput ? "border-red-500" : ""}
                />
                {!currentDocToVerify.expiryDateInput && (
                  <p className="text-xs text-red-500">Expiry date is required</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirm"
                checked={currentDocToVerify.isUserVerified || false}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="confirm" className="text-sm">
                I confirm the information is correct
              </Label>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleVerifyAndClose}
            disabled={
              loading ||
              !currentDocToVerify?.isUserVerified ||
              !currentDocToVerify?.expiryDateInput
            }
          >
            {loading ? "Verifying..." : "Verify Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    showVerifyModal,
    currentDocToVerify,
    handleVerifyClick,
    handleVerifyAndClose,
    VerificationModal,
  };
}; 

// working