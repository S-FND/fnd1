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
import { Loader2 } from 'lucide-react';
import { fetchBoData, updateBoData } from '../../services/companyApi';
import TableRowQuestion from './utils/TableRowQuestion';

interface BusinessOperationItem {
  id: number;
  name: string;
  status: string;
  attachment: File[];
  notes: string;
}

const operationNameToKeyMap = {
  'Corporate Deck': 'corporate_deck',
  'Product related deck': 'product_deck'
};

const IRLBusinessOperations = () => {
  const [operations, setOperations] = useState<BusinessOperationItem[]>([
    { id: 1, name: "Corporate Deck", status: "", attachment: [], notes: "" },
    { id: 2, name: "Product related deck", status: "", attachment: [], notes: "" }
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [filePaths, setFilePaths] = useState<{
    corporate_deck: string[];
    product_deck: string[];
  }>({
    corporate_deck: [],
    product_deck: []
  });

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

  const loadData = async () => {
    if (!entityId) {
      setError('Entity ID not found in localStorage');
      setIsLoading(false);
      return;
    }
    try {
      const response: any = await fetchBoData(entityId);
      const updatedOps = operations.map(op => {
        const key = operationNameToKeyMap[op.name];
        const boData = response[key] || {};
        return {
          ...op,
          status: boData.isApplicable || '',
          notes: boData.reason || ''
        };
      });
      setFilePaths({
        corporate_deck: (response.corporate_deck?.file_path || []).map(getS3FilePath),
        product_deck: (response.product_deck?.file_path || []).map(getS3FilePath)
      });
      setOperations(updatedOps);
    } catch (err) {
      console.error('Error loading business operations:', err);
      setError('Failed to load business operations');
      toast.error('Failed to load business operations');
    } finally {
      setIsLoading(false);
    }
  };

  // Now useEffect can just call loadData()
  useEffect(() => {
    loadData();
  }, [entityId]);

  const buildPayload = () => {
    const payload: any = {
      entityId
    };

    operations.forEach(op => {
      const key = operationNameToKeyMap[op.name];
      payload[key] = {
        answer: op.status,
        reason: op.status === 'no' ? op.notes : '',
        file_path: (filePaths[key as keyof typeof filePaths] || [])
          .map(path => path.replace('https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/',  '')),
        fileChange: !!op.attachment
      };
    });

    return payload;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    operations.forEach(op => {
      const key = operationNameToKeyMap[op.name];
      const field = mergedSelectedValues[key];;

      if (!field?.answer) {
        console.log('field',field);
        newErrors[key] = 'Please select a status';
        isValid = false;
      } else if (field.answer === 'yes' && !field.file?.length && !filePaths[key].length) {
        newErrors[key] = 'File is required when Yes';
        isValid = false;
      } else if (field.answer === 'no' && !field.reason?.trim()) {
        newErrors[key] = 'Reason is required when No';
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
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);
    try {
      const formData : any = new FormData();
      const payload = buildPayload();
      formData.append('data', JSON.stringify(payload));

      operations.forEach(op => {
        const key = operationNameToKeyMap[op.name];
        const field = selectedValues[key];
        if (field?.file?.length > 0) {
          field.file.forEach(file => {
            formData.append(`${key}_file`, file);
          });
        }
      });

      await updateBoData(formData);
      await loadData();
      toast.success(isDraft ? 'Draft saved successfully!' : 'Form submitted successfully!');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    handleSubmit(true); // Save as draft
  };

  const handleFinalSubmit = () => {
    handleSubmit(false); // Submit form
  };

  // State for dynamic question rendering
  const [selectedValues, setSelectedValues] = useState({
    corporate_deck: {
      answer: "",
      reason: "",
      file: null,
      fileChange: false,
      file_path: []
    },
    product_deck: {
      answer: "",
      reason: "",
      file: null,
      fileChange: false,
      file_path: []
    }
  });

  const mergedSelectedValues = {
    corporate_deck: {
      answer: operations[0]?.status || selectedValues.corporate_deck.answer,
      reason: operations[0]?.notes || selectedValues.corporate_deck.reason,
      file: selectedValues.corporate_deck.file,
      file_path: filePaths.corporate_deck
    },
    product_deck: {
      answer: operations[1]?.status || selectedValues.product_deck.answer,
      reason: operations[1]?.notes || selectedValues.product_deck.reason,
      file: selectedValues.product_deck.file,
      file_path: filePaths.product_deck
    }
  };
console.log('mergedSelectedValues',mergedSelectedValues);
  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Business Operations</CardTitle>
        <CardDescription>
          Upload required business operation documents and provide status updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2">Loading business operations data...</span>
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
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Business Operation</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Attachment</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-900">Company Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {operations.map((op, idx) => {
                    const key = operationNameToKeyMap[op.name];
                    const fieldError = errors[key];
                    const currentFiles = filePaths[key as keyof typeof filePaths] || [];

                    return (
                      <TableRowQuestion
                        key={op.id}
                        op={op}
                        index={idx}
                        fieldError={fieldError}
                        selectedValues={mergedSelectedValues}
                        setSelectedValues={setSelectedValues}
                        errors={errors}
                        setErrors={setErrors}
                        operationNameToKeyMap={operationNameToKeyMap}
                        existingFiles={currentFiles}
                        setOperations={setOperations}
                      />
                    );
                  })}
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

export default IRLBusinessOperations;