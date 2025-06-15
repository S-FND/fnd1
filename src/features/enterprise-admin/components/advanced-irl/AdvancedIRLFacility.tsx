
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface OfficeSpace {
  location: string;
  type: string;
  address: string;
  geotagLocation: string;
  numberOfSeats: string;
}

interface LocationDetails {
  locationType: string;
  warehouses: string;
  offices: string;
  distributionCenters: string;
  total: string;
}

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
    customerTypes: '',
    transportationDetails: '',
    youngWorkers: ''
  });

  const [officeSpaces, setOfficeSpaces] = useState<OfficeSpace[]>([
    { location: '', type: '', address: '', geotagLocation: '', numberOfSeats: '' }
  ]);

  const [locationDetails, setLocationDetails] = useState<LocationDetails[]>([
    { locationType: 'National', warehouses: '', offices: '', distributionCenters: '', total: '' },
    { locationType: 'International', warehouses: '', offices: '', distributionCenters: '', total: '' }
  ]);

  const addOfficeSpace = () => {
    setOfficeSpaces([...officeSpaces, { location: '', type: '', address: '', geotagLocation: '', numberOfSeats: '' }]);
  };

  const removeOfficeSpace = (index: number) => {
    setOfficeSpaces(officeSpaces.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Saving Advanced IRL Facility data:', { formData, officeSpaces, locationDetails });
  };

  const handleSubmit = () => {
    console.log('Submitting Advanced IRL Facility data:', { formData, officeSpaces, locationDetails });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced IRL - Facility Information</CardTitle>
        <CardDescription>
          Office spaces, facility locations, fire safety infrastructure, and operational information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question 1: Type of office space & no. of seats (moved from Company) */}
        <div className="space-y-4">
          <Label>1. Type of office space & no. of seats</Label>
          {officeSpaces.map((space, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Office Space {index + 1}</h4>
                {officeSpaces.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOfficeSpace(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={space.location}
                    onChange={(e) => {
                      const newSpaces = [...officeSpaces];
                      newSpaces[index].location = e.target.value;
                      setOfficeSpaces(newSpaces);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={space.type}
                    onValueChange={(value) => {
                      const newSpaces = [...officeSpaces];
                      newSpaces[index].type = value;
                      setOfficeSpaces(newSpaces);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coworking">Coworking</SelectItem>
                      <SelectItem value="leased">Leased</SelectItem>
                      <SelectItem value="wfh">Work From Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={space.address}
                    onChange={(e) => {
                      const newSpaces = [...officeSpaces];
                      newSpaces[index].address = e.target.value;
                      setOfficeSpaces(newSpaces);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Geotag Location</Label>
                  <Input
                    value={space.geotagLocation}
                    onChange={(e) => {
                      const newSpaces = [...officeSpaces];
                      newSpaces[index].geotagLocation = e.target.value;
                      setOfficeSpaces(newSpaces);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. of seats (NA if WFH)</Label>
                  <Input
                    value={space.numberOfSeats}
                    onChange={(e) => {
                      const newSpaces = [...officeSpaces];
                      newSpaces[index].numberOfSeats = e.target.value;
                      setOfficeSpaces(newSpaces);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addOfficeSpace} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Office Space
          </Button>
        </div>

        {/* Question 2: Number of locations (moved from Company) */}
        <div className="space-y-4">
          <Label>2. Number of locations where plants (in case of manufacturing businesses) and/or operations/offices (in case of non-manufacturing) of the Company are situated:</Label>
          {locationDetails.map((location, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">{location.locationType}</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Number of Warehouses</Label>
                  <Input
                    type="number"
                    value={location.warehouses}
                    onChange={(e) => {
                      const newLocations = [...locationDetails];
                      newLocations[index].warehouses = e.target.value;
                      setLocationDetails(newLocations);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of offices</Label>
                  <Input
                    type="number"
                    value={location.offices}
                    onChange={(e) => {
                      const newLocations = [...locationDetails];
                      newLocations[index].offices = e.target.value;
                      setLocationDetails(newLocations);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of DCs</Label>
                  <Input
                    type="number"
                    value={location.distributionCenters}
                    onChange={(e) => {
                      const newLocations = [...locationDetails];
                      newLocations[index].distributionCenters = e.target.value;
                      setLocationDetails(newLocations);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input
                    type="number"
                    value={location.total}
                    onChange={(e) => {
                      const newLocations = [...locationDetails];
                      newLocations[index].total = e.target.value;
                      setLocationDetails(newLocations);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Question 3: Transportation details (moved from Company) */}
        <div className="space-y-2">
          <Label htmlFor="transportationDetails">3. Does the company organise transportation of raw materials and/or finished goods. If yes, are any vehicles owned. If yes, please provide details</Label>
          <Textarea
            id="transportationDetails"
            value={formData.transportationDetails}
            onChange={(e) => setFormData({ ...formData, transportationDetails: e.target.value })}
            placeholder="Provide details about transportation arrangements and vehicle ownership"
            rows={3}
          />
        </div>

        {/* Question 4: Young workers (moved from Company) */}
        <div className="space-y-2">
          <Label htmlFor="youngWorkers">4. Are any workers between the age of 14 - 18 years employed at the facility?</Label>
          <Textarea
            id="youngWorkers"
            value={formData.youngWorkers}
            onChange={(e) => setFormData({ ...formData, youngWorkers: e.target.value })}
            placeholder="Provide details about young workers if any"
            rows={2}
          />
        </div>

        {/* Question 5: Locations */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plantLocations">5. Locations of Plants/Operations/Offices</Label>
            <Textarea
              id="plantLocations"
              value={formData.plantLocations}
              onChange={(e) => setFormData({ ...formData, plantLocations: e.target.value })}
              placeholder="Provide the locations where plants and/or operations/offices of the entity are situated"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilitiesProvided">6. Facilities Provided by Property Owner</Label>
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
          <h3 className="text-lg font-semibold mb-4 text-red-700">7. Fire Emergency Infrastructure</h3>
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
            <Label htmlFor="hasStorageWarehouse">8. Any storage/warehouse facility?</Label>
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
          <h3 className="text-lg font-semibold mb-4 text-blue-700">9. Markets Served by the Entity</h3>
          
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
