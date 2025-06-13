
import React, { useState,useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { fetchfacilitiesData, updateCompanyData } from '../../services/companyApi';
interface WarehouseItem {
  id: number;
  name: string;
  plotArea: string;
  itemsStored: string;
  location: string;
  exclusiveSupplier: string;
}

const IRLWarehouse = () => {
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([
    { id: 1, name: '', plotArea: '', itemsStored: '', location: '', exclusiveSupplier: '' }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data: any = await fetchfacilitiesData();
        if (data) {
          console.log('_____________data______________',data);
        } else {
          console.error('Error fetching company data');
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
        setError('Failed to load company data');
        toast.error('Failed to load company data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addWarehouseRow = () => {
    const newId = Math.max(...warehouseItems.map(item => item.id)) + 1;
    setWarehouseItems([...warehouseItems, { 
      id: newId, 
      name: '', 
      plotArea: '', 
      itemsStored: '', 
      location: '', 
      exclusiveSupplier: '' 
    }]);
  };

  const removeWarehouseRow = (id: number) => {
    if (warehouseItems.length > 1) {
      setWarehouseItems(warehouseItems.filter(item => item.id !== id));
    }
  };

  const handleWarehouseChange = (id: number, field: keyof WarehouseItem, value: string) => {
    setWarehouseItems(items =>
      items.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const handleSave = () => {
    console.log('Saving warehouse data:', warehouseItems);
    // TODO: Implement save functionality
  };

  const handleSubmit = () => {
    console.log('Submitting warehouse data:', warehouseItems);
    // TODO: Implement submit functionality
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse</CardTitle>
        <CardDescription>
          Provide information about warehouse facilities and storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Warehouse Information</h3>
          <Button onClick={addWarehouseRow} size="sm">Add Row</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left">S. No.</th>
                <th className="border border-gray-300 p-3 text-left">Name and Plot area (sq.ft)</th>
                <th className="border border-gray-300 p-3 text-left">Items Stored</th>
                <th className="border border-gray-300 p-3 text-left">Location (City)</th>
                <th className="border border-gray-300 p-3 text-center">Whether exclusive supplier? (Yes/no)</th>
                <th className="border border-gray-300 p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouseItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-3">
                    <Input
                      value={item.plotArea}
                      onChange={(e) => handleWarehouseChange(item.id, 'plotArea', e.target.value)}
                      placeholder="Enter name and plot area"
                    />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input
                      value={item.itemsStored}
                      onChange={(e) => handleWarehouseChange(item.id, 'itemsStored', e.target.value)}
                      placeholder="Enter items stored"
                    />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Input
                      value={item.location}
                      onChange={(e) => handleWarehouseChange(item.id, 'location', e.target.value)}
                      placeholder="Enter city"
                    />
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Select 
                      value={item.exclusiveSupplier} 
                      onValueChange={(value) => handleWarehouseChange(item.id, 'exclusiveSupplier', value)}
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
                  <td className="border border-gray-300 p-3 text-center">
                    {warehouseItems.length > 1 && (
                      <Button 
                        onClick={() => removeWarehouseRow(item.id)} 
                        variant="destructive" 
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
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

export default IRLWarehouse;
