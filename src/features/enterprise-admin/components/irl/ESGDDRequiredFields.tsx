
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyFormData } from './types';

interface ESGDDRequiredFieldsProps {
  formData: CompanyFormData;
  setFormData: (data: CompanyFormData) => void;
}

const ESGDDRequiredFields: React.FC<ESGDDRequiredFieldsProps> = ({ formData, setFormData }) => {
  return (
    <div className="border-l-4 border-primary pl-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-primary">ESGDD Required Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gstNumber">GST Number</Label>
          <Input
            id="gstNumber"
            value={formData.gstNumber}
            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
            placeholder="Enter GST Number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cinNumber">CIN Number</Label>
          <Input
            id="cinNumber"
            value={formData.cinNumber}
            onChange={(e) => setFormData({ ...formData, cinNumber: e.target.value })}
            placeholder="Enter CIN Number"
            readOnly={!!formData.cinNumber}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="Enter Industry"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Company Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://www.example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assuranceProviderName">Name of Assurance Provider</Label>
          <Input
            id="assuranceProviderName"
            value={formData.assuranceProviderName}
            onChange={(e) => setFormData({ ...formData, assuranceProviderName: e.target.value })}
            placeholder="Enter Assurance Provider Name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assuranceType">Type of Assurance Obtained</Label>
          <Select
            value={formData.assuranceType}
            onValueChange={(value) => setFormData({ ...formData, assuranceType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assurance type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="limited">Limited Assurance</SelectItem>
              <SelectItem value="reasonable">Reasonable Assurance</SelectItem>
              <SelectItem value="none">No Assurance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="financialYearReporting">Financial Year for which reporting is being done</Label>
          <Input
            id="financialYearReporting"
            value={formData.financialYearReporting}
            onChange={(e) => setFormData({ ...formData, financialYearReporting: e.target.value })}
            placeholder="e.g., 2023-24"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="businessActivitiesDescription">Provide description of business activities (accounting for 90% of the turnover)</Label>
          <Textarea
            id="businessActivitiesDescription"
            value={formData.businessActivitiesDescription}
            onChange={(e) => setFormData({ ...formData, businessActivitiesDescription: e.target.value })}
            placeholder="Describe the main business activities that account for 90% of your turnover"
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registeredOfficeAddress">Registered Office Address</Label>
          <Textarea
            id="registeredOfficeAddress"
            value={formData.registeredOfficeAddress}
            onChange={(e) => setFormData({ ...formData, registeredOfficeAddress: e.target.value })}
            placeholder="Enter complete registered office address"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="headOfficeAddress">Head Office Address</Label>
          <Textarea
            id="headOfficeAddress"
            value={formData.headOfficeAddress}
            onChange={(e) => setFormData({ ...formData, headOfficeAddress: e.target.value })}
            placeholder="Enter complete head office address"
          />
        </div>
      </div>
    </div>
  );
};

export default ESGDDRequiredFields;
