
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BusinessOperationItem {
  id: number;
  name: string;
  status: string;
  attachment: File | null;
  notes: string;
}

const IRLBusinessOperations = () => {
  const [operations, setOperations] = useState<BusinessOperationItem[]>([
    { id: 1, name: 'Corporate Deck', status: '', attachment: null, notes: '' },
    { id: 2, name: 'Product related deck', status: '', attachment: null, notes: '' }
  ]);

  const handleStatusChange = (id: number, status: string) => {
    setOperations(operations.map(op => 
      op.id === id ? { ...op, status } : op
    ));
  };

  const handleAttachmentChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setOperations(operations.map(op => 
      op.id === id ? { ...op, attachment: file } : op
    ));
  };

  const handleNotesChange = (id: number, notes: string) => {
    setOperations(operations.map(op => 
      op.id === id ? { ...op, notes } : op
    ));
  };

  const handleSave = () => {
    console.log('Saving business operations data:', operations);
    // TODO: Implement save functionality
  };

  const handleSubmit = () => {
    console.log('Submitting business operations data:', operations);
    // TODO: Implement submit functionality
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Operations</CardTitle>
        <CardDescription>
          Upload required business operation documents and provide status updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left">S. No.</th>
                <th className="border border-gray-300 p-3 text-left">Business Operation</th>
                <th className="border border-gray-300 p-3 text-center">Status (Yes/No)</th>
                <th className="border border-gray-300 p-3 text-center">Attachment</th>
                <th className="border border-gray-300 p-3 text-left">Company Notes (if any)</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((operation, index) => (
                <tr key={operation.id}>
                  <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-3 font-medium">{operation.name}</td>
                  <td className="border border-gray-300 p-3">
                    <Select 
                      value={operation.status} 
                      onValueChange={(value) => handleStatusChange(operation.id, value)}
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
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept=".ppt,.pptx,.pdf"
                        onChange={(e) => handleAttachmentChange(operation.id, e)}
                        className="text-sm"
                      />
                      {operation.attachment && (
                        <p className="text-xs text-muted-foreground">
                          {operation.attachment.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: PPT, PPTX, PDF
                      </p>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Textarea
                      value={operation.notes}
                      onChange={(e) => handleNotesChange(operation.id, e.target.value)}
                      placeholder="Enter notes..."
                      className="min-h-[80px]"
                    />
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

export default IRLBusinessOperations;
