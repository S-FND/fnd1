
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ESGDDRequiredFields from './ESGDDRequiredFields';
import BasicCompanyFields from './BasicCompanyFields';
import { CompanyFormData } from './types';
import { AutosaveForm } from '@/components/portfolio/AutosaveForm';

const IRLCompanyInformation = () => {
  const [formData, setFormData] = useState<CompanyFormData>({
    legalEntityName: '',
    emailId: '',
    incorporationDate: '',
    companyName: '',
    contactNumber: '',
    paidUpCapital: '',
    currentTurnover: '',
    previousTurnover: '',
    parentCompany: '',
    productsServices: '',
    foundingTeam: '',
    totalBeneficiaries: '',
    litigationDetails: '',
    esgTeamMembers: '',
    facilitiesCompliance: '',
    labourCompliances: '',
    fireTraining: '',
    hrPoliciesTraining: '',
    mockDrills: '',
    employeeWellbeingHealthInsurance: '',
    employeeWellbeingAccidentInsurance: '',
    employeeWellbeingMaternityBenefits: '',
    employeeWellbeingPaternityBenefits: '',
    employeeWellbeingDayCare: '',
    employeeWellbeingLifeInsurance: '',
    retrenchmentDetails: '',
    gstNumber: '',
    assuranceProviderName: '',
    assuranceType: '',
    cinNumber: '',
    industry: '',
    registeredOfficeAddress: '',
    headOfficeAddress: '',
    website: '',
    financialYearReporting: '',
    businessActivitiesDescription: ''
  });

  const handleSave = () => {
    console.log('Saving form data:', { formData });
  };

  const handleSubmit = () => {
    console.log('Submitting form data:', { formData });
  };

  return (
    <AutosaveForm
      entityType="irl_company_information"
      defaultValues={formData}
      onSubmit={handleSubmit}
      debounceMs={2000}
    >
      {(form, autosave) => (
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Please provide comprehensive information about your company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ESGDDRequiredFields 
              formData={form.watch()} 
              setFormData={(newData) => {
                Object.keys(newData).forEach(key => {
                  form.setValue(key as any, newData[key as keyof typeof newData]);
                });
              }} 
            />
            
            <BasicCompanyFields 
              formData={form.watch()} 
              setFormData={(newData) => {
                Object.keys(newData).forEach(key => {
                  form.setValue(key as any, newData[key as keyof typeof newData]);
                });
              }} 
            />

            <div className="space-y-2">
              <Label htmlFor="totalBeneficiaries">11. Total Beneficiaries/Customer Base</Label>
              <Input
                id="totalBeneficiaries"
                {...form.register('totalBeneficiaries')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="litigationDetails">12. Provide details of litigation or financial penalties against Company/Board of Directors/Founders or KMPs, if any?</Label>
              <Textarea
                id="litigationDetails"
                {...form.register('litigationDetails')}
              />
            </div>

            {/* Keep existing form fields with form.register */}
            
            <div className="flex gap-4 pt-6">
              <Button onClick={handleSave} variant="outline" className="flex-1">
                Save as Draft
              </Button>
              <Button onClick={form.handleSubmit(handleSubmit)} className="flex-1">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </AutosaveForm>
  );
};

export default IRLCompanyInformation;
