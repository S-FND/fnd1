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
import { Loader2 } from 'lucide-react';
import {
  fetchHoPhotographs,
  updateHoPhotographs,
  fetchProductPhotographs,
  updateProductPhotographs,
  deleteFile
} from '../../services/companyApi';
import TableRowQuestion from './utils/TableRowQuestion';
import { logger } from '@/hooks/logger';
import { httpClient } from '@/lib/httpClient'; // Add this import

interface OfficePhotograph {
  id: number;
  description: string;
  status: string;
  attachment: File[];
  file_path: string[];
  key: string;
  notes?: string;
}

interface ProductPhotograph {
  id: number;
  description: string;
  status: string;
  attachment: File[];
  file_path: string[];
  key: string;
  notes?: string;
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
  const [configLoading, setConfigLoading] = useState(true); // Add config loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [enabledQuestions, setEnabledQuestions] = useState<string[]>([]); // Store enabled question keys

  const getS3FilePath = (file_path: string) =>
    `https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/${file_path}`;

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

  // Check if a question is enabled
  const isQuestionEnabled = (questionKey: string) => {
    // If no configuration loaded yet, show all questions
    if (configLoading) return true;
    
    // If enabledQuestions is empty (means no config or all disabled), show all
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
          
          // Initialize filtered office and product photographs
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
  }, []);

  const loadData = async () => {
    if (!entityId) {
      setError('Please complete your company profile in the Administration section before submitting IRL details.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Only fetch data if there are enabled questions
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

      // Process office photographs - only for enabled questions
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
          notes: data.reason || ''
        };
      });

      // Process product photographs - only for enabled questions
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
          notes: data.reason || ''
        };
      });

      setOfficePhotographs(updatedOfficePhotos);
      setProductPhotographs(updatedProductPhotos);
    } catch (err) {
      // Error handling remains the same
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!configLoading && (officePhotographs.length > 0 || productPhotographs.length > 0)) {
      loadData();
    }
  }, [entityId, configLoading]);

  const handleDeleteOfficeFile = async (photoId: number, fileIndex: number, fileUrl: string) => {
    try {
      setIsSubmitting(true);
      const filePath = fileUrl.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/', '');
      
      const payload = {
        filesToDelete: [filePath]
      };
  
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
  
      toast.success('File deleted successfully');
    } catch (err) {
      logger.error('Error deleting file:', err);
      toast.error('Failed to delete file');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteProductFile = async (photoId: number, fileIndex: number, fileUrl: string) => {
    try {
      setIsSubmitting(true);
      const filePath = fileUrl.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/', '');
      
      const payload = {
        filesToDelete: [filePath]
      };
  
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
  
      toast.success('File deleted successfully');
    } catch (err) {
      logger.error('Error deleting file:', err);
      toast.error('Failed to delete file');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
  
    // Validate office photographs - only enabled ones
    officePhotographs.forEach(photo => {
      // Only validate if status is provided
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
  
    // Validate product photographs - only enabled ones
    productPhotographs.forEach(photo => {
      if (photo.status === 'yes' && photo.attachment?.length === 0 && photo.file_path?.length === 0) {
        newErrors[`${photo.key}-files`] = 'Please upload the document.';
        isValid = false;
      }
      else if (photo.status === 'no' && !photo.notes?.trim()) {
        newErrors[`${photo.key}-notes`] = 'Please provide the reason.';
        isValid = false;
      }
    });
  
    setErrors(newErrors);
    return isValid;
  };

  // Helper function to sanitize file names
  const sanitizeFileName = (fileName) => {
    if (!fileName || typeof fileName !== 'string') {
      return fileName || '';
    }
    
    // Split by last dot to preserve extension
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
      // No extension or just a dot at end
      return fileName
        .replace(/\./g, '_')
        .replace(/\s+/g, '_');
    }
    
    // Split name and extension
    const namePart = fileName.substring(0, lastDotIndex);
    const extension = fileName.substring(lastDotIndex);
    
    // Sanitize name part (convert dots/spaces to underscores)
    const sanitizedBaseName = namePart
      .replace(/\./g, '_')  // Convert dots in name to underscores
      .replace(/\s+/g, '_'); // Convert spaces to underscores
    
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
      // Prepare office photos payload - only for enabled questions
      const hoPayload = {
        entityId,
        isDraft,
      };

      officePhotographs.forEach(photo => {
        hoPayload[photo.key] = {
          answer: photo.status,
          reason: photo.status === 'no' ? photo.notes : '',
          file_path: photo.file_path.map(path =>
            path.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/', '')
          ),
          fileChange: photo.attachment?.length > 0
        };
      });

      const hoFormData = new FormData();
      hoFormData.append('data', JSON.stringify(hoPayload));

      // Add office attachments to form data
      officePhotographs.forEach(photo => {
        if (photo.attachment?.length > 0) {
          photo.attachment.forEach(file => {
            const sanitizedFileName = sanitizeFileName(file.name);
            hoFormData.append(`${photo.key}_file`, file, sanitizedFileName);
          });
        }
      });

      // Prepare product photos payload - only for enabled questions
      const prodPayload: Record<string, any> = {
        entityId,
        isDraft
      };

      productPhotographs.forEach(photo => {
        prodPayload[photo.key] = {
          answer: photo.status,
          reason: photo.status === 'no' ? photo.notes : '',
          file_path: photo.file_path.map(path =>
            path.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/', '')
          ),
          fileChange: photo.attachment?.length > 0
        };
      });

      const prodFormData = new FormData();
      prodFormData.append('data', JSON.stringify(prodPayload));

      // Add product attachments to form data
      productPhotographs.forEach(photo => {
        if (photo.attachment?.length > 0) {
          photo.attachment.forEach(file => {
            const sanitizedFileName = sanitizeFileName(file.name);
            prodFormData.append(`${photo.key}_file`, file, sanitizedFileName);
          });
        }
      });

      // Submit forms only if there are questions in each category
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
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Photographs</CardTitle>
        <CardDescription>
          Upload required photographs for office and products
          {!configLoading && enabledQuestions.length > 0 && (
            <div className="text-sm text-green-600 mt-1">
              Showing {enabledQuestions.length} of {allPhotographQuestions.length} configured questions
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error ? (
          <p className="text-blue-500 font-medium text-sm text-center bg-blue-50 p-3 rounded-md">
            {error}
          </p>
        ) : (
          <>
            {/* Office Photographs - Only show if there are enabled office questions */}
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
                        <TableRowQuestion
                          key={photo.id}
                          op={{
                            ...photo,
                            name: photo.description,
                            attachment: photo.attachment
                          }}
                          index={index}
                          fieldError={
                            errors[`${photo.key}-status`] ||
                            errors[`${photo.key}-files`] ||
                            errors[`${photo.key}-notes`]
                          }
                          selectedValues={{
                            [photo.key]: {
                              answer: photo.status || '',
                              reason: photo.notes,
                              file: photo.attachment,
                              file_path: photo.file_path
                            }
                          }}
                          setSelectedValues={(updater) => {
                            const newValue = updater({
                              [photo.key]: {
                                answer: photo.status || '',
                                reason: photo.notes,
                                file: photo.attachment,
                                file_path: photo.file_path
                              }
                            });
                            handleOfficePhotographChange(photo.id, 'status', newValue[photo.key].answer);
                            handleOfficePhotographChange(photo.id, 'notes', newValue[photo.key].reason);
                            handleOfficePhotographChange(photo.id, 'attachment', newValue[photo.key].file);
                          }}
                          errors={errors}
                          setErrors={setErrors}
                          operationNameToKeyMap={{ [photo.description]: photo.key }}
                          existingFiles={photo.file_path}
                          setOperations={() => { }}
                          onDeleteFile={(fileIndex, fileUrl) => handleDeleteOfficeFile(photo.id, fileIndex, fileUrl)}
                          buttonEnabled={buttonEnabled}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Product Photographs - Only show if there are enabled product questions */}
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
                        <TableRowQuestion
                          key={photo.id}
                          op={{
                            ...photo,
                            name: photo.description,
                            attachment: photo.attachment
                          }}
                          index={index}
                          fieldError={errors[`${photo.key}-status`] ||
                            errors[`${photo.key}-files`] ||
                            errors[`${photo.key}-notes`]}
                          selectedValues={{
                            [photo.key]: {
                              answer: photo.status,
                              reason: photo.notes,
                              file: photo.attachment,
                              file_path: photo.file_path
                            }
                          }}
                          setSelectedValues={(updater) => {
                            const newValue = updater({
                              [photo.key]: {
                                answer: photo.status || '',
                                reason: photo.notes,
                                file: photo.attachment,
                                file_path: photo.file_path
                              }
                            });
                            handleProductPhotographChange(photo.id, 'status', newValue[photo.key].answer);
                            handleProductPhotographChange(photo.id, 'notes', newValue[photo.key].reason);
                            handleProductPhotographChange(photo.id, 'attachment', newValue[photo.key].file);
                          }}
                          errors={errors}
                          setErrors={setErrors}
                          operationNameToKeyMap={{ [photo.description]: photo.key }}
                          existingFiles={photo.file_path}
                          setOperations={() => { }}
                          onDeleteFile={(fileIndex, fileUrl) => handleDeleteProductFile(photo.id, fileIndex, fileUrl)}
                          buttonEnabled={buttonEnabled}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Show message if no questions are configured */}
            {officePhotographs.length === 0 && productPhotographs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No photograph questions have been configured for your company.</p>
                <p className="text-sm mt-2">Please contact your administrator to configure photograph questions.</p>
              </div>
            )}

            {/* Action Buttons - Only show if there are questions */}
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
  );
};

export default IRLPhotographs;