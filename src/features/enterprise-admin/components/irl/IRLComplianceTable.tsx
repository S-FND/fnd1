import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import {
  fetchBoData, updateBoData,
  fetchComplianceData, updateComplianceData,
  fetchManagementData, updateManagementData,
  fetchITSecurityData, updateITSecurityData,
  fetchGovernanceData, updateGovernanceData,
  fetchFacilityData, updateFacilityData, deleteFile,
  // verifyDocument
} from '../../services/companyApi';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { logger } from '@/hooks/logger';
import { httpClient } from '@/lib/httpClient';
import { Badge } from '@/components/ui/badge';
const hasLoggedRef = useRef(false);
const TEXT_INPUT_KEYS = ['type_of_servers_used', 'cloud_servers_used', 'scope_data_stored_servers', 'name_of_contractors',
  'name_of_refrigerants',
  'supplier_code_of_conduct',
  'partner_selection_criteria_checklist'];
const TEXTAREA_KEYS = ['customer_data_security_privacy'];
interface ComplianceItem {
  id: number;
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
  onVerifyClick?: (data: {
    file: FileDetails;
    questionId: string;
    key: string;
    question: string;
  }) => void;
}

const fetchCompanyConfiguration = async (entityId: string, category: string) => {
  try {
    const response: any = await httpClient.get(
      `company-irl/${entityId}/irl-config?category=${encodeURIComponent(category)}`
    );

    if (response?.data?.status === true) {
      const responseData = response.data.data;
      
      // Check if data is null (no config) or an object (config exists)
      if (responseData === null) {
        // No configuration found
        return {
          enabledItems: [],
          configExists: false,
          message: response.data.message || 'No configuration found'
        };
      } else if (responseData?.configuration === null || responseData?.configuration === undefined) {
        // Configuration record exists but configuration field is null/undefined
        // This means no config has been set yet, so show all items (default behavior)
        return {
          enabledItems: [],
          configExists: false
        };
      } else {
        // Configuration exists
        return {
          enabledItems: responseData?.configuration?.enabledItems || [],
          configExists: true,
          message: response.data.message || 'Configuration retrieved successfully'
        };
      }
    }
    
    // Default case
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

const IRLComplianceTable: React.FC<IRLComplianceTableProps> = ({
  title,
  description,
  items,
  type = 'default',
  buttonEnabled,
  onVerifyClick
}) => {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [filePaths, setFilePaths] = useState<Record<string, string[]>>({});
  const [fileDetails, setFileDetails] = useState<Record<string, FileDetails[]>>({});
  const [verifyingFile, setVerifyingFile] = useState<string | null>(null);

  const getS3FilePath = (file_path: string) => {
    // If already a full URL, return as-is
    if (file_path.startsWith('https://')) {
      return file_path;
    }

    // Check if it's from the staging environment
    if (file_path.includes('fandoro-sustainability-saas-stage')) {
      return file_path;
    }

    // Default to production S3 bucket
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

  // Add this debug useEffect after your state declarations
  useEffect(() => {
    console.log('DEBUG - Current state:');
    console.log('filePaths:', filePaths);
    console.log('fileDetails:', fileDetails);
    console.log('complianceItems:', complianceItems);

    // Log each item's file details
    complianceItems.forEach(item => {
      const key = item.key;
      if (fileDetails[key]) {
        console.log(`Item ${key} has ${fileDetails[key].length} file details:`, fileDetails[key]);
      }
    });
  }, [filePaths, fileDetails, complianceItems]);

  useEffect(() => {
    const loadCompanyConfig = async () => {
      if (!entityId) return;
      
      try {
        const category = getCategoryFromTitle(title);
        const configResult = await fetchCompanyConfiguration(entityId, category);
        const { enabledItems, configExists } = configResult;
        console.log('<----------configResult---------->',configResult);
        let filtered: any = [];
        
        if (!configExists) {
          // No config exists yet - show all items (default behavior)
          filtered = items;
        } else {
          // Config exists
          if (enabledItems.length > 0) {
            // Some items are enabled - show only those
            filtered = items.filter(item => enabledItems.includes(item.key));
          } else {
            // Config exists but all items are hidden - show nothing
            filtered = [];
          }
        }
        
        setComplianceItems(
          filtered.map((item, index) => ({
            id: index + 1,
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
        // On error, default to showing all items
        setComplianceItems(
          items.map((item, index) => ({
            id: index + 1,
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
  }, [entityId, title, items]);

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

        console.log(`DEBUG - Processing ${key}:`, itemData);

        const isApplicable = itemData.isApplicable || itemData.answer || '';
        const notes = itemData.reason || '';

        // Store file paths
        const existingFiles = itemData.file_path || itemData.existing_files || [];
        if (existingFiles.length > 0) {
          // IMPORTANT: Like the example, store the FULL URLs
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

        // CRITICAL FIX: Store file details exactly like the example component
        if (itemData.file_details && Array.isArray(itemData.file_details)) {
          console.log(`DEBUG - Found file_details for ${key}:`, itemData.file_details);

          // Map file details exactly as in the example
          const mappedDetails = itemData.file_details.map((detail: any, index: number) => {
            console.log(`📄 [File Detail ${index}]`);
            console.log('  Original detail:', detail);

            // Get the file path - check if it's already a full URL
            let filePath = detail.file_path;
            console.log('  Original file_path:', filePath);

            if (filePath && !filePath.startsWith('https://')) {
              // Make sure we have the full S3 URL
              filePath = getS3FilePath(filePath);
              console.log('  Converted to full URL:', filePath);
            }

            console.log('  Final file_path:', filePath);

            return {
              ...detail,
              file_path: filePath,
              // IMPORTANT: The example uses isUserVerified directly from API
              isUserVerified: detail.isUserVerified || false,
              isAdminVerified: detail.isAdminVerified || false,
              // Map verification status
              verificationStatus: detail.isUserVerified && detail.isAdminVerified
                ? 'verified'
                : (!detail.isUserVerified && !detail.isAdminVerified)
                  ? 'rejected'
                  : 'pending',
              expiryDate: detail.expiryDate || '',
              name: detail.name || filePath?.split('/').pop() || 'Document',
              // Keep the original _id if it exists
              _id: detail._id || Math.random().toString(36).substr(2, 9)
            };
          });

          console.log(`DEBUG - Mapped details for ${key}:`, mappedDetails);

          setFileDetails(prev => ({
            ...prev,
            [key]: mappedDetails
          }));
        } else if (existingFiles.length > 0) {
          // If we have files but no file_details, create placeholder details
          // This matches the example component's behavior
          const placeholderDetails = existingFiles.map((file, index) => {
            const filePath = file.startsWith('https://') ? file : getS3FilePath(file);
            return {
              file_path: filePath,
              isUserVerified: false,
              isAdminVerified: false,
              verificationStatus: 'pending' as const,
              expiryDate: '',
              name: filePath.split('/').pop() || `Document ${index + 1}`,
              _id: Math.random().toString(36).substr(2, 9)
            };
          });

          setFileDetails(prev => ({
            ...prev,
            [key]: placeholderDetails
          }));
        }

        if (TEXTAREA_KEYS.includes(key) || TEXT_INPUT_KEYS.includes(key)) {
          return {
            ...item,
            isApplicable: response[key] || '',
            notes: ''
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [entityId]);

  // const handleVerifyDocument = async (file: FileDetails, itemKey: string, questionName: string) => {
  //   if (!file.file_path) {
  //     toast.error('No valid file found for verification');
  //     return;
  //   }

  //   // If parent provides verification handler
  //   if (onVerifyClick) {
  //     onVerifyClick({
  //       file: file,
  //       questionId: itemKey,
  //       key: itemKey,
  //       question: questionName,
  //     });
  //     return;
  //   }

  //   // Otherwise handle internally (optional)
  //   setVerifyingFile(file.file_path);
  //   try {
  //     // Call your verification API here
  //     // const response = await verifyDocument({...});

  //     // Update verification status in state
  //     setFileDetails(prev => ({
  //       ...prev,
  //       [itemKey]: prev[itemKey]?.map(f =>
  //         f.file_path === file.file_path
  //           ? {
  //             ...f,
  //             isUserVerified: true,
  //             verificationStatus: 'verified',
  //             verifiedBy: 'Admin', // From API response
  //             verifiedAt: new Date().toISOString()
  //           }
  //           : f
  //       ) || []
  //     }));

  //     toast.success('Document verified successfully!');
  //   } catch (error) {
  //     toast.error('Failed to verify document');
  //     console.error('Verification error:', error);
  //   } finally {
  //     setVerifyingFile(null);
  //   }
  // };

  useEffect(() => {
    console.log('📊 [FILES LOADED]');
    Object.keys(filePaths).forEach(key => {
      console.log(`  ${key}: ${filePaths[key]?.length || 0} files`);
    });
  }, [filePaths]);

  const renderFileWithVerification = (fileUrl: string, itemKey: string, fileIndex: number) => {
    console.log(`🔍 [renderFileWithVerification CALLED] ${itemKey} - File ${fileIndex}`);
    
    const fileName = fileUrl.split('/').pop() || 'Document';
    const allDetails = fileDetails[itemKey] || [];
    const renderCount = { current: 0 };
  
    // Only log first 2 times
    if (renderCount.current < 2) {
      console.log(`🔍 [Render ${renderCount.current + 1}] ${itemKey} - File ${fileIndex}`);
      renderCount.current++;
    }
    if (!hasLoggedRef.current) {
      console.log(`🔍 [INITIAL RENDER] ${itemKey} - File ${fileIndex}`);
      if (fileIndex === filePaths[itemKey]?.length - 1) {
        hasLoggedRef.current = true;
      }
    }
    // Find or create details
    let details = allDetails.find((detail: FileDetails, index: number) => {
      // Clean URLs for comparison
      const cleanFileUrl = fileUrl.toLowerCase();
      const cleanDetailPath = (detail.file_path || '').toLowerCase();

      // Multiple matching strategies
      return (
        cleanDetailPath === cleanFileUrl || // Exact match
        cleanDetailPath.includes(fileName.toLowerCase()) || // Contains filename
        cleanDetailPath.endsWith(fileName.toLowerCase()) || // Ends with filename
        index === fileIndex // Position match
      );
    });

    // Fallback: use index or create placeholder
    if (!details && allDetails[fileIndex]) {
      details = allDetails[fileIndex];
    } else if (!details) {
      details = {
        file_path: fileUrl,
        name: fileName,
        _id: `temp-${itemKey}-${fileIndex}`,
        isUserVerified: false,
        isAdminVerified: false,
        verificationStatus: 'pending' as const,
        expiryDate: ''
      };
    }

    const isFileExpired = details?.expiryDate ? isExpired(details.expiryDate) : false;
    const isVerified = details?.isUserVerified === true && details?.isAdminVerified === true;
    const isUserVerified = details?.isUserVerified === true;

    const shortenFileName = (name: string) => {
      if (name.length <= 20) return name;
      return `${name.substring(0, 15)}...${name.substring(name.length - 5)}`;
    };

    return (
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs mb-1">
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

          <div className="flex items-center gap-1">
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

            {!isUserVerified && details && !isFileExpired && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // ✅ KEEP logs only in the click handler
                  console.log(`🔘 [Verify Clicked] ${itemKey} - File ${fileIndex}`);
                  console.log('  File URL:', fileUrl);
                  console.log('  Details:', details);

                  // Create the data object
                  const verificationData = {
                    file: details,
                    questionId: itemKey,
                    key: itemKey,
                    question: complianceItems.find(item => item.key === itemKey)?.name || '',
                  };

                  console.log('📤 Sending:', verificationData);

                  if (onVerifyClick) {
                    onVerifyClick(verificationData);
                  }
                }}
                className="h-6 text-xs py-0 px-2"
                disabled={!buttonEnabled}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Verify
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
          fileChange: item.attachment.length > 0
        };
      }
    });

    return payload;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    complianceItems.forEach(item => {
      const key = item.key;
      if (item.isApplicable === 'yes') {
        const hasFiles = (
          (filePaths[key]?.length > 0) ||
          (item.attachment.length > 0)
        );
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


  const handleSubmit = async (isDraft = false) => {
    if (!entityId) {
      toast.error('Entity ID not found');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the validation errors.');
      return;
    }

    setIsLoading(true);

    try {
      const formData: any = new FormData();

      const payload = buildPayload(isDraft);
      formData.append('data', JSON.stringify(payload));

      complianceItems.forEach(item => {
        const key = item.key;

        if (item.attachment.length > 0) {
          item.attachment.forEach(file => {
            const sanitizedFileName = sanitizeFileName(file.name);
            formData.append(`${key}_file`, file, sanitizedFileName);
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

  const handleStatusChange = (id: number, isApplicable: string) => {
    setComplianceItems(items =>
      items.map(item => item.id === id ? { ...item, isApplicable } : item)
    );
  };

  const handleNotesChange = (id: number, notes: string) => {
    setComplianceItems(items =>
      items.map(item => item.id === id ? { ...item, notes } : item)
    );
  };

  const handleFileUpload = (id: number, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentItem = complianceItems.find(item => item.id === id);
    const existingFiles = currentItem?.attachment.length || 0;
    const newFiles = Array.from(files);
    const totalFiles = existingFiles + newFiles.length;

    if (totalFiles > 10) {
      toast.error('You can upload a maximum of 10 files.');

      setTimeout(() => {
        const input = document.getElementById(`file-upload-${id}`) as HTMLInputElement | null;
        if (input) {
          input.value = '';
        }
      }, 0);

      return;
    }

    setComplianceItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, attachment: [...item.attachment, ...newFiles] }
          : item
      )
    );
  };

  const handleRemoveFile = (id: number, fileIndex: number) => {
    setComplianceItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, attachment: item.attachment.filter((_, index) => index !== fileIndex) }
          : item
      )
    );
  };

  const sanitizeFileName = (fileName) => {
    if (!fileName || typeof fileName !== 'string') {
      return fileName || '';
    }

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
      return fileName
        .replace(/\./g, '_')
        .replace(/\s+/g, '_');
    }

    const namePart = fileName.substring(0, lastDotIndex);
    const extension = fileName.substring(lastDotIndex);

    const sanitizedBaseName = namePart
      .replace(/\./g, '_')
      .replace(/\s+/g, '_');

    return sanitizedBaseName + extension;
  };

  const renderAttachmentCell = (item: ComplianceItem) => {
    const key = item.key;
    const error = errors[key];

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {/* File upload input */}
        </div>

        {/* IMPORTANT: Check if filePaths has data for this key */}
        {filePaths[key] && filePaths[key].length > 0 ? (
          filePaths[key].map((fileUrl, i) =>
            <div key={`${key}-${i}-${fileUrl}`}>
              {renderFileWithVerification(fileUrl, key, i)}
            </div>
          )
        ) : (
          <div className="text-gray-500 text-sm italic">No files uploaded yet</div>
        )}

        {/* Newly uploaded files */}
        {item.attachment.map((file, fileIndex) => (
          <div key={`new-${item.key}-${fileIndex}-${file.name}`} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs mb-1">
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
              onClick={() => handleRemoveFile(item.id, fileIndex)}
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
          onChange={(e) => handleNotesChange(item.id, e.target.value)}
          placeholder="Enter notes..."
          className={`min-h-[80px] ${error?.includes('reason') ? 'border-red-500' : ''}`}
        />
        {error && error.includes('reason') && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  };

  const handleDeleteExistingFile = async (key: string, fileIndex: number, fileUrl: string) => {
    try {
      setIsLoading(true);
      const filePath = fileUrl.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/', '');

      let type: string;
      switch (title.toLowerCase()) {
        case 'business operations':
          type = 'bo';
          break;
        case 'compliance':
          type = 'lc';
          break;
        case 'management':
          type = 'ms';
          break;
        case 'it security & data privacy':
          type = 'it';
          break;
        case 'governance':
          type = 'governance';
          break;
        case 'facility information':
          type = 'facility';
          break;
      }

      const payload = {
        filesToDelete: [filePath]
      };

      await deleteFile(payload, type);

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
      await loadData();
      toast.success('File deleted successfully');
    } catch (err) {
      logger.error('Error deleting file:', err);
      toast.error(err.message || 'Failed to delete file');
    } finally {
      setIsLoading(false);
    }
  };

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
                    <tr key={`${item.key}-${idx}`}>
                      <td className="whitespace-nowrap p-3 text-sm text-center text-gray-500">{idx + 1}</td>
                      <td className="p-3 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="p-3 text-sm text-gray-500">
                        {TEXT_INPUT_KEYS.includes(item.key) ? (
                          <Input
                            value={item.isApplicable}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            placeholder="Enter details"
                            className="w-full min-w p-2 border rounded-md"
                            disabled={!buttonEnabled}
                          />
                        ) : TEXTAREA_KEYS.includes(item.key) ? (
                          <Textarea
                            value={item.isApplicable}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            placeholder="Enter description..."
                            className="min-h-[80px]"
                            disabled={!buttonEnabled}
                          />
                        ) : (
                          <Select
                            value={item.isApplicable}
                            onValueChange={(value) => handleStatusChange(item.id, value)}
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
  </>
  );
};

export default IRLComplianceTable;