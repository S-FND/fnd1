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
  fetchComplianceData, updateComplianceData,
  fetchManagementData, updateManagementData,
  fetchITSecurityData, updateITSecurityData,
  fetchGovernanceData,  updateGovernanceData,
  fetchFacilityData, updateFacilityData
} from '../../services/companyApi';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const TEXT_INPUT_KEYS = ['type_of_servers_used', 'cloud_servers_used', 'scope_data_stored_servers', 'name_of_contractors',
  'name_of_refrigerants',
  'supplier_code_of_conduct',
  'partner_selection_criteria_checklist'];
const TEXTAREA_KEYS = ['customer_data_security_privacy'];
interface ComplianceItem {
  id: number;
  name: string;
  key: string;
  status: string;
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
      status: '',
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
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const entityId = getUserEntityId();

  // Get the appropriate API functions based on the title
  const getAPIFunctions = () => {
    switch (title.toLowerCase()) {
      case 'compliance':
        return { fetch: fetchComplianceData, update: updateComplianceData };
      case 'management':
        return {
          fetch: fetchManagementData, update: updateManagementData
        };
      case 'it security':
        return {
          fetch: fetchITSecurityData, update: updateITSecurityData
        };
      case 'governance':
      return { fetch: fetchGovernanceData, update: updateGovernanceData
       };
      case 'additional (facility level)':
        return {
          fetch: fetchFacilityData, update: updateFacilityData
        };
      default:
        return { fetch: fetchComplianceData, update: updateComplianceData };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!entityId) {
        setError('Entity ID not found in localStorage');
        setIsLoading(false);
        return;
      }

      try {
        const { fetch } = getAPIFunctions();
        const response: any = await fetch(entityId);

        if (!response || response.status === false) {
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

          // Set existing file paths
          if (itemData.file_path?.length > 0) {
            setFilePaths(prev => ({
              ...prev,
              [key]: itemData.file_path.map(getS3FilePath)
            }));
          }

          if (TEXTAREA_KEYS.includes(key) || TEXT_INPUT_KEYS.includes(key)) {
            return {
              ...item,
              status: response[key] || '',
              notes: ''
            };
          }

          return {
            ...item,
            status: itemData.isApplicable || '',
            notes: itemData.reason || ''
          };
        });

        setComplianceItems(updatedItems);

      } catch (err) {
        console.error(`Error loading ${title} data:`, err);
        // setError(`Failed to load ${title} data`);
        toast.error(`Failed to load ${title} data`);
      } finally {
        setIsLoading(false);
      }
    };

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
        payload[key] = item.status;
      } else {
        payload[key] = {
          isApplicable: item.status,
          reason: item.notes || '',
          // Send both original and new file info
          existing_files: filePaths[key]?.map(path => {
            // Extract just the filename if server expects it
            return path.split('/').pop(); // or other transformation
          }) || [],
          new_files: item.attachment.map(file => file.name)
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
      if (TEXT_INPUT_KEYS.includes(key) || TEXTAREA_KEYS.includes(key)) {
        if (!item.status.trim()) {
          newErrors[key] = 'This field is required';
          isValid = false;
        }
      } else {
        if (!item.status) {
          newErrors[key] = 'Please select a status';
          isValid = false;
        } else if (item.status === 'yes') {
          // More robust file checking
          const hasExistingFiles = filePaths[key]?.some(path =>
            path && typeof path === 'string' && path.length > 0
          );
          const hasNewFiles = item.attachment.length > 0;

          if (!hasExistingFiles && !hasNewFiles) {
            newErrors[key] = 'File is required when Yes';
            isValid = false;
          }
        } else if (item.status === 'no' && !item.notes.trim()) {
          newErrors[key] = 'Reason is required when No';
          isValid = false;
        }
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

    setIsLoading(true);

    try {
      const formData = new FormData();

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

      // // Clear attachments and reset form state without reloading
      // setComplianceItems(prevItems =>
      //   prevItems.map(item => ({
      //     ...item,
      //     attachment: [],
      //     // Keep the status/notes as they were submitted
      //   }))
      // );

      // setFilePaths(prev => {
      //   // Update file paths for items that had attachments
      //   const newPaths = { ...prev };
      //   complianceItems.forEach(item => {
      //     if (item.attachment.length > 0) {
      //       // This assumes your backend updates file paths - adjust as needed
      //       newPaths[item.key] = item.attachment.map(file => URL.createObjectURL(file));
      //     }
      //   });
      //   return newPaths;
      // });
      toast.success(isDraft ? 'Draft saved successfully!' : 'Form submitted successfully!');
    } catch (err) {
      console.error('Submission failed:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => handleSubmit(true);
  const handleFinalSubmit = () => handleSubmit(false);

  const handleStatusChange = (id: number, status: string) => {
    setComplianceItems(items =>
      items.map(item => item.id === id ? { ...item, status } : item)
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

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
            onChange={(e) => handleFileUpload(item.id, e.target.files)}
            className="hidden"
            id={`file-upload-${item.id}`}
          />
          <label
            htmlFor={`file-upload-${item.id}`}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </label>
        </div>

        {/* Existing files from server */}
        {filePaths[key]?.map((fileUrl, i) => (
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
        {item.attachment.map((file, fileIndex) => (
          <div key={fileIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
            <span className="truncate flex-1">{file.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveFile(item.id, fileIndex)}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {error && error.includes('File') && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  };

  const renderITSecurityNotesCell = (item: ComplianceItem) => {
    const key = item.key;
    const error = errors[key];

    return (
      <Textarea
        value={item.notes}
        onChange={(e) => handleNotesChange(item.id, e.target.value)}
        placeholder="Enter notes..."
        className="min-h-[80px]"
      />
    );
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
          <p className="text-red-500 font-medium text-sm text-center bg-red-50 p-3 rounded-md">
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
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">
                      {type === 'it-security' ? 'Details' : 'Company Notes'}
                    </th>
                    {type === 'it-security' && (
                      <th className="p-3 text-left text-sm font-semibold text-gray-900">Supporting Documents</th>
                    )}
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
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            placeholder="Enter details"
                            className="w-full min-w-[300px] p-2 border rounded-md"
                          />
                        ) : TEXTAREA_KEYS.includes(item.key) ? (
                          <Textarea
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            placeholder="Enter description..."
                            className="min-h-[80px]"
                          />
                        ) : (
                          <Select
                            value={item.status}
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
                          <td className="p-3 text-sm text-gray-500">
                            {renderITSecurityNotesCell(item)}
                          </td>
                          {type === 'it-security' && (
                            <td className="whitespace-nowrap p-3 text-sm text-gray-500">
                              {renderAttachmentCell(item)}
                            </td>
                          )}
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 pt-6">
              <Button onClick={handleSave} variant="outline" disabled={isLoading} className="flex-1 bg-gray-100 hover:bg-gray-200">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save as Draft'
                )}
              </Button>
              <Button onClick={handleFinalSubmit} disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
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