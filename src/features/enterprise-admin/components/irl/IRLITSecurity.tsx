import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { useIRLData, IRLFile } from '@/hooks/useIRLData';
import { toast } from 'sonner';

interface ITSecurityItem {
  id: number;
  name: string;
  status: string;
  notes: string;
  uploadedFiles: IRLFile[];
}

const itSecurityQuestions = [
  "Data security and privacy certifications (if any)",
  "Policy and procedures on IT Security and data privacy of customers (if any)",
  "Document of IT security audit (if any)",
  "Privacy Policy (public link from the website)",
  "Terms & Conditions of the app (if any)",
  "Type of servers used? (Physical/ cloud)",
  "Name of cloud servers used? (if any)",
  "Scope of data stored in servers",
  "How is data security and privacy of customers ensured?"
];

const IRLITSecurity = () => {
  const { loadSectionAllData, saveSectionData, uploadMultipleFiles, deleteFile } = useIRLData();
  const [loading, setLoading] = useState(true);
  const [itSecurityItems, setITSecurityItems] = useState<ITSecurityItem[]>(
    itSecurityQuestions.map((question, index) => ({
      id: index + 1,
      name: question,
      status: '',
      notes: '',
      uploadedFiles: []
    }))
  );

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const sectionData = await loadSectionAllData('itsecurity');
      
      // Update the items with loaded data
      setITSecurityItems(prevItems => 
        prevItems.map(item => {
          const savedData = sectionData[`item-${item.id}`];
          if (savedData) {
            return {
              ...item,
              status: savedData.value?.status || '',
              notes: savedData.value?.notes || '',
              uploadedFiles: savedData.files || []
            };
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Error loading IT Security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    setITSecurityItems(items => 
      items.map(item => item.id === id ? { ...item, status } : item)
    );

    // Save to database immediately
    const item = itSecurityItems.find(item => item.id === id);
    if (item) {
      await saveSectionData('itsecurity', `item-${id}`, {
        status,
        notes: item.notes,
        name: item.name
      }, item.uploadedFiles);
    }
  };

  const handleNotesChange = async (id: number, notes: string) => {
    setITSecurityItems(items => 
      items.map(item => item.id === id ? { ...item, notes } : item)
    );

    // Save to database immediately
    const item = itSecurityItems.find(item => item.id === id);
    if (item) {
      await saveSectionData('itsecurity', `item-${id}`, {
        status: item.status,
        notes,
        name: item.name
      }, item.uploadedFiles);
    }
  };

  const handleFileUpload = async (id: number, files: FileList | null) => {
    if (!files) return;
    
    try {
      const uploadedFiles = await uploadMultipleFiles('itsecurity', `item-${id}`, files);
      
      setITSecurityItems(items => 
        items.map(item => 
          item.id === id 
            ? { ...item, uploadedFiles: [...item.uploadedFiles, ...uploadedFiles] }
            : item
        )
      );

      // Save to database
      const updatedItem = itSecurityItems.find(item => item.id === id);
      if (updatedItem) {
        await saveSectionData('itsecurity', `item-${id}`, {
          status: updatedItem.status,
          notes: updatedItem.notes,
          name: updatedItem.name
        }, [...updatedItem.uploadedFiles, ...uploadedFiles]);
      }

      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    }
  };

  const handleRemoveFile = async (id: number, fileIndex: number) => {
    const item = itSecurityItems.find(item => item.id === id);
    if (!item) return;

    const fileToRemove = item.uploadedFiles[fileIndex];
    
    try {
      // Delete from storage if it has a URL (meaning it was uploaded)
      if ('url' in fileToRemove) {
        await deleteFile(fileToRemove.url);
      }

      const updatedFiles = item.uploadedFiles.filter((_, index) => index !== fileIndex);
      
      setITSecurityItems(items => 
        items.map(item => 
          item.id === id 
            ? { ...item, uploadedFiles: updatedFiles }
            : item
        )
      );

      // Update database
      await saveSectionData('itsecurity', `item-${id}`, {
        status: item.status,
        notes: item.notes,
        name: item.name
      }, updatedFiles);

      toast.success('File removed successfully');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Failed to remove file');
    }
  };

  const handleSave = async () => {
    try {
      // Save all items
      for (const item of itSecurityItems) {
        await saveSectionData('itsecurity', `item-${item.id}`, {
          status: item.status,
          notes: item.notes,
          name: item.name
        }, item.uploadedFiles);
      }
      toast.success('IT Security data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    }
  };

  const handleSubmit = () => {
    console.log('Submitting IT Security data:', itSecurityItems);
    // TODO: Implement submit functionality
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>IT Security</CardTitle>
        <CardDescription>
          Provide information about IT security measures and data privacy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left">S. No.</th>
                <th className="border border-gray-300 p-3 text-left">IT Security</th>
                <th className="border border-gray-300 p-3 text-center">Status (Yes/No)</th>
                <th className="border border-gray-300 p-3 text-left">Company Notes (if any)</th>
                <th className="border border-gray-300 p-3 text-left">Supporting Documents</th>
              </tr>
            </thead>
            <tbody>
              {itSecurityItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-3">{item.name}</td>
                  <td className="border border-gray-300 p-3">
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
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Textarea
                      value={item.notes}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      placeholder="Enter notes..."
                      className="min-h-[80px]"
                    />
                  </td>
                  <td className="border border-gray-300 p-3">
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
                      
                      {item.uploadedFiles.length > 0 && (
                        <div className="space-y-1">
                          {item.uploadedFiles.map((file, fileIndex) => (
                            <div key={fileIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                              <span className="truncate flex-1">
                                {'name' in file ? file.name : (file as File).name}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(item.id, fileIndex)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 pt-6">
          <Button onClick={handleSave} variant="outline" className="flex-1">
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IRLITSecurity;