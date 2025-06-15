
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OfficePhotograph {
  id: number;
  description: string;
  status: string;
  officeAttachment: File | null;
  warehouseAttachment: File | null;
}

interface ProductPhotograph {
  id: number;
  description: string;
  status: string;
  attachment: File | null;
}

const IRLPhotographs = () => {
  const [officePhotographs, setOfficePhotographs] = useState<OfficePhotograph[]>([
    { id: 1, description: 'Electrical main panel inside the office (from some distance to be able to see the area around it)', status: '', officeAttachment: null, warehouseAttachment: null },
    { id: 2, description: 'Pantry', status: '', officeAttachment: null, warehouseAttachment: null },
    { id: 3, description: 'Working areas occupied by the Company', status: '', officeAttachment: null, warehouseAttachment: null },
    { id: 4, description: 'Emergency exits, emergency signages, warning signages', status: '', officeAttachment: null, warehouseAttachment: null },
    { id: 5, description: 'General overall office pictures', status: '', officeAttachment: null, warehouseAttachment: null },
    { id: 6, description: 'Locations where fire extinguishers, smoke detectors are present within office space', status: '', officeAttachment: null, warehouseAttachment: null }
  ]);

  const [productPhotographs, setProductPhotographs] = useState<ProductPhotograph[]>([
    { id: 1, description: 'Product labeling', status: '', attachment: null },
    { id: 2, description: 'Screenshot of the app', status: '', attachment: null },
    { id: 3, description: 'Screenshot of the dashboard', status: '', attachment: null },
    { id: 4, description: 'Product packaging', status: '', attachment: null }
  ]);

  const handleOfficeStatusChange = (id: number, status: string) => {
    setOfficePhotographs(photos => 
      photos.map(photo => photo.id === id ? { ...photo, status } : photo)
    );
  };

  const handleOfficeAttachmentChange = (id: number, type: 'office' | 'warehouse', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setOfficePhotographs(photos => 
      photos.map(photo => 
        photo.id === id 
          ? { ...photo, [type === 'office' ? 'officeAttachment' : 'warehouseAttachment']: file }
          : photo
      )
    );
  };

  const handleProductStatusChange = (id: number, status: string) => {
    setProductPhotographs(photos => 
      photos.map(photo => photo.id === id ? { ...photo, status } : photo)
    );
  };

  const handleProductAttachmentChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProductPhotographs(photos => 
      photos.map(photo => photo.id === id ? { ...photo, attachment: file } : photo)
    );
  };

  const handleSave = () => {
    console.log('Saving photographs data:', { officePhotographs, productPhotographs });
    // TODO: Implement save functionality
  };

  const handleSubmit = () => {
    console.log('Submitting photographs data:', { officePhotographs, productPhotographs });
    // TODO: Implement submit functionality
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photographs</CardTitle>
        <CardDescription>
          Upload required photographs for head office and products
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Office Photographs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Photographs (for head office)</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left">S. No.</th>
                  <th className="border border-gray-300 p-3 text-left">Photographs (for head office)</th>
                  <th className="border border-gray-300 p-3 text-center">Status (Yes/No)</th>
                  <th className="border border-gray-300 p-3 text-center">Attachment (Office)</th>
                  <th className="border border-gray-300 p-3 text-center">Attachment (Warehouse)</th>
                </tr>
              </thead>
              <tbody>
                {officePhotographs.map((photo, index) => (
                  <tr key={photo.id}>
                    <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-3">{photo.description}</td>
                    <td className="border border-gray-300 p-3">
                      <Select 
                        value={photo.status} 
                        onValueChange={(value) => handleOfficeStatusChange(photo.id, value)}
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
                          accept="image/*"
                          onChange={(e) => handleOfficeAttachmentChange(photo.id, 'office', e)}
                          className="text-sm"
                        />
                        {photo.officeAttachment && (
                          <p className="text-xs text-muted-foreground">
                            {photo.officeAttachment.name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleOfficeAttachmentChange(photo.id, 'warehouse', e)}
                          className="text-sm"
                        />
                        {photo.warehouseAttachment && (
                          <p className="text-xs text-muted-foreground">
                            {photo.warehouseAttachment.name}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Photographs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Photographs (Product) (as applicable)</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left">S. No.</th>
                  <th className="border border-gray-300 p-3 text-left">Photographs (Product) (as applicable)</th>
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
                      <Select 
                        value={photo.status} 
                        onValueChange={(value) => handleProductStatusChange(photo.id, value)}
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
                          accept="image/*"
                          onChange={(e) => handleProductAttachmentChange(photo.id, e)}
                          className="text-sm"
                        />
                        {photo.attachment && (
                          <p className="text-xs text-muted-foreground">
                            {photo.attachment.name}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default IRLPhotographs;
