import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  fetchHoPhotographs,
  updateHoPhotographs,
  fetchProductPhotographs,
  updateProductPhotographs
} from '../../services/companyApi';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface OfficePhotograph {
  id: number;
  description: string;
  status: string;
  officeAttachment: File[];
  warehouseAttachment: File[];
}

interface ProductPhotograph {
  id: number;
  description: string;
  status: string;
  attachment: File[];
}

const IRLPhotographs = () => {
  const [officePhotographs, setOfficePhotographs] = useState<OfficePhotograph[]>([
    { id: 1, description: 'Electrical main panel inside the office', status: '', officeAttachment: [], warehouseAttachment: [] },
    { id: 2, description: 'Pantry', status: '', officeAttachment: [], warehouseAttachment: [] },
    { id: 3, description: 'Working areas occupied by the Company', status: '', officeAttachment: [], warehouseAttachment: [] },
    { id: 4, description: 'Emergency exits, emergency signages, warning signages', status: '', officeAttachment: [], warehouseAttachment: [] },
    { id: 5, description: 'General overall office pictures', status: '', officeAttachment: [], warehouseAttachment: [] },
    { id: 6, description: 'Fire extinguishers and smoke detectors locations', status: '', officeAttachment: [], warehouseAttachment: [] }
  ]);

  const [productPhotographs, setProductPhotographs] = useState<ProductPhotograph[]>([
    { id: 1, description: 'Product labeling', status: '', attachment: [] },
    { id: 2, description: 'Screenshot of the app', status: '', attachment: [] },
    { id: 3, description: 'Dashboard screenshot', status: '', attachment: [] },
    { id: 4, description: 'Product packaging', status: '', attachment: [] }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filePaths, setFilePaths] = useState<{
    office: Record<string, { office: string[]; warehouse: string[] }>;
    product: Record<string, string[]>;
  }>({
    office: {},
    product: {}
  });

  const getS3FilePath = (file_path: string) =>
    `https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/${file_path}`;

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem('fandoro-user') || '{}');
        const entityId = user?.entityId;
    
        if (!entityId) throw new Error('Entity ID not found');
    
        const hoData: any = await fetchHoPhotographs(entityId);
        const prodData: any = await fetchProductPhotographs(entityId);
    
        // Map HO Photographs (Head Office)
        const hoPhotosMapped = officePhotographs.map(photo => {
          const key = photo.description.toLowerCase().replace(/[^a-z0-9]+/g, '_');
          const data = hoData[key] || {};
          
          // Store file paths for existing attachments
          if (data.file_path) {
            setFilePaths(prev => ({
              ...prev,
              office: {
                ...prev.office,
                [photo.description]: {
                  office: data.file_path?.map(getS3FilePath) || [],
                  warehouse: data.warehouse_file_path?.map(getS3FilePath) || []
                }
              }
            }));
          }
          
          return {
            ...photo,
            status: data.isApplicable || '',
            officeAttachment: [],
            warehouseAttachment: []
          };
        });
    
        // Map Product Photographs
        const prodPhotosMapped = productPhotographs.map(photo => {
          const key = photo.description.toLowerCase().replace(/[^a-z0-9]+/g, '_');
          const data = prodData[key] || {};
          
          // Store file paths for existing attachments
          if (data.file_path) {
            setFilePaths(prev => ({
              ...prev,
              product: {
                ...prev.product,
                [photo.description]: data.file_path.map(getS3FilePath)
              }
            }));
          }
          
          return {
            ...photo,
            status: data.isApplicable || '',
            attachment: []
          };
        });
    
        setOfficePhotographs(hoPhotosMapped);
        setProductPhotographs(prodPhotosMapped);
    
      } catch (err) {
        console.error('Failed to load photographs:', err);
        setError('Failed to load photograph data');
        toast.error('Failed to load photograph data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Render attachment cell for office photos
  const renderOfficeAttachmentCell = (photo: OfficePhotograph, type: 'office' | 'warehouse') => {
    const files = type === 'office' ? photo.officeAttachment : photo.warehouseAttachment;
    const existingFiles = filePaths.office[photo.description]?.[type] || [];
    const inputId = `file-upload-${photo.id}-${type}`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setOfficePhotographs(prev =>
          prev.map(p =>
            p.id === photo.id
              ? {
                  ...p,
                  [type === 'office' ? 'officeAttachment' : 'warehouseAttachment']: [
                    ...p[type === 'office' ? 'officeAttachment' : 'warehouseAttachment'],
                    ...newFiles
                  ]
                }
              : p
          )
        );
      }
    };

    const handleRemoveFile = (index: number) => {
      setOfficePhotographs(prev =>
        prev.map(p =>
          p.id === photo.id
            ? {
                ...p,
                [type === 'office' ? 'officeAttachment' : 'warehouseAttachment']:
                  p[type === 'office' ? 'officeAttachment' : 'warehouseAttachment'].filter((_, i) => i !== index)
              }
            : p
        )
      );
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </label>
        </div>

        {/* Existing files from server */}
        {existingFiles.map((fileUrl, i) => (
          <div key={`existing-${i}`} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate flex-1 underline text-blue-600 hover:text-blue-800"
            >
              View File {i + 1}
            </a>
          </div>
        ))}

        {/* Newly uploaded files */}
        {files.map((file, fileIndex) => (
          <div key={fileIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
            <span className="truncate flex-1">{file.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveFile(fileIndex)}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Render attachment cell for product photos
  const renderProductAttachmentCell = (photo: ProductPhotograph) => {
    const existingFiles = filePaths.product[photo.description] || [];
    const inputId = `file-upload-${photo.id}`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setProductPhotographs(prev =>
          prev.map(p =>
            p.id === photo.id
              ? { ...p, attachment: [...p.attachment, ...newFiles] }
              : p
          )
        );
      }
    };

    const handleRemoveFile = (index: number) => {
      setProductPhotographs(prev =>
        prev.map(p =>
          p.id === photo.id
            ? { ...p, attachment: p.attachment.filter((_, i) => i !== index) }
            : p
        )
      );
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </label>
        </div>

        {/* Existing files from server */}
        {existingFiles.map((fileUrl, i) => (
          <div key={`existing-${i}`} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate flex-1 underline text-blue-600 hover:text-blue-800"
            >
              View File {i + 1}
            </a>
          </div>
        ))}

        {/* Newly uploaded files */}
        {photo.attachment.map((file, fileIndex) => (
          <div key={fileIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
            <span className="truncate flex-1">{file.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveFile(fileIndex)}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Handlers for status changes
  const handleOfficeStatusChange = (id: number, status: string) => {
    setOfficePhotographs(prev =>
      prev.map(photo => (photo.id === id ? { ...photo, status } : photo))
    );
  };

  const handleProductStatusChange = (id: number, status: string) => {
    setProductPhotographs(prev =>
      prev.map(photo => (photo.id === id ? { ...photo, status } : photo))
    );
  };

  // Save as draft
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('fandoro-user') || '{}');
      const entityId = user?.entityId;

      if (!entityId) throw new Error('Entity ID not found');

      const hoFormData = new FormData();
      hoFormData.append('entityId', entityId);

      officePhotographs.forEach((photo, idx) => {
        hoFormData.append(`photographs[${idx}][description]`, photo.description);
        hoFormData.append(`photographs[${idx}][status]`, photo.status);
        photo.officeAttachment.forEach(file => {
          hoFormData.append(`photographs[${idx}][officeAttachment]`, file);
        });
        photo.warehouseAttachment.forEach(file => {
          hoFormData.append(`photographs[${idx}][warehouseAttachment]`, file);
        });
      });

      const prodFormData = new FormData();
      prodFormData.append('entityId', entityId);

      productPhotographs.forEach((photo, idx) => {
        prodFormData.append(`photographs[${idx}][description]`, photo.description);
        prodFormData.append(`photographs[${idx}][status]`, photo.status);
        photo.attachment.forEach(file => {
          prodFormData.append(`photographs[${idx}][attachment]`, file);
        });
      });

      await Promise.all([
        updateHoPhotographs(hoFormData),
        updateProductPhotographs(prodFormData)
      ]);
      toast.success('Draft saved successfully!');
    } catch (err) {
      console.error('Error saving photographs:', err);
      setError('Failed to save photographs');
      toast.error('Failed to save photographs');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit final form
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('fandoro-user') || '{}');
      const entityId = user?.entityId;

      if (!entityId) throw new Error('Entity ID not found in user data');

      const hoFormData = new FormData();
      hoFormData.append('entityId', entityId);

      officePhotographs.forEach((photo, idx) => {
        hoFormData.append(`photographs[${idx}][description]`, photo.description);
        hoFormData.append(`photographs[${idx}][status]`, photo.status);
        photo.officeAttachment.forEach(file => {
          hoFormData.append(`photographs[${idx}][officeAttachment]`, file, file.name);
        });
        photo.warehouseAttachment.forEach(file => {
          hoFormData.append(`photographs[${idx}][warehouseAttachment]`, file, file.name);
        });
      });

      const prodFormData = new FormData();
      prodFormData.append('entityId', entityId);

      productPhotographs.forEach((photo, idx) => {
        prodFormData.append(`photographs[${idx}][description]`, photo.description);
        prodFormData.append(`photographs[${idx}][status]`, photo.status);
        photo.attachment.forEach(file => {
          prodFormData.append(`photographs[${idx}][attachment]`, file, file.name);
        });
      });

      await Promise.all([updateHoPhotographs(hoFormData), updateProductPhotographs(prodFormData)]);
      toast.success('Photographs submitted successfully!');
    } catch (err) {
      console.error('Error submitting photographs:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit photographs');
      toast.error('Failed to submit photographs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photographs</CardTitle>
        <CardDescription>Upload required photographs for head office and products</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Head Office Photographs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Head Office Photographs</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left">S. No.</th>
                  <th className="border border-gray-300 p-3 text-left">Description</th>
                  <th className="border border-gray-300 p-3 text-center">Status (Yes/No)</th>
                  <th className="border border-gray-300 p-3 text-center">Office Attachment</th>
                  <th className="border border-gray-300 p-3 text-center">Warehouse Attachment</th>
                </tr>
              </thead>
              <tbody>
                {officePhotographs.map((photo, index) => (
                  <tr key={photo.id}>
                    <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-3">{photo.description}</td>
                    <td className="border border-gray-300 p-3">
                      <Select value={photo.status} onValueChange={(value) => handleOfficeStatusChange(photo.id, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="border border-gray-300 p-3">
                      {renderOfficeAttachmentCell(photo, 'office')}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {renderOfficeAttachmentCell(photo, 'warehouse')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Photographs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Photographs (as applicable)</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left">S. No.</th>
                  <th className="border border-gray-300 p-3 text-left">Description</th>
                  <th className="border border-gray-300 p-3 text-center">Status (Yes/No)</th>
                  <th className="border border-gray-300 p-3 text-center">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {productPhotographs.map((photo, index) => (
                  <tr key={photo.id}>
                    <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-3">{photo.description}</td>
                    <td className="border border-gray-300 p-3">
                      <Select value={photo.status} onValueChange={(value) => handleProductStatusChange(photo.id, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="border border-gray-300 p-3">
                      {renderProductAttachmentCell(photo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button onClick={handleSave} variant="outline" disabled={isLoading} className="flex-1">
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IRLPhotographs;