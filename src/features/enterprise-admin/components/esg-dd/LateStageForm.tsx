
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FundingStage } from '../../types/esgDD';
import { fundingStagesDisplay } from '../../data/esgDD';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Upload, Plus, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LateStageFormProps {
  stage: FundingStage;
  onBack: () => void;
  onNext: () => void;
}

const LateStageForm: React.FC<LateStageFormProps> = ({ stage, onBack, onNext }) => {
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    registrationNumber: '',
    address: '',
    industry: '',
    country: 'India',
    state: '',
    employeeCount: '',
    facilities: [''],
    certifications: {
      iso9001: false,
      iso14001: false,
      iso45001: false,
      bCorp: false,
      fairTrade: false
    },
    hasDiversityPolicy: false,
    hasEnergyPolicy: false,
    hasWaterManagementPolicy: false,
    hasSupplierCode: false,
    materiality: [] as string[],
    description: ''
  });

  const stageName = fundingStagesDisplay[stage];
  
  const addFacility = () => {
    setCompanyInfo({
      ...companyInfo,
      facilities: [...companyInfo.facilities, '']
    });
  };

  const updateFacility = (index: number, value: string) => {
    const newFacilities = [...companyInfo.facilities];
    newFacilities[index] = value;
    setCompanyInfo({
      ...companyInfo,
      facilities: newFacilities
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Company Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input 
              id="company-name" 
              value={companyInfo.name} 
              onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="registration-number">Registration Number</Label>
            <Input 
              id="registration-number" 
              value={companyInfo.registrationNumber} 
              onChange={(e) => setCompanyInfo({...companyInfo, registrationNumber: e.target.value})}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Registered Address</Label>
            <Textarea 
              id="address" 
              value={companyInfo.address} 
              onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry/Sector</Label>
            <Input 
              id="industry" 
              value={companyInfo.industry} 
              onChange={(e) => setCompanyInfo({...companyInfo, industry: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employee-count">Number of Employees</Label>
            <Input 
              id="employee-count" 
              type="number"
              value={companyInfo.employeeCount} 
              onChange={(e) => setCompanyInfo({...companyInfo, employeeCount: e.target.value})}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Facilities/Locations</h3>
          <Button type="button" variant="outline" size="sm" onClick={addFacility}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        {companyInfo.facilities.map((facility, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`facility-${index}`}>Facility/Location {index + 1}</Label>
            <Input 
              id={`facility-${index}`} 
              value={facility} 
              onChange={(e) => updateFacility(index, e.target.value)}
              placeholder="Address, city, state, country"
            />
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Certifications & Standards</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="iso9001" 
              checked={companyInfo.certifications.iso9001} 
              onCheckedChange={(checked) => setCompanyInfo({
                ...companyInfo, 
                certifications: {
                  ...companyInfo.certifications,
                  iso9001: checked === true
                }
              })}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="iso9001">ISO 9001 (Quality Management)</Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="iso14001" 
              checked={companyInfo.certifications.iso14001} 
              onCheckedChange={(checked) => setCompanyInfo({
                ...companyInfo, 
                certifications: {
                  ...companyInfo.certifications,
                  iso14001: checked === true
                }
              })}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="iso14001">ISO 14001 (Environmental Management)</Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="iso45001" 
              checked={companyInfo.certifications.iso45001} 
              onCheckedChange={(checked) => setCompanyInfo({
                ...companyInfo, 
                certifications: {
                  ...companyInfo.certifications,
                  iso45001: checked === true
                }
              })}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="iso45001">ISO 45001 (Occupational H&S)</Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="bCorp" 
              checked={companyInfo.certifications.bCorp} 
              onCheckedChange={(checked) => setCompanyInfo({
                ...companyInfo, 
                certifications: {
                  ...companyInfo.certifications,
                  bCorp: checked === true
                }
              })}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="bCorp">B Corp Certification</Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">ESG Policies</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="diversity-policy" 
              checked={companyInfo.hasDiversityPolicy} 
              onCheckedChange={(checked) => setCompanyInfo({...companyInfo, hasDiversityPolicy: checked === true})}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="diversity-policy">Diversity & Inclusion Policy</Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="energy-policy" 
              checked={companyInfo.hasEnergyPolicy} 
              onCheckedChange={(checked) => setCompanyInfo({...companyInfo, hasEnergyPolicy: checked === true})}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="energy-policy">Energy & Climate Policy</Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="water-policy" 
              checked={companyInfo.hasWaterManagementPolicy} 
              onCheckedChange={(checked) => setCompanyInfo({...companyInfo, hasWaterManagementPolicy: checked === true})}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="water-policy">Water Management Policy</Label>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="supplier-code" 
              checked={companyInfo.hasSupplierCode} 
              onCheckedChange={(checked) => setCompanyInfo({...companyInfo, hasSupplierCode: checked === true})}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="supplier-code">Supplier Code of Conduct</Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Document Uploads</h3>
        <p className="text-sm text-muted-foreground">
          Please upload the following required documents for your ESG due diligence assessment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-muted/50 rounded-full p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">Environmental & OHS Permits</p>
              <Button variant="outline" size="sm">Upload Documents</Button>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-muted/50 rounded-full p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">HR & Labor Policies</p>
              <Button variant="outline" size="sm">Upload Documents</Button>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-muted/50 rounded-full p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">E&S Management System</p>
              <Button variant="outline" size="sm">Upload Documents</Button>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-muted/50 rounded-full p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">Grievance Records (if any)</p>
              <Button variant="outline" size="sm">Upload Documents</Button>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LateStageForm;
