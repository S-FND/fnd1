// IRLComplianceTable.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';
import {
  fetchBoData, updateBoData,
  fetchComplianceData, updateComplianceData,
  fetchManagementData, updateManagementData,
  fetchITSecurityData, updateITSecurityData,
  fetchGovernanceData,  updateGovernanceData,
  fetchFacilityData, updateFacilityData, deleteFile
} from '../../services/companyApi';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { logger } from '@/hooks/logger';

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
  type?: 'default' | 'it-security' | 'governance'; // Add more types as needed
}

interface IRLComplianceTableProps {
  title: string;
  description: string;
  items: Array<{ key: string; name: string }>;
  type?: 'default' | 'it-security' | 'governance'; // Add more types as needed
}

const IRLComplianceTable: React.FC<IRLComplianceTableProps> = ({
  title,
  description,
  items,
  type = 'default'
}) => {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(
    items.map((item, index) => ({
      id: index + 1,
      key: item.key,     // ✅ add key
      name: item.name,
      isApplicable: '',
      attachment: [],
      notes: '',
      type
    }))
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [filePaths, setFilePaths] = useState<Record<string, string[]>>({});

  const getS3FilePath = (file_path: string) =>
    `https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/${file_path}`;

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
  // Get the appropriate API functions based on the title
  const getAPIFunctions = () => {
    switch (title.toLowerCase()) {
      case 'business operations':
        return { fetch: fetchBoData, update: updateBoData };
      case 'compliance':
        return { fetch: fetchComplianceData, update: updateComplianceData };
      case 'management':
        return {
          fetch: fetchManagementData, update: updateManagementData
        };
      case 'it security & data privacy':
        return {
          fetch: fetchITSecurityData, update: updateITSecurityData
        };
      case 'governance':
      return { fetch: fetchGovernanceData, update: updateGovernanceData
       };
      case 'facility information':
        return {
          fetch: fetchFacilityData, update: updateFacilityData
        };
    }
  };

  
    const loadData = async () => {
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

        // Create map of known compliance keys for filtering
        const allowedKeys = new Set(complianceItems.map(item => item.key));

        // Only pick values for known keys
        const filteredResponse = Object.keys(response)
          .filter(key => allowedKeys.has(key))
          .reduce((obj, key) => {
            obj[key] = response[key];
            return obj;
          }, {});

          const updatedItems = complianceItems.map(item => {
            const key = item.key;
            const itemData = filteredResponse[key] || {};
          
            // Handle both old and new response formats
            const isApplicable = itemData.isApplicable || itemData.answer || '';
            const notes = itemData.reason || '';
            // Set existing file paths (handling both formats)
            const existingFiles = itemData.file_path || itemData.existing_files || [];
            if (existingFiles.length > 0) {
              setFilePaths(prev => ({
                ...prev,
                [key]: existingFiles.map(getS3FilePath)
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
        // console.error(`Error loading ${title} data:`, err);
        // setError(`Failed to load ${title} data`);
        // toast.error(`Failed to load ${title} data`);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    loadData();
  }, [entityId]);

  const buildPayload = (isDraft = false) => {
    const payload: any = {
      entityId,
      isDraft
    };

    complianceItems.forEach(item => {
      const key = item.key;
      if (TEXT_INPUT_KEYS.includes(key) || TEXTAREA_KEYS.includes(key)) {
        payload[key] = item.isApplicable;
      }else {
        payload[key] = {
          answer: item.isApplicable,
          reason: item.notes || '',
          file_path: [
            ...(filePaths[key]?.map(path => path.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/', '')) || []),
            ...item.attachment.map(file => file.name)
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
        // if (!item.status) {
        //   newErrors[key] = 'Please select a status';
        //   isValid = false;
        // } else
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
    // console.log('object',newErrors);
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
      const formData:any = new FormData();

      const payload = buildPayload(isDraft);
      formData.append('data', JSON.stringify(payload));

      complianceItems.forEach(item => {
        const key = item.key;

        if (item.attachment.length > 0) {
          item.attachment.forEach(file => {
            formData.append(`${key}_file`, file);
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
    if (!files) return;
    const newFiles = Array.from(files);
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

  const renderAttachmentCell = (item: ComplianceItem) => {
    const key = item.key;
    const error = errors[key];

    const shortenFileName = (name: string) => {
      if (name.length <= 20) return name;
      return `${name.substring(0, 5)}...${name.substring(name.length - 7)}`;
    };
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
            onChange={(e) => handleFileUpload(item.id, e.target.files)}
            className="hidden"
            id={`file-upload-${item.id}`}
          />
          <label
            htmlFor={`file-upload-${item.id}`}
            className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-md cursor-pointer hover:bg-gray-50 ${
              error?.includes('upload') ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </label>
        </div>

        {/* Existing file from server */}
        {filePaths[key]?.map((fileUrl, i) => (
          <div key={`existing-${i}`} className="flex items-center justify-between bg-gray-50 p-1 py-0.5 rounded text-sx">
            <div className="flex items-center gap-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate flex-1 underline text-blue-600 hover:text-blue-800"
              >
                View File
              </a>
              <button
                type="button"
                onClick={() => handleDeleteExistingFile(key, i, fileUrl)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Newly uploaded file */}
        {item.attachment.map((file, fileIndex) => (
          <div key={fileIndex} className="flex items-center justify-between bg-gray-50 p-1 py-0.5 rounded text-sx">
            <div className="flex items-center gap-2">
              <span 
              className="truncate flex-1" 
              title={file.name} // Full name on hover
            >
              {shortenFileName(file.name)}
            </span>
            <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              {file.name}
            </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(item.id, fileIndex)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
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
                    <tr key={item.id}>
                      <td className="whitespace-nowrap p-3 text-sm text-center text-gray-500">{idx + 1}</td>
                      <td className="p-3 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="p-3 text-sm text-gray-500">
                        {TEXT_INPUT_KEYS.includes(item.key) ? (
                          <Input
                            value={item.isApplicable}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            placeholder="Enter details"
                            className="w-full min-w p-2 border rounded-md"
                          />
                        ) : TEXTAREA_KEYS.includes(item.key) ? (
                          <Textarea
                            value={item.isApplicable}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            placeholder="Enter description..."
                            className="min-h-[80px]"
                          />
                        ) : (
                          <Select
                            value={item.isApplicable}
                            onValueChange={(value) => handleStatusChange(item.id, value)}
                          >
                            <SelectTrigger>
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
              <Button onClick={handleSave} variant="outline" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save as Draft'
                )}
              </Button>
              <Button onClick={handleFinalSubmit} disabled={isLoading} className="flex-1">
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
  );
};

export default IRLComplianceTable;