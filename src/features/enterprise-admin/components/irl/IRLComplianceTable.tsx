// components/IRLComplianceTable.tsx - COMPLETE FILE
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, X, CheckCircle, AlertCircle, Clock, Eye } from 'lucide-react';
import {
  fetchBoData, updateBoData,
  fetchComplianceData, updateComplianceData,
  fetchManagementData, updateManagementData,
  fetchITSecurityData, updateITSecurityData,
  fetchGovernanceData, updateGovernanceData,
  fetchFacilityData, updateFacilityData, deleteFile
} from '../../services/companyApi';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { logger } from '@/hooks/logger';
import { httpClient } from '@/lib/httpClient';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// ============ INTERFACES ============
interface ComplianceItem {
  // id: number;
  name: string;
  key: string;
  isApplicable: string;
  attachment: File[];
  notes: string;
  details?: string;
  type?: 'default' | 'it-security' | 'governance';
}

interface FileDetails {
  _id?: string;
  name?: string;
  file_path: string;
  expiryDate?: string;
  issueDate?: string;
  isUserVerified?: boolean;
  isAdminVerified?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  comments?: string;
}

interface IRLComplianceTableProps {
  title: string;
  description: string;
  items: Array<{ key: string; name: string }>;
  type?: 'default' | 'it-security' | 'governance';
  buttonEnabled?: boolean;
}

// ============ CONSTANTS ============
const TEXT_INPUT_KEYS = ['type_of_servers_used', 'cloud_servers_used', 'scope_data_stored_servers', 'name_of_contractors',
  'name_of_refrigerants',
  'supplier_code_of_conduct',
  'partner_selection_criteria_checklist'];

const TEXTAREA_KEYS = ['customer_data_security_privacy'];

// ============ DOCUMENT VERIFICATION HOOK ============
const useDocumentVerification = () => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [currentDocToVerify, setCurrentDocToVerify] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const getVerificationEndpoint = (category: string) => {
    const basePath = 'document';

    switch (category.toLowerCase()) {
      case 'business operations':
        return `${basePath}/bo/verify`;
      case 'compliance':
        return `${basePath}/lc/verify`;
      case 'management':
        return `${basePath}/ms/verify`;
      case 'it security & data privacy':
        return `${basePath}/it/verify`;
      case 'governance':
        return `${basePath}/governance/verify`;
      case 'facility information':
        return `company/facilities/verify`;
      default:
        return `${basePath}/default/verify`;
    }
  };

  const handleCloseModal = useCallback(() => {
    setShowVerifyModal(false);
    setCurrentDocToVerify(null);
  }, []);

  const handleVerifyClick = useCallback((data: any, category: string) => {
    console.log('🎯 [Document Verification] Starting for category:', category);

    const fileData = data.file || data;

    // Keep the FULL URL from file_details
    const filePath = fileData.file_path || fileData.filePath || fileData.url || fileData.document_url;

    if (!filePath) {
      toast.error("No valid file found for verification");
      return;
    }

    const question = data.question || fileData.question || "Document";
    const questionId = data.questionId || fileData.questionId;
    const key = data.key || fileData.key;

    let issueDateInput = "";
    let expiryDateInput = "";

    // Handle date parsing safely
    if (fileData.issueDate && fileData.issueDate !== 'Not found') {
      const dateParts = fileData.issueDate.split('/');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        issueDateInput = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    if (fileData.expiryDate && fileData.expiryDate !== 'Not found') {
      const dateParts = fileData.expiryDate.split('/');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        expiryDateInput = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    const verificationEndpoint = getVerificationEndpoint(category);

    setCurrentDocToVerify({
      ...fileData,
      file_path: filePath, // Keep the full URL
      question,
      questionId,
      key,
      issueDateInput,
      expiryDateInput,
      isUserVerified: fileData.isUserVerified || false,
      originalData: data,
      category,
      verificationEndpoint
    });

    setShowVerifyModal(true);
  }, []);

  const handleVerifyAndClose = useCallback(async () => {
    if (!currentDocToVerify) return;

    setLoading(true);
    try {
      const entityId = getUserEntityId();
      if (!entityId) {
        toast.error("User not authenticated");
        return;
      }

      // Format dates for API
      const formatDateForAPI = (dateString: string) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      };

      // Get the document ID - backend expects "_id", not "documentId"
      const documentId = currentDocToVerify._id || currentDocToVerify.originalData?.file?._id;

      if (!documentId) {
        toast.error("Document ID not found");
        return;
      }

      const verificationData = {
        entityId,
        _id: documentId, // Send as "_id" not "documentId"
        filePath: currentDocToVerify.fullFilePath || currentDocToVerify.file_path,
        questionId: currentDocToVerify.questionId,
        key: currentDocToVerify.key,
        issueDate: currentDocToVerify.issueDateInput
          ? formatDateForAPI(currentDocToVerify.issueDateInput)
          : currentDocToVerify.issueDate || "",
        expiryDate: currentDocToVerify.expiryDateInput
          ? formatDateForAPI(currentDocToVerify.expiryDateInput)
          : currentDocToVerify.expiryDate || "",
        isUserVerified: true,
        isAdminVerified: false, // You might want to add this
        verifiedAt: new Date().toISOString(),
        category: currentDocToVerify.category
      };

      console.log('📤 Sending verification to:', currentDocToVerify.verificationEndpoint);
      console.log('Verification data:', verificationData);
      console.log('Document _id being sent:', verificationData._id);

      // Call the specific API endpoint
      const response: any = await httpClient.post(currentDocToVerify.verificationEndpoint, verificationData);

      if (response.data.status === true) {
        toast.success("Document verified successfully!");
        // Trigger refresh
        setRefreshTrigger(prev => prev + 1);
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      toast.error(error.message || "Verification failed");
      throw error;
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  }, [currentDocToVerify, handleCloseModal]);

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
                    const viewUrl = currentDocToVerify.fullFilePath ||
                      `https://fandoro-sustainability-saas-stage.s3.ap-south-1.amazonaws.com/${currentDocToVerify.file_path}`;
                    window.open(viewUrl, '_blank');
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Document
                </Button>
                <span className="text-xs text-gray-500">
                  Category: {currentDocToVerify.category}
                </span>
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
    refreshTrigger
  };
};

// ============ HELPER FUNCTIONS ============
const fetchCompanyConfiguration = async (entityId: string, category: string) => {
  try {
    const response: any = await httpClient.get(
      `company-irl/${entityId}/irl-config?category=${encodeURIComponent(category)}`
    );

    if (response?.data?.status === true) {
      const responseData = response.data.data;

      if (responseData === null) {
        return {
          enabledItems: [],
          configExists: false,
          message: response.data.message || 'No configuration found'
        };
      } else if (responseData?.configuration === null || responseData?.configuration === undefined) {
        return {
          enabledItems: [],
          configExists: false
        };
      } else {
        return {
          enabledItems: responseData?.configuration?.enabledItems || [],
          configExists: true,
          message: response.data.message || 'Configuration retrieved successfully'
        };
      }
    }

    return {
      enabledItems: [],
      configExists: false,
      message: 'No configuration found'
    };
  } catch (error) {
    console.error('Error fetching company configuration:', error);
    return {
      enabledItems: [],
      configExists: false,
      message: 'Error fetching configuration'
    };
  }
};

// ============ MAIN COMPONENT ============
const IRLComplianceTable: React.FC<IRLComplianceTableProps> = ({
  title,
  description,
  items,
  type = 'default',
  buttonEnabled = true
}) => {
  // ============ STATE ============
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filePaths, setFilePaths] = useState<Record<string, string[]>>({});
  const [fileDetails, setFileDetails] = useState<Record<string, FileDetails[]>>({});

  // ============ USE DOCUMENT VERIFICATION HOOK ============
  const {
    VerificationModal,
    handleVerifyClick,
    refreshTrigger
  } = useDocumentVerification();

  // ============ UTILITY FUNCTIONS ============
  const getS3FilePath = (file_path: string) => {
    if (file_path.startsWith('https://')) {
      return file_path;
    }
    if (file_path.includes('fandoro-sustainability-saas-stage')) {
      return file_path;
    }
    return `https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/${file_path}`;
  };

  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem('fandoro-user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      logger.error("Error parsing user data:", error);
      return null;
    }
  };

  const entityId = getUserEntityId();

  const getCategoryFromTitle = (title: string): string => {
    const mapping: Record<string, string> = {
      'Compliance': 'compliance',
      'Business Operations': 'business_operations',
      'Management': 'management',
      'IT Security & Data Privacy': 'it_security',
      'Governance': 'governance',
      'Facility Information': 'facility'
    };
    return mapping[title] || title.toLowerCase().replace(/\s+/g, '_');
  };

  const isExpired = (dateString: string): boolean => {
    if (!dateString) return false;
    try {
      const [day, month, year] = dateString.split('/').map(Number);
      const expiryDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiryDate.setHours(0, 0, 0, 0);
      return expiryDate < today;
    } catch (error) {
      console.error('Error parsing expiry date:', error);
      return false;
    }
  };

  // ============ DATA LOADING FUNCTIONS ============
  const getAPIFunctions = () => {
    switch (title.toLowerCase()) {
      case 'business operations':
        return { fetch: fetchBoData, update: updateBoData };
      case 'compliance':
        return { fetch: fetchComplianceData, update: updateComplianceData };
      case 'management':
        return { fetch: fetchManagementData, update: updateManagementData };
      case 'it security & data privacy':
        return { fetch: fetchITSecurityData, update: updateITSecurityData };
      case 'governance':
        return { fetch: fetchGovernanceData, update: updateGovernanceData };
      case 'facility information':
        return { fetch: fetchFacilityData, update: updateFacilityData };
      default:
        return { fetch: fetchComplianceData, update: updateComplianceData };
    }
  };

  const loadData = async (filteredItems = complianceItems) => {
    if (!entityId) {
      setError('Please complete your company profile in the Administration section before submitting IRL details.');
      setIsLoading(false);
      return;
    }

    try {
      const { fetch } = getAPIFunctions();
      const response: any = await fetch(entityId);

      if (!response || response.isApplicable === false) {
        toast.error('No data found');
      }

      const allowedKeys = new Set(filteredItems.map(item => item.key));
      const filteredResponse = Object.keys(response)
        .filter(key => allowedKeys.has(key))
        .reduce((obj, key) => {
          obj[key] = response[key];
          return obj;
        }, {});

      const updatedItems = filteredItems.map(item => {
        const key = item.key;
        const itemData = filteredResponse[key] || {};

        const isApplicable = itemData.isApplicable || itemData.answer || '';
        const notes = itemData.reason || '';

        // Store file paths
        const existingFiles = itemData.file_path || itemData.existing_files || [];
        if (existingFiles.length > 0) {
          const fullUrls = existingFiles.map(file => {
            if (file.startsWith('https://')) {
              return file;
            }
            return getS3FilePath(file);
          });

          setFilePaths(prev => ({
            ...prev,
            [key]: fullUrls
          }));
        }

        // Store file details
        if (itemData.file_details && Array.isArray(itemData.file_details)) {
          const mappedDetails = itemData.file_details.map((detail: any, index: number) => {
            let filePath = detail.file_path;
            if (filePath && !filePath.startsWith('https://')) {
              filePath = getS3FilePath(filePath);
            }

            return {
              ...detail,
              file_path: filePath,
              isUserVerified: detail.isUserVerified || false,
              isAdminVerified: detail.isAdminVerified || false,
              verificationStatus: detail.isUserVerified && detail.isAdminVerified
                ? 'verified'
                : (!detail.isUserVerified && !detail.isAdminVerified)
                  ? 'rejected'
                  : 'pending',
              expiryDate: detail.expiryDate || '',
              issueDate: detail.issueDate || '',
              name: detail.name || filePath?.split('/').pop() || 'Document',
              _id: detail._id || Math.random().toString(36).substr(2, 9)
            };
          });

          setFileDetails(prev => ({
            ...prev,
            [key]: mappedDetails
          }));
        }

        if (TEXTAREA_KEYS.includes(key) || TEXT_INPUT_KEYS.includes(key)) {
          return {
            ...item,
            isApplicable: response[key] || '',
            notes: '',
            attachment: item.attachment ?? []
          };
        }

        return {
          ...item,
          isApplicable,
          notes,
          attachment: []
        };
      });

      setComplianceItems(updatedItems);

    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ USE EFFECTS ============
  useEffect(() => {
    const loadCompanyConfig = async () => {
      if (!entityId) return;

      try {
        const category = getCategoryFromTitle(title);
        const configResult = await fetchCompanyConfiguration(entityId, category);
        const { enabledItems, configExists } = configResult;

        let filtered: any = [];

        if (!configExists) {
          filtered = items;
        } else {
          if (enabledItems.length > 0) {
            filtered = items.filter(item => enabledItems.includes(item.key));
          } else {
            filtered = [];
          }
        }

        setComplianceItems(
          filtered.map((item, index) => ({
            key: item.key,
            name: item.name,
            isApplicable: '',
            attachment: [],
            notes: '',
            type
          }))
        );

        if (filtered.length > 0) {
          await loadData(filtered);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading company config:', error);
        setComplianceItems(
          items.map((item, index) => ({
            key: item.key,
            name: item.name,
            isApplicable: '',
            attachment: [],
            notes: '',
            type
          }))
        );
        setIsLoading(false);
      }
    };

    loadCompanyConfig();
  }, [entityId, title, items, refreshTrigger]);

  // ============ EVENT HANDLERS ============
  const handleStatusChange = (key: string, isApplicable: string) => {
    setComplianceItems(items =>
      items.map(item => item.key === key ? { ...item, isApplicable } : item)
    );
  };

  const handleNotesChange = (key: string, notes: string) => {
    setComplianceItems(items =>
      items.map(item => item.key === key ? { ...item, notes } : item)
    );
  };

  const handleFileUpload = (key: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentItem = complianceItems.find(item => item.key === key);
    const existingFiles = currentItem?.attachment.length || 0;
    const newFiles = Array.from(files);
    const totalFiles = existingFiles + newFiles.length;

    if (totalFiles > 10) {
      toast.error('You can upload a maximum of 10 files.');
      setTimeout(() => {
        const input = document.getElementById(
          `file-upload-${key}`
        ) as HTMLInputElement | null;
        if (input) input.value = '';
      }, 0);
      return;
    }

    setComplianceItems(items =>
      items.map(item =>
        item.key === key
          ? { ...item, attachment: [...item.attachment, ...newFiles] }
          : item
      )
    );
  };


  const handleRemoveFile = (key: string, fileIndex: number) => {
    setComplianceItems(items =>
      items.map(item =>
        item.key === key
          ? { ...item, attachment: item.attachment.filter((_, i) => i !== fileIndex) }
          : item
      )
    );
  };

  const sanitizeFileName = (fileName: string) => {
    if (!fileName || typeof fileName !== 'string') return fileName || '';
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
      return fileName.replace(/\./g, '_').replace(/\s+/g, '_');
    }
    const namePart = fileName.substring(0, lastDotIndex);
    const extension = fileName.substring(lastDotIndex);
    const sanitizedBaseName = namePart.replace(/\./g, '_').replace(/\s+/g, '_');
    return sanitizedBaseName + extension;
  };

  const handleDeleteExistingFile = async (key: string, fileIndex: number, fileUrl: string) => {
    try {
      setIsLoading(true);
      const filePath = fileUrl.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/', '');

      let apiType: string = 'bo';
      switch (title.toLowerCase()) {
        case 'business operations':
          apiType = 'bo';
          break;
        case 'compliance':
          apiType = 'lc';
          break;
        case 'management':
          apiType = 'ms';
          break;
        case 'it security & data privacy':
          apiType = 'it';
          break;
        case 'governance':
          apiType = 'governance';
          break;
        case 'facility information':
          apiType = 'facility';
          break;
      }

      const payload = {
        filesToDelete: [filePath]
      };

      await deleteFile(payload, apiType);

      setFilePaths(prev => {
        const updatedPaths = { ...prev };
        if (updatedPaths[key]) {
          updatedPaths[key] = updatedPaths[key].filter((_, index) => index !== fileIndex);
          if (updatedPaths[key].length === 0) {
            delete updatedPaths[key];
          }
        }
        return updatedPaths;
      });

      toast.success('File deleted successfully');
    } catch (err: any) {
      logger.error('Error deleting file:', err);
      toast.error(err.message || 'Failed to delete file');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ FORM VALIDATION & SUBMISSION ============
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    complianceItems.forEach(item => {
      const key = item.key;
      if (item.isApplicable === 'yes') {
        const hasFiles =
          (filePaths[key]?.length || 0) > 0 ||
          (item.attachment?.length || 0) > 0;

        if (!hasFiles) {
          newErrors[key] = 'Please upload the document.';
          isValid = false;
        }
      } else if (item.isApplicable === 'no' && !item.notes.trim()) {
        newErrors[key] = 'Please provide the reason.';
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const buildPayload = (isDraft = false) => {
    const payload: any = {
      entityId,
      isDraft
    };

    complianceItems.forEach(item => {
      const key = item.key;
      if (TEXT_INPUT_KEYS.includes(key) || TEXTAREA_KEYS.includes(key)) {
        payload[key] = item.isApplicable;
      } else {
        payload[key] = {
          answer: item.isApplicable,
          reason: item.notes || '',
          file_path: [
            ...(filePaths[key]?.map(path => path.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/', '')) || []),
            ...item.attachment.map(file => sanitizeFileName(file.name))
          ],
          fileChange: item.attachment?.length > 0
        };
      }
    });

    return payload;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!entityId) {
      toast.error('Entity ID not found');
      return;
    }

    if (!validateForm() && !isDraft) {
      toast.error('Please fix the validation errors.');
      return;
    }

    setIsLoading(true);

    try {
      const formData: any = new FormData();
      const payload = buildPayload(isDraft);
      formData.append('data', JSON.stringify(payload));

      complianceItems.forEach(item => {
        if (item.attachment?.length > 0) {
          item.attachment.forEach(file => {
            const sanitizedFileName = sanitizeFileName(file.name);
            formData.append(`${item.key}_file`, file, sanitizedFileName);
          });
        }
      });

      const { update } = getAPIFunctions();
      await update(formData);
      await loadData();
      toast.success(isDraft ? 'Draft saved successfully!' : 'Form submitted successfully!');
    } catch (err) {
      logger.error('Submission failed:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => handleSubmit(true);
  const handleFinalSubmit = () => handleSubmit(false);

  // ============ RENDER FUNCTIONS ============
  const renderFileWithVerification = (fileUrl: string, itemKey: string, fileIndex: number) => {
    const fileName = fileUrl.split('/').pop() || 'Document';
    const allDetails = fileDetails[itemKey] || [];

    const details =
      allDetails.find(detail => {
        if (!detail.file_path) return false;

        const uiFileName = fileUrl.split('/').pop();
        const detailFileName = detail.file_path.split('/').pop();

        return uiFileName === detailFileName;
      }) || {
        file_path: fileUrl,
        name: fileName,
        _id: `temp-${itemKey}-${fileIndex}`,
        isUserVerified: false,
        isAdminVerified: false,
        verificationStatus: 'pending' as const,
        expiryDate: '',
        issueDate: ''
      };

    console.log('details', details);
    const detailsExist = !!details && !details._id?.startsWith('temp-');
    console.log('detailsExist', detailsExist);
    const isFileExpired =
      details?.expiryDate && details.expiryDate !== 'Not found'
        ? isExpired(details.expiryDate)
        : false;

    const isVerified =
      details?.isUserVerified === true &&
      details?.isAdminVerified === true;

    const isUserVerified = details?.isUserVerified === true;

    const shortenFileName = (name: string) => {
      if (name.length <= 20) return name;
      return `${name.substring(0, 15)}...${name.substring(name.length - 5)}`;
    };

    return (
      <div key={`${itemKey}-${fileIndex}`} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs mb-1">
        <div className="flex items-center gap-2 flex-1">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-blue-600 hover:text-blue-800 underline"
            title={fileName}
            onClick={(e) => {
              e.preventDefault();
              window.open(fileUrl, '_blank');
            }}
          >
            {shortenFileName(fileName)}
          </a>

          <div className="flex items-center gap-1 flex-wrap">
            {isFileExpired && (
              <Badge variant="destructive" className="text-xs py-0 px-1.5">
                Expired
              </Badge>
            )}

            {details?.expiryDate && !isFileExpired && (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Exp: {details.expiryDate}
              </span>
            )}

            {isVerified && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800 py-0 px-1.5">
                <CheckCircle className="h-3 w-3 mr-1 inline" />
                Verified
              </Badge>
            )}

            {detailsExist && !isVerified && details && !isFileExpired && (
              // In renderFileWithVerification function, update the onClick handler:
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log(`🔘 Verify clicked for ${itemKey} in ${title} tab`);

                  // Find the exact file details entry
                  const exactDetails = allDetails.find((detail: FileDetails) =>
                    detail.file_path === fileUrl ||
                    (detail._id && details?._id === detail._id)
                  );

                  const verificationData = {
                    file: exactDetails || details,
                    questionId: itemKey,
                    key: itemKey,
                    question: complianceItems.find(item => item.key === itemKey)?.name ||
                      details?.name ||
                      'Document',
                    _id: (exactDetails || details)?._id
                  };

                  handleVerifyClick(verificationData, title);
                }}
                className="h-6 text-xs py-0 px-2"
                disabled={!buttonEnabled || isUserVerified}
              >
                {isUserVerified ? (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Admin
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Verify
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleDeleteExistingFile(itemKey, fileIndex, fileUrl)}
          className="h-5 w-5 p-0 text-red-500 hover:text-red-700 ml-2"
          disabled={!buttonEnabled}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  };

  const renderAttachmentCell = (item: ComplianceItem) => {
    const key = item.key;
    const error = errors[key];

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor={`file-upload-${item.key}`} className="cursor-pointer">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-xs">
              <Upload className="h-3 w-3" />
              Upload
            </div>
          </label>

          <input
            id={`file-upload-${item.key}`}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(item.key, e.target.files)}
            disabled={!buttonEnabled}
          />
          {/* <span className="text-xs text-gray-500">
            {item.attachment.length + (filePaths[key]?.length || 0)} / 10 files
          </span> */}
        </div>

        {filePaths[key] && filePaths[key].length > 0 ? (
          filePaths[key].map((fileUrl, i) =>
            <div key={`${key}-${i}`}>
              {renderFileWithVerification(fileUrl, key, i)}
            </div>
          )
        ) : (
          <div className="text-gray-500 text-sm italic">No files uploaded yet</div>
        )}

        {item.attachment.map((file, fileIndex) => (
          <div key={`new-${item.key}-${fileIndex}`} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs mb-1">
            <div className="flex items-center gap-2 flex-1">
              <a
                href={URL.createObjectURL(file)}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-blue-600 hover:text-blue-800 underline"
                title={file.name}
              >
                {file.name.length > 20
                  ? `${file.name.substring(0, 15)}...${file.name.substring(file.name.length - 5)}`
                  : file.name}
              </a>
              <Badge variant="secondary" className="text-xs py-0 px-1.5">
                New
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveFile(item.key, fileIndex)}
              className="h-5 w-5 p-0 text-red-500 hover:text-red-700 ml-2"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {error && error.includes('upload') && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  };

  const renderITSecurityNotesCell = (item: ComplianceItem) => {
    const key = item.key;
    const error = errors[key];

    return (
      <div className="space-y-2">
        <Textarea
          value={item.notes}
          onChange={(e) => handleNotesChange(item.key, e.target.value)}
          placeholder="Enter notes..."
          className={`min-h-[80px] ${error?.includes('reason') ? 'border-red-500' : ''}`}
          disabled={!buttonEnabled}
        />
        {error && error.includes('reason') && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  };

  const hasFileDetails = (key: string) =>
    Array.isArray(fileDetails[key]) && fileDetails[key].length > 0;


  // ============ RENDER COMPONENT ============
  return (
    <>
      {(complianceItems.length > 0) ? (
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <span className="ml-2">Loading {title} data...</span>
              </div>
            ) : error ? (
              <p className="text-blue-500 font-medium text-sm text-center bg-blue-50 p-3 rounded-md">
                {error}
              </p>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left text-sm font-semibold text-gray-900">S. No.</th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-900">
                          {type === 'it-security' ? 'IT Security' : 'Documents & Records'}
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        {type !== 'it-security' && (
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Attachment</th>
                        )}
                        {type === 'it-security' && (
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Supporting Documents</th>
                        )}
                        <th className="p-3 text-left text-sm font-semibold text-gray-900">
                          {type === 'it-security' ? 'Details' : 'Company Notes'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {complianceItems.map((item, idx) => (
                        <tr key={item.key}>
                          <td className="whitespace-nowrap p-3 text-sm text-center text-gray-500">{idx + 1}</td>
                          <td className="p-3 text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="p-3 text-sm text-gray-500">
                            {TEXT_INPUT_KEYS.includes(item.key) ? (
                              <Input
                                value={item.isApplicable}
                                onChange={(e) => handleStatusChange(item.key, e.target.value)}
                                placeholder="Enter details"
                                className="w-full min-w p-2 border rounded-md"
                                disabled={!buttonEnabled}
                              />
                            ) : TEXTAREA_KEYS.includes(item.key) ? (
                              <Textarea
                                value={item.isApplicable}
                                onChange={(e) => handleStatusChange(item.key, e.target.value)}
                                placeholder="Enter description..."
                                className="min-h-[80px]"
                                disabled={!buttonEnabled}
                              />
                            ) : (
                              <Select
                                value={item.isApplicable}
                                onValueChange={(value) => handleStatusChange(item.key, value)}
                                disabled={!buttonEnabled}
                              >
                                <SelectTrigger disabled={!buttonEnabled}>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </td>
                          {!(TEXT_INPUT_KEYS.includes(item.key) || TEXTAREA_KEYS.includes(item.key)) && (
                            <>
                              {type !== 'it-security' && (
                                <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                                  {renderAttachmentCell(item)}
                                </td>
                              )}

                              {type === 'it-security' && (
                                <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                                  {renderAttachmentCell(item)}
                                </td>
                              )}

                              <td className="p-3 text-sm text-gray-500">
                                {renderITSecurityNotesCell(item)}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button onClick={handleSave} variant="outline" disabled={isLoading || !buttonEnabled} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save as Draft'
                    )}
                  </Button>
                  <Button onClick={handleFinalSubmit} className="flex-1" disabled={isLoading || !buttonEnabled}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : null}

      {VerificationModal}
    </>
  );
};

export default IRLComplianceTable;