
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const AdvancedIRLFacility = () => {
  const [formData, setFormData] = useState({
    plantLocations: '',
    facilitiesProvided: '',
    hasFireExtinguishers: false,
    hasSmokeDetectors: false,
    hasSprinklers: false,
    hasSiren: false,
    hasPublicAddressSystem: false,
    hasStorageWarehouse: false,
    warehouseOversight: '',
    nationalLocations: '',
    internationalLocations: '',
    exportsPercentage: '',
    customerTypes: ''
  });

  const handleSave = () => {
    console.log('Saving Advanced IRL Facility data:', formData);
  };

  const handleSubmit = () => {
    console.log('Submitting Advanced IRL Facility data:', formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced IRL - Facility Information</CardTitle>
        <CardDescription>
          Facility locations, fire safety infrastructure, and market information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Locations */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plantLocations">1. Locations of Plants/Operations/Offices</Label>
            <Textarea
              id="plantLocations"
              value={formData.plantLocations}
              onChange={(e) => setFormData({ ...formData, plantLocations: e.target.value })}
              placeholder="Provide the locations where plants and/or operations/offices of the entity are situated"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilitiesProvided">2. Facilities Provided by Property Owner</Label>
            <Textarea
              id="facilitiesProvided"
              value={formData.facilitiesProvided}
              onChange={(e) => setFormData({ ...formData, facilitiesProvided: e.target.value })}
              placeholder="List of facilities provided by the property owner in the entity's space (with the number of each facility)"
              rows={4}
            />
          </div>
        </div>

        {/* Fire Emergency Infrastructure */}
        <div className="border-l-4 border-red-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-red-700">3. Fire Emergency Infrastructure</h3>
          <p className="text-sm text-gray-600 mb-4">Do you have the following fire emergency infrastructure installed in the office space?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasFireExtinguishers"
                checked={formData.hasFireExtinguishers}
                onCheckedChange={(checked) => setFormData({ ...formData, hasFireExtinguishers: !!checked })}
              />
              <Label htmlFor="hasFireExtinguishers">Fire extinguishers</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSmokeDetectors"
                checked={formData.hasSmokeDetectors}
                onCheckedChange={(checked) => setFormData({ ...formData, hasSmokeDetectors: !!checked })}
              />
              <Label htmlFor="hasSmokeDetectors">Smoke detectors</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSprinklers"
                checked={formData.hasSprinklers}
                onCheckedChange={(checked) => setFormData({ ...formData, hasSprinklers: !!checked })}
              />
              <Label htmlFor="hasSprinklers">Sprinklers</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSiren"
                checked={formData.hasSiren}
                onCheckedChange={(checked) => setFormData({ ...formData, hasSiren: !!checked })}
              />
              <Label htmlFor="hasSiren">Siren</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPublicAddressSystem"
                checked={formData.hasPublicAddressSystem}
                onCheckedChange={(checked) => setFormData({ ...formData, hasPublicAddressSystem: !!checked })}
              />
              <Label htmlFor="hasPublicAddressSystem">Public Address system</Label>
            </div>
          </div>
        </div>

        {/* Storage/Warehouse */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasStorageWarehouse"
              checked={formData.hasStorageWarehouse}
              onCheckedChange={(checked) => setFormData({ ...formData, hasStorageWarehouse: !!checked })}
            />
            <Label htmlFor="hasStorageWarehouse">Any storage/warehouse facility?</Label>
          </div>
          
          {formData.hasStorageWarehouse && (
            <div className="space-y-2">
              <Label htmlFor="warehouseOversight">Oversight maintained on Warehouses and Distribution Centers (DCs)</Label>
              <Textarea
                id="warehouseOversight"
                value={formData.warehouseOversight}
                onChange={(e) => setFormData({ ...formData, warehouseOversight: e.target.value })}
                placeholder="Describe the oversight mechanisms for warehouses and DCs"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Markets Served */}
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">5. Markets Served by the Entity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationalLocations">Number of locations served - National (No. of States)</Label>
              <Input
                id="nationalLocations"
                type="number"
                value={formData.nationalLocations}
                onChange={(e) => setFormData({ ...formData, nationalLocations: e.target.value })}
                placeholder="Number of states"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="internationalLocations">Number of locations served - International (No. of Countries)</Label>
              <Input
                id="internationalLocations"
                type="number"
                value={formData.internationalLocations}
                onChange={(e) => setFormData({ ...formData, internationalLocations: e.target.value })}
                placeholder="Number of countries"
              />
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="exportsPercentage">Contribution of exports as percentage of total turnover</Label>
            <Input
              id="exportsPercentage"
              type="number"
              value={formData.exportsPercentage}
              onChange={(e) => setFormData({ ...formData, exportsPercentage: e.target.value })}
              placeholder="Percentage (%)"
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="customerTypes">Brief on the types of customers</Label>
            <Textarea
              id="customerTypes"
              value={formData.customerTypes}
              onChange={(e) => setFormData({ ...formData, customerTypes: e.target.value })}
              placeholder="Provide a brief description of the types of customers served"
              rows={3}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Facility Management Guidelines:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Ensure all fire safety equipment is regularly maintained and tested</li>
            <li>• Maintain proper documentation of all safety equipment and inspections</li>
            <li>• Conduct regular fire drills and emergency evacuation training</li>
            <li>• Keep emergency contact information readily available</li>
            <li>• Ensure proper signage for all emergency exits and safety equipment</li>
          </ul>
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

export default AdvancedIRLFacility;
