import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Clock, Eye, AlertCircle, Upload } from 'lucide-react';
import {
  fetchHoPhotographs,
  updateHoPhotographs,
  fetchProductPhotographs,
  updateProductPhotographs,
  deleteFile
} from '../../services/companyApi';
import TableRowQuestion from './utils/TableRowQuestion';
import { logger } from '@/hooks/logger';
import { httpClient } from '@/lib/httpClient';
import { getS3FilePath,extractS3Key } from "@/utils/fileUrl";
// Add verification imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface OfficePhotograph {
  id: number;
  description: string;
  status: string;
  attachment: File[];
  file_path: string[];
  key: string;
  notes?: string;
  file_details?: any[]; // Add file_details for verification
}

interface ProductPhotograph {
  id: number;
  description: string;
  status: string;
  attachment: File[];
  file_path: string[];
  key: string;
  notes?: string;
  file_details?: any[]; // Add file_details for verification
}

// Add FileDetails interface
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
  adminComment?: string;
  adminVerifiedAt?: string;
}

// Define all possible photograph questions with their keys
const allPhotographQuestions = [
  { key: 'electrical_main_panel', description: 'Electrical main panel inside the office', category: 'office' },
  { key: 'pantry', description: 'Pantry', category: 'office' },
  { key: 'working_areas_occupied', description: 'Working areas occupied by the Company', category: 'office' },
  { key: 'emergency_exits', description: 'Emergency exits, emergency signages, warning signages', category: 'office' },
  { key: 'overall_office_pictures', description: 'General overall office pictures', category: 'office' },
  { key: 'fire_extinguishers_within_office', description: 'Fire extinguishers and smoke detectors locations', category: 'office' },
  { key: 'product_labeling', description: 'Product labeling', category: 'product' },
  { key: 'app_screenshot', description: 'Screenshot of the app', category: 'product' },
  { key: 'dashboard_screenshot', description: 'Dashboard screenshot', category: 'product' },
  { key: 'product_packing', description: 'Product packaging', category: 'product' }
];

const IRLPhotographs = ({ buttonEnabled }: { buttonEnabled: boolean }) => {
  const [officePhotographs, setOfficePhotographs] = useState<OfficePhotograph[]>([]);
  const [productPhotographs, setProductPhotographs] = useState<ProductPhotograph[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [enabledQuestions, setEnabledQuestions] = useState<string[]>([]);

  // Add verification states
  const [verificationModal, setVerificationModal] = useState(false);
  const [currentFile, setCurrentFile] = useState<any>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const getUserEntityId = (): string | null => {
    try {
      const user = localStorage.getItem('fandoro-user');
      return user ? JSON.parse(user)?.entityId || null : null;
    } catch (error) {
      logger.error("Error parsing user data:", error);
      return null;
    }
  };

  const entityId = getUserEntityId();

  // Function to fetch company configuration
  const fetchCompanyConfiguration = async (entityId: string) => {
    try {
      const response: any = await httpClient.get(
        `company-irl/${entityId}/irl-config?category=photographs`
      );

      if (response?.data?.status === true) {
        return response.data.data?.configuration?.enabledItems || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching photographs configuration:', error);
      return [];
    }
  };

  // Check if a file is expired
  const isExpired = (dateString: string | undefined): boolean => {
    if (!dateString || dateString === 'Not found') return false;
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

  // Format date from DD/MM/YYYY to YYYY-MM-DD for input field
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString || dateString === 'Not found') return '';
    try {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting date for input:', error);
      return '';
    }
  };

  // Get verification endpoint for photographs based on category
  const getVerificationEndpoint = (category: 'office' | 'product') => {
    switch (category) {
      case 'office':
        return 'document/ho_photograph/verify';
      case 'product':
        return 'document/product_photograph/verify';
      default:
        return 'document/photographs/verify';
    }
  };

  const handleVerifyClick = (fileDetails: any, itemKey: string, photoDescription: string, category: 'office' | 'product') => {
    console.log('🎯 [User Verification] Starting for photograph:', photoDescription);
    console.log('fileDetails',fileDetails);
    const originalFilePath = fileDetails.file_path || '';

    if (!originalFilePath) {
      toast.error("No valid file found for verification");
      return;
    }

    setCurrentFile({
      ...fileDetails,
      itemKey,
      question: photoDescription,
      file_path: originalFilePath,
      issueDateInput: formatDateForInput(fileDetails.issueDate),
      expiryDateInput: formatDateForInput(fileDetails.expiryDate),
      isUserVerified: fileDetails.isUserVerified || false,
      verificationEndpoint: getVerificationEndpoint(category), // Set endpoint
      category: category // Set category
    });

    setVerificationModal(true);
  };

  // Handle user verification submission
  const handleVerifyAndClose = async () => {
    if (!currentFile) return;

    setVerificationLoading(true);
    try {
      const entityId = getUserEntityId();
      if (!entityId) {
        toast.error("User not authenticated");
        return;
      }

      // Format dates for API
      const formatDateForAPIFunc = (dateString: string) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      };

      const verificationData = {
        entityId,
        _id: currentFile._id,
        filePath: currentFile.file_path,
        questionId: currentFile.itemKey,
        key: currentFile.itemKey,
        issueDate: currentFile.issueDateInput
          ? formatDateForAPIFunc(currentFile.issueDateInput)
          : currentFile.issueDate || "",
        expiryDate: currentFile.expiryDateInput
          ? formatDateForAPIFunc(currentFile.expiryDateInput)
          : currentFile.expiryDate || "",
        isUserVerified: true,
        verifiedAt: new Date().toISOString(),
        category: currentFile.category || 'photographs'
      };

      console.log('📤 Sending user verification for photograph:', verificationData);

      // FIX: Use the endpoint already stored in currentFile
      const response: any = await httpClient.post(currentFile.verificationEndpoint, verificationData);

      if (response.data.status === true) {
        toast.success("Document verified successfully!");
        // Trigger refresh
        setRefreshTrigger(prev => prev + 1);
        setVerificationModal(false);
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      toast.error(error.message || "Verification failed");
    } finally {
      setVerificationLoading(false);
    }
  };

  // Check if a question is enabled
  const isQuestionEnabled = (questionKey: string) => {
    if (configLoading) return true;
    if (enabledQuestions.length === 0) return true;
    return enabledQuestions.includes(questionKey);
  };

  // Load configuration on component mount
  useEffect(() => {
    const loadConfiguration = async () => {
      setConfigLoading(true);
      try {
        const entityId = getUserEntityId();
        if (entityId) {
          const enabledItems = await fetchCompanyConfiguration(entityId);
          setEnabledQuestions(enabledItems);

          const filteredOfficeQuestions = allPhotographQuestions
            .filter(q => q.category === 'office' && (enabledItems.length === 0 || enabledItems.includes(q.key)))
            .map((q, index) => ({
              id: index + 1,
              description: q.description,
              status: '',
              attachment: [],
              file_path: [],
              key: q.key,
              notes: ''
            }));

          const filteredProductQuestions = allPhotographQuestions
            .filter(q => q.category === 'product' && (enabledItems.length === 0 || enabledItems.includes(q.key)))
            .map((q, index) => ({
              id: index + 1,
              description: q.description,
              status: '',
              attachment: [],
              file_path: [],
              key: q.key,
              notes: ''
            }));

          setOfficePhotographs(filteredOfficeQuestions);
          setProductPhotographs(filteredProductQuestions);
        }
      } catch (err) {
        logger.error('Error loading photographs configuration:', err);
      } finally {
        setConfigLoading(false);
      }
    };

    loadConfiguration();
  }, [refreshTrigger]);

  const loadData = async () => {
    if (!entityId) {
      setError('Please complete your company profile in the Administration section before submitting IRL details.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const enabledOfficeKeys = officePhotographs.map(p => p.key);
      const enabledProductKeys = productPhotographs.map(p => p.key);

      let hoData = {};
      let prodData = {};

      if (enabledOfficeKeys.length > 0) {
        hoData = await fetchHoPhotographs(entityId);
      }

      if (enabledProductKeys.length > 0) {
        prodData = await fetchProductPhotographs(entityId);
      }

      // Process office photographs - include file_details for verification
      const updatedOfficePhotos = officePhotographs.map(photo => {
        const data = hoData[photo.key] || {};
        return {
          ...photo,
          status: data.isApplicable === undefined ? '' : data.isApplicable,
          file_path: Array.isArray(data.file_path)
            ? data.file_path.map(getS3FilePath)
            : data.file_path
              ? [getS3FilePath(data.file_path)]
              : [],
          notes: data.reason || '',
          file_details: data.file_details || [],
          attachment: [],
        };
      });

      // Process product photographs - include file_details for verification
      const updatedProductPhotos = productPhotographs.map(photo => {
        const data = prodData[photo.key] || {};
        return {
          ...photo,
          status: data.isApplicable === undefined ? '' : data.isApplicable,
          file_path: Array.isArray(data.file_path)
            ? data.file_path.map(getS3FilePath)
            : data.file_path
              ? [getS3FilePath(data.file_path)]
              : [],
          notes: data.reason || '',
          file_details: data.file_details || [],
          attachment: [],
        };
      });

      setOfficePhotographs(updatedOfficePhotos);
      setProductPhotographs(updatedProductPhotos);
    } catch (err) {
      console.error('Error loading data:', err);
      // toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!configLoading && (officePhotographs.length > 0 || productPhotographs.length > 0)) {
      loadData();
    }
  }, [entityId, configLoading, refreshTrigger]);

  // Safe function to shorten file names
  const shortenFileName = (name: string | undefined) => {
    if (!name) return 'Document';
    if (name.length <= 20) return name;
    return `${name.substring(0, 15)}...${name.substring(name.length - 5)}`;
  };

  // Render file with verification status for existing files
  const renderFileWithVerification = (
    fileUrl: string,
    photoKey: string,
    fileIndex: number,
    photoDescription: string,
    category: 'office' | 'product',
    onDelete?: () => void
  ) => {
    const fileName = fileUrl.split('/').pop() || 'Document';
  
    const photo =
      category === 'office'
        ? officePhotographs.find(p => p.key === photoKey)
        : productPhotographs.find(p => p.key === photoKey);
  
    if (!photo) return null;
    const isBackendFile = (file?: FileDetails | null) =>
      !!file?._id && !file._id.startsWith('temp-');
    
    // ✅ DIRECT INDEX ACCESS — NO FIND
    const fileDetails = photo.file_details?.[fileIndex] ?? null;
  
    // const allowVerification = !!fileDetails;
    const allowVerification = isBackendFile(fileDetails);

  
    const isFileExpired = fileDetails?.expiryDate
      ? isExpired(fileDetails.expiryDate)
      : false;
  
    const isUserVerified = fileDetails?.isUserVerified === true;
    const isAdminVerified = fileDetails?.isAdminVerified === true;
    const isVerified = isUserVerified && isAdminVerified;
  
    return (
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs mb-1">
        <div className="flex items-center gap-2 flex-1">
          <a
            href={fileUrl}
            onClick={(e) => {
              e.preventDefault();
              window.open(fileUrl, '_blank');
            }}
            className="truncate text-blue-600 underline"
            title={fileName}
          >
            {shortenFileName(fileName)}
          </a>
  
          <div className="flex items-center gap-1 flex-wrap">
            {isFileExpired && (
              <Badge variant="destructive" className="text-xs py-0 px-1.5">
                Expired
              </Badge>
            )}
  
            {fileDetails?.expiryDate && !isFileExpired && (
              <span className="text-xs text-gray-500">
                Exp: {fileDetails.expiryDate}
              </span>
            )}
  
            {isVerified && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                <CheckCircle className="h-3 w-3 mr-1 inline" />
                Verified
              </Badge>
            )}
  
            {isUserVerified && !isAdminVerified && (
              <Badge variant="outline" className="text-yellow-600 text-xs">
                <Clock className="h-3 w-3 mr-1 inline" />
                Pending Admin
              </Badge>
            )}
  
            {/* ✅ VERIFY BUTTON — CORRECTLY SHOWN */}
            {allowVerification && !isUserVerified && !isFileExpired && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() =>
                  handleVerifyClick(
                    fileDetails,
                    photoKey,
                    photoDescription,
                    category
                  )
                }
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
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
          disabled={!buttonEnabled}
        >
          ×
        </button>
      </div>
    );
  };
  
  

  const handleDeleteOfficeFile = async (photoId: number, fileIndex: number, fileUrl: string) => {

    try {
      setIsSubmitting(true);
      const filePath = extractS3Key(fileUrl);

      console.log('File path to delete:', filePath);

      const payload = {
        filesToDelete: [filePath]
      };

      console.log('Payload:', payload);

      // Use the imported deleteFile function
      await deleteFile(payload, 'ho_photograph');

      setOfficePhotographs(prev =>
        prev.map(photo =>
          photo.id === photoId
            ? {
              ...photo,
              file_path: photo.file_path.filter((_, index) => index !== fileIndex)
            }
            : photo
        )
      );

      console.log('File deleted from state');
      toast.success('File deleted successfully');
    } catch (err) {
      console.error('Error deleting file:', err);
      logger.error('Error deleting file:', err);
      toast.error('Failed to delete file');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProductFile = async (photoId: number, fileIndex: number, fileUrl: string) => {
    console.log('handleDeleteProductFile called:', { photoId, fileIndex, fileUrl });

    try {
      setIsSubmitting(true);
      const filePath = extractS3Key(fileUrl);

      console.log('File path to delete:', filePath);

      const payload = {
        filesToDelete: [filePath]
      };

      console.log('Payload:', payload);

      await deleteFile(payload, 'photographs_products');

      setProductPhotographs(prev =>
        prev.map(photo =>
          photo.id === photoId
            ? {
              ...photo,
              file_path: photo.file_path.filter((_, index) => index !== fileIndex)
            }
            : photo
        )
      );

      console.log('File deleted from state');
      toast.success('File deleted successfully');
    } catch (err) {
      console.error('Error deleting file:', err);
      logger.error('Error deleting file:', err);
      toast.error('Failed to delete file');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    officePhotographs.forEach(photo => {
      if (photo.status === 'yes') {
        const hasExistingFiles = Array.isArray(photo.file_path) && photo.file_path.length > 0;
        const hasNewFiles = Array.isArray(photo.attachment) && photo.attachment.length > 0;
        if (!hasExistingFiles && !hasNewFiles) {
          newErrors[`${photo.key}-files`] = 'Please upload the document.';
          isValid = false;
        }
      }
      else if (photo.status === 'no' && !photo.notes?.trim()) {
        newErrors[`${photo.key}-notes`] = 'Please provide the reason.';
        isValid = false;
      }
    });

    productPhotographs.forEach(photo => {
      if (photo.status === 'yes') {
        const hasExistingFiles = Array.isArray(photo.file_path) && photo.file_path.length > 0;
        const hasNewFiles = Array.isArray(photo.attachment) && photo.attachment.length > 0;
        if (!hasExistingFiles && !hasNewFiles) {
          newErrors[`${photo.key}-files`] = 'Please upload the document.';
          isValid = false;
        }
      }
      else if (photo.status === 'no' && !photo.notes?.trim()) {
        newErrors[`${photo.key}-notes`] = 'Please provide the reason.';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const sanitizeFileName = (fileName: any) => {
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

  const handleSubmit = async (isDraft = false) => {
    if (!entityId) {
      toast.error('Entity ID not found');
      return;
    }
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const hoPayload = {
        entityId,
        isDraft,
      };

      officePhotographs.forEach(photo => {
        hoPayload[photo.key] = {
          answer: photo.status,
          reason: photo.status === 'no' ? photo.notes : '',
          file_path: photo.file_path.map(path => extractS3Key(path)),
          fileChange: photo.attachment?.length > 0
        };
      });

      const hoFormData = new FormData();
      hoFormData.append('data', JSON.stringify(hoPayload));

      officePhotographs.forEach(photo => {
        if (photo.attachment?.length > 0) {
          photo.attachment.forEach(file => {
            const sanitizedFileName = sanitizeFileName(file.name);
            hoFormData.append(`${photo.key}_file`, file, sanitizedFileName);
          });
        }
      });

      const prodPayload: Record<string, any> = {
        entityId,
        isDraft
      };

      productPhotographs.forEach(photo => {
        prodPayload[photo.key] = {
          answer: photo.status,
          reason: photo.status === 'no' ? photo.notes : '',
          file_path: photo.file_path.map(path => extractS3Key(path)),
          fileChange: photo.attachment?.length > 0
        };
      });

      const prodFormData = new FormData();
      prodFormData.append('data', JSON.stringify(prodPayload));

      productPhotographs.forEach(photo => {
        if (photo.attachment?.length > 0) {
          photo.attachment.forEach(file => {
            const sanitizedFileName = sanitizeFileName(file.name);
            prodFormData.append(`${photo.key}_file`, file, sanitizedFileName);
          });
        }
      });

      const promises = [];
      if (officePhotographs.length > 0) {
        promises.push(updateHoPhotographs(hoFormData));
      }
      if (productPhotographs.length > 0) {
        promises.push(updateProductPhotographs(prodFormData));
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        toast.success(isDraft ? 'Draft saved successfully!' : 'Photographs submitted successfully!');
        await loadData();
      } else {
        toast.info('No photographs configured to submit');
      }
    } catch (err) {
      logger.error('Submission error:', err);
      toast.error('Failed to submit photographs. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOfficePhotographChange = (
    id: number,
    field: keyof OfficePhotograph,
    value: any
  ) => {
    setOfficePhotographs(prev =>
      prev.map(photo =>
        photo.id === id
          ? {
            ...photo,
            [field]: value,
            ...(field === 'status' && value === 'no' ? { attachment: [] } : {})
          }
          : photo
      )
    );
  };

  const handleProductPhotographChange = (
    id: number,
    field: keyof ProductPhotograph,
    value: any
  ) => {
    setProductPhotographs(prev =>
      prev.map(photo =>
        photo.id === id
          ? {
            ...photo,
            [field]: value,
            ...(field === 'status' && value === 'no' ? { attachment: [] } : {})
          }
          : photo
      )
    );
  };

  if (isLoading || configLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading photographs data...</span>
      </div>
    );
  }

  return (
    <>
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Photographs</CardTitle>
          <CardDescription>
            Upload required photographs for office and products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error ? (
            <p className="text-blue-500 font-medium text-sm text-center bg-blue-50 p-3 rounded-md">
              {error}
            </p>
          ) : (
            <>
              {officePhotographs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Office Photographs</h3>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">S. No.</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Description</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Attachment</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {officePhotographs.map((photo, index) => (
                          <tr key={photo.id}>
                            <td className="whitespace-nowrap p-3 text-sm text-center text-gray-500">{index + 1}</td>
                            <td className="p-3 text-sm font-medium text-gray-900">{photo.description}</td>

                            {/* STATUS - Editable Dropdown */}
                            <td className="p-3 text-sm text-gray-500">
                              <select
                                value={photo.status}
                                onChange={(e) => handleOfficePhotographChange(photo.id, 'status', e.target.value)}
                                className="w-full p-2 border rounded"
                                disabled={!buttonEnabled}
                              >
                                <option value="">Select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </td>

                            {/* ATTACHMENT - Existing files + Upload */}
                            <td className="p-3 text-sm text-gray-500">
                              <div className="space-y-2">
                                {/* New file upload - only show when status=yes and enabled */}
                                {photo.status === 'yes' && buttonEnabled && (
                                  <div className="flex flex-col items-start gap-2">
                                    <input
                                      id={`office-upload-${photo.id}`}
                                      type="file"
                                      multiple
                                      className="hidden"
                                      disabled={!buttonEnabled}
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        handleOfficePhotographChange(
                                          photo.id,
                                          'attachment',
                                          [...(photo.attachment || []), ...files]
                                        );
                                        e.target.value = '';
                                      }}
                                    />

                                    <label htmlFor={`office-upload-${photo.id}`} className="cursor-pointer">
                                      <div
                                        className={`inline-flex gap-1 px-3 py-1.5 rounded-md text-xs
                                          ${
                                            !buttonEnabled
                                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                              : errors[`${photo.key}-files`]
                                              ? 'bg-red-50 text-red-600 border border-red-400'
                                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                          }
                                        `}
                                      >
                                        <Upload className="h-3 w-3" />
                                        Upload
                                      </div>
                                    </label>
                                    {/* Existing files */}
                                    <div className="flex flex-col gap-1 pl-1">
                                    {photo.file_path.map((fileUrl, fileIndex) => (
                                      <div key={fileIndex}>
                                        {renderFileWithVerification(
                                          fileUrl,
                                          photo.key,
                                          fileIndex,
                                          photo.key,
                                          'office',
                                          () => handleDeleteOfficeFile(photo.id, fileIndex, fileUrl)
                                        )}
                                      </div>
                                    ))}
                                    </div>
                                    {/* Show selected new files */}
                                    {photo.attachment?.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        {photo.attachment.map((file, idx) => (
                                          <div key={idx} className="flex items-center justify-between bg-blue-50 p-2 rounded text-xs">
                                            <span className="truncate">{file.name}</span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newAttachments = [...photo.attachment];
                                                newAttachments.splice(idx, 1);
                                                handleOfficePhotographChange(photo.id, 'attachment', []);
                                              }}
                                              className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Validation error */}
                                    {errors[`${photo.key}-files`] && (
                                      <p className="text-red-500 text-xs mt-1">{errors[`${photo.key}-files`]}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* NOTES - Editable when status=no */}
                            <td className="p-3 text-sm text-gray-500">
                              {photo.status === 'no' ? (
                                <>
                                  <textarea
                                    value={photo.notes || ''}
                                    onChange={(e) => handleOfficePhotographChange(photo.id, 'notes', e.target.value)}
                                    className="w-full p-2 border rounded min-h-[80px]"
                                    placeholder="Please provide reason..."
                                    disabled={!buttonEnabled}
                                  />
                                  {errors[`${photo.key}-notes`] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[`${photo.key}-notes`]}</p>
                                  )}
                                </>
                              ) : (
                                <div className="p-2 bg-gray-50 rounded min-h-[80px]">
                                  {photo.notes || 'N/A'}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {productPhotographs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Photographs</h3>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">S. No.</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Description</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Attachment</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-900">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {productPhotographs.map((photo, index) => (
                          <tr key={photo.id}>
                            <td className="whitespace-nowrap p-3 text-sm text-center text-gray-500">{index + 1}</td>
                            <td className="p-3 text-sm font-medium text-gray-900">{photo.description}</td>

                            {/* STATUS - Editable Dropdown */}
                            <td className="p-3 text-sm text-gray-500">
                              <select
                                value={photo.status}
                                onChange={(e) => handleProductPhotographChange(photo.id, 'status', e.target.value)}
                                className="w-full p-2 border rounded"
                                disabled={!buttonEnabled}
                              >
                                <option value="">Select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </td>

                            {/* ATTACHMENT - Existing files + Upload */}
                            <td className="p-3 text-sm text-gray-500">
                              <div className="space-y-2">
                                {/* New file upload - only show when status=yes and enabled */}
                                {photo.status === 'yes' && buttonEnabled && (
                                  <div className="flex flex-col items-start gap-2">
                                   <input
                                      id={`product-upload-${photo.id}`}
                                      type="file"
                                      multiple
                                      className="hidden"
                                      disabled={!buttonEnabled}
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        handleProductPhotographChange(
                                          photo.id,
                                          'attachment',
                                          [...(photo.attachment || []), ...files]
                                        );
                                        e.target.value = '';
                                      }}
                                    />
                                    <label htmlFor={`product-upload-${photo.id}`} className="cursor-pointer">
                                      <div
                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs
                                          ${
                                            !buttonEnabled
                                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                              : errors[`${photo.key}-files`]
                                              ? 'bg-red-50 text-red-600 border border-red-400'
                                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                          }
                                        `}
                                      >
                                        <Upload className="h-3 w-3" />
                                        Upload
                                      </div>
                                    </label>
                                    <div className="flex flex-col gap-1 pl-1">
                                    {/* Existing files */}
                                    {photo.file_path.map((fileUrl, fileIndex) => (
                                      <div key={fileIndex}>
                                        {renderFileWithVerification(
                                          fileUrl,
                                          photo.key,
                                          fileIndex,
                                          photo.key,
                                          'product',
                                          () => handleDeleteProductFile(photo.id, fileIndex, fileUrl)
                                        )}
                                      </div>
                                    ))}
                                    </div>
                                    {/* Show selected new files */}
                                    {photo.attachment?.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        {photo.attachment.map((file, idx) => (
                                          <div key={idx} className="flex items-center justify-between bg-blue-50 p-2 rounded text-xs">
                                            <span className="truncate">{file.name}</span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newAttachments = [...photo.attachment];
                                                newAttachments.splice(idx, 1);
                                                handleProductPhotographChange(photo.id, 'attachment', []);
                                              }}
                                              className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Validation error */}
                                    {errors[`${photo.key}-files`] && (
                                      <p className="text-red-500 text-xs mt-1">{errors[`${photo.key}-files`]}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* NOTES - Editable when status=no */}
                            <td className="p-3 text-sm text-gray-500">
                              {photo.status === 'no' ? (
                                <>
                                  <textarea
                                    value={photo.notes || ''}
                                    onChange={(e) => handleProductPhotographChange(photo.id, 'notes', e.target.value)}
                                    className="w-full p-2 border rounded min-h-[80px]"
                                    placeholder="Please provide reason..."
                                    disabled={!buttonEnabled}
                                  />
                                  {errors[`${photo.key}-notes`] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[`${photo.key}-notes`]}</p>
                                  )}
                                </>
                              ) : (
                                <div className="p-2 bg-gray-50 rounded min-h-[80px]">
                                  {photo.notes || 'N/A'}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {officePhotographs.length === 0 && productPhotographs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No photograph questions have been configured for your company.</p>
                  <p className="text-sm mt-2">Please contact your administrator to configure photograph questions.</p>
                </div>
              )}

              {(officePhotographs.length > 0 || productPhotographs.length > 0) && (
                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={() => handleSubmit(true)}
                    variant="outline"
                    disabled={isSubmitting || !buttonEnabled}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save as Draft'
                    )}
                  </Button>
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting || !buttonEnabled}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Verification Modal for Users */}
      <Dialog open={verificationModal} onOpenChange={setVerificationModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Verify Document</DialogTitle>
            <DialogDescription>
              Verify the document details before submission
            </DialogDescription>
          </DialogHeader>

          {currentFile && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{currentFile.question || "Document"}</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getS3FilePath(currentFile.file_path), '_blank')}
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
                    value={currentFile.issueDateInput || ""}
                    onChange={(e) => {
                      setCurrentFile({
                        ...currentFile,
                        issueDateInput: e.target.value
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={currentFile.expiryDateInput || ""}
                    onChange={(e) => {
                      setCurrentFile({
                        ...currentFile,
                        expiryDateInput: e.target.value
                      });
                    }}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm"
                  checked={currentFile.isUserVerified || false}
                  onCheckedChange={(checked) => {
                    setCurrentFile({
                      ...currentFile,
                      isUserVerified: checked as boolean
                    });
                  }}
                />
                <Label htmlFor="confirm" className="text-sm">
                  I confirm the information is correct
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerificationModal(false)} disabled={verificationLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleVerifyAndClose}
              disabled={
                verificationLoading ||
                !currentFile?.isUserVerified ||
                !currentFile?.expiryDateInput
              }
            >
              {verificationLoading ? "Verifying..." : "Verify Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IRLPhotographs;