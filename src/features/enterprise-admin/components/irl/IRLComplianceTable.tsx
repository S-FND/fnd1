
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ComplianceItem {
  id: number;
  name: string;
  status: string;
  attachment: File | null;
  notes: string;
}

interface IRLComplianceTableProps {
  title: string;
  description: string;
  items: string[];
}

const IRLComplianceTable: React.FC<IRLComplianceTableProps> = ({ title, description, items }) => {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(
    items.map((item, index) => ({
      id: index + 1,
      name: item,
      status: '',
      attachment: null,
      notes: ''
    }))
  );

  const handleStatusChange = (id: number, status: string) => {
    setComplianceItems(items => 
      items.map(item => item.id === id ? { ...item, status } : item)
    );
  };

  const handleAttachmentChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setComplianceItems(items => 
      items.map(item => item.id === id ? { ...item, attachment: file } : item)
    );
  };

  const handleNotesChange = (id: number, notes: string) => {
    setComplianceItems(items => 
      items.map(item => item.id === id ? { ...item, notes } : item)
    );
  };

  const handleSave = () => {
    console.log(`Saving ${title} data:`, complianceItems);
    // TODO: Implement save functionality
  };

  const handleSubmit = () => {
    console.log(`Submitting ${title} data:`, complianceItems);
    // TODO: Implement submit functionality
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left">S. No.</th>
                <th className="border border-gray-300 p-3 text-left">Documents & Records</th>
                <th className="border border-gray-300 p-3 text-center">Status (Yes/No)</th>
                <th className="border border-gray-300 p-3 text-center">Attachment</th>
                <th className="border border-gray-300 p-3 text-left">Company Notes (if any)</th>
              </tr>
            </thead>
            <tbody>
              {complianceItems.map((item, index) => (
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
                    <div className="space-y-2">
                      <Input
                        type="file"
                        onChange={(e) => handleAttachmentChange(item.id, e)}
                        className="text-sm"
                      />
                      {item.attachment && (
                        <p className="text-xs text-muted-foreground">
                          {item.attachment.name}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Textarea
                      value={item.notes}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
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

export default IRLComplianceTable;
