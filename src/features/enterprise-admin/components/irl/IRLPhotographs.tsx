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
  updateProductPhotographs
} from '../../services/companyApi';
import TableRowQuestion from './utils/TableRowQuestion';

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

const initialOfficePhotographs: OfficePhotograph[] = [
  {
    id: 1,
    description: 'Electrical main panel inside the office',
    status: '',
    attachment: [],
    file_path: [],
    key: 'electrical_main_panel',
    notes: ''
  },
  {
    id: 2,
    description: 'Pantry',
    status: '',
    attachment: [],
    file_path: [],
    key: 'pantry',
    notes: ''
  },
  {
    id: 3,
    description: 'Working areas occupied by the Company',
    status: '',
    attachment: [],
    file_path: [],
    key: 'working_areas_occupied',
    notes: ''
  },
  {
    id: 4,
    description: 'Emergency exits, emergency signages, warning signages',
    status: '',
    attachment: [],
    file_path: [],
    key: 'emergency_exits',
    notes: ''
  },
  {
    id: 5,
    description: 'General overall office pictures',
    status: '',
    attachment: [],
    file_path: [],
    key: 'overall_office_pictures',
    notes: ''
  },
  {
    id: 6,
    description: 'Fire extinguishers and smoke detectors locations',
    status: '',
    attachment: [],
    file_path: [],
    key: 'fire_extinguishers_within_office',
    notes: ''
  }
];

const initialProductPhotographs: ProductPhotograph[] = [
  {
    id: 1,
    description: 'Product labeling',
    status: '',
    attachment: [],
    file_path: [],
    key: 'product_labeling',
    notes: ''
  },
  {
    id: 2,
    description: 'Screenshot of the app',
    status: '',
    attachment: [],
    file_path: [],
    key: 'app_screenshot',
    notes: ''
  },
  {
    id: 3,
    description: 'Dashboard screenshot',
    status: '',
    attachment: [],
    file_path: [],
    key: 'dashboard_screenshot',
    notes: ''
  },
  {
    id: 4,
    description: 'Product packaging',
    status: '',
    attachment: [],
    file_path: [],
    key: 'product_packing',
    notes: ''
  }
];

const IRLPhotographs = () => {
  const [officePhotographs, setOfficePhotographs] = useState<OfficePhotograph[]>(initialOfficePhotographs);
  const [productPhotographs, setProductPhotographs] = useState<ProductPhotograph[]>(initialProductPhotographs);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getS3FilePath = (file_path: string) =>
    `https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/${file_path}`;

  const getUserEntityId = (): string | null => {
    try {
      const user = localStorage.getItem('fandoro-user');
      return user ? JSON.parse(user)?.entityId || null : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const entityId = getUserEntityId();

  const loadData = async () => {
    if (!entityId) {
      setError('Entity ID not found in localStorage');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [hoData, prodData] = await Promise.all([
        fetchHoPhotographs(entityId),
        fetchProductPhotographs(entityId)
      ]);

      // Process office photographs
      const updatedOfficePhotos = initialOfficePhotographs.map(photo => {
        const data = hoData[photo.key] || {};
        return {
          ...photo,
          status: data.isApplicable === undefined ? '' : data.isApplicable,
          // file_path: (data.file_path || []).map(getS3FilePath),
          file_path: Array.isArray(data.file_path)
            ? data.file_path.map(getS3FilePath)
            : data.file_path
              ? [getS3FilePath(data.file_path)]
              : [],
          notes: data.reason || ''
        };
      });

      // Process product photographs
      const updatedProductPhotos = initialProductPhotographs.map(photo => {
        const data = prodData[photo.key] || {};
        return {
          ...photo,
          status: data.isApplicable === undefined ? '' : data.isApplicable,
          // file_path: (data.file_path || []).map(getS3FilePath),
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
      // setError(null);
    } catch (err) {
      // console.error('Error loading photographs:', err);
      // setError('Failed to load photograph data');
      // toast.error('Failed to load photograph data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [entityId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
  
    // Validate office photographs
    officePhotographs.forEach(photo => {
      // Only validate if status is provided
      if (photo.status === 'yes') {
        if (photo.attachment?.length === 0 && photo.file_path?.length === 0) {
          newErrors[`${photo.key}-files`] = 'At least one attachment is required';
          isValid = false;
        }
      }
      else if (photo.status === 'no' && !photo.notes?.trim()) {
        newErrors[`${photo.key}-notes`] = 'Notes is required when status is No';
        isValid = false;
      }
    });
  
    // Validate product photographs
    productPhotographs.forEach(photo => {
      if (photo.status === 'yes' && photo.attachment?.length === 0 && photo.file_path?.length === 0) {
        newErrors[`${photo.key}-files`] = 'Attachment is required';
        isValid = false;
      }
      else if (photo.status === 'no' && !photo.notes?.trim()) {
        newErrors[`${photo.key}-notes`] = 'Reason is required when status is No';
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
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare office photos payload
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
            hoFormData.append(`${photo.key}_file`, file);
          });
        }
      });

      // Prepare product photos payload (unchanged)
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

      // Add product attachments to form data (unchanged)
      productPhotographs.forEach(photo => {
        if (photo.attachment?.length > 0) {
          photo.attachment.forEach(file => {
            prodFormData.append(`${photo.key}_file`, file);
          });
        }
      });

      // Submit both forms
      await Promise.all([
        updateHoPhotographs(hoFormData),
        updateProductPhotographs(prodFormData)
      ]);

      toast.success(isDraft ? 'Draft saved successfully!' : 'Photographs submitted successfully!');
      await loadData();
    } catch (err) {
      console.error('Submission error:', err);
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

  if (isLoading) {
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
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error ? (
          <p className="text-red-500 font-medium text-sm text-center bg-red-50 p-3 rounded-md">
            {error}
          </p>
        ) : (
          <>
            {/* Office Photographs */}
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
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Photographs */}
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
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                onClick={() => handleSubmit(true)}
                variant="outline"
                disabled={isSubmitting}
                className="flex-1 bg-gray-100 hover:bg-gray-200"
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
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IRLPhotographs;