
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ESGDDRequiredFields from './ESGDDRequiredFields';
import BasicCompanyFields from './BasicCompanyFields';
import OutsourcedServicesSection from './OutsourcedServicesSection';
import { CompanyFormData, OutsourcedService } from './types';

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
    workingHours: '',
    shiftTiming: '',
    otHoursCurrent: '',
    otHoursPrevious: '',
    otPayCompensation: '',
    facilitiesList: '',
    productSafetyCertifications: '',
    emergencyIncidents: '',
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
    transportationDetails: '',
    youngWorkers: '',
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

  const [outsourcedServices, setOutsourcedServices] = useState<OutsourcedService[]>([
    { agencyName: '', servicesDischarged: '', malePersons: '', femalePersons: '' }
  ]);

  const handleSave = () => {
    console.log('Saving form data:', { formData, outsourcedServices });
  };

  const handleSubmit = () => {
    console.log('Submitting form data:', { formData, outsourcedServices });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Please provide comprehensive information about your company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ESGDDRequiredFields formData={formData} setFormData={setFormData} />
        
        <BasicCompanyFields formData={formData} setFormData={setFormData} />

        <div className="space-y-2">
          <Label htmlFor="totalBeneficiaries">11. Total Beneficiaries/Customer Base</Label>
          <Input
            id="totalBeneficiaries"
            value={formData.totalBeneficiaries}
            onChange={(e) => setFormData({ ...formData, totalBeneficiaries: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="litigationDetails">12. Provide details of litigation or financial penalties against Company/Board of Directors/Founders or KMPs, if any?</Label>
          <Textarea
            id="litigationDetails"
            value={formData.litigationDetails}
            onChange={(e) => setFormData({ ...formData, litigationDetails: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workingHours">13. Working hours for FTEs</Label>
          <Input
            id="workingHours"
            value={formData.workingHours}
            onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <Label>14. Shift timing for contract workers (if any)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shiftTiming">Shift timing</Label>
              <Input
                id="shiftTiming"
                value={formData.shiftTiming}
                onChange={(e) => setFormData({ ...formData, shiftTiming: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otHoursCurrent">Total OT hours - Current FY</Label>
              <Input
                id="otHoursCurrent"
                value={formData.otHoursCurrent}
                onChange={(e) => setFormData({ ...formData, otHoursCurrent: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otHoursPrevious">Total OT hours - Previous FY</Label>
              <Input
                id="otHoursPrevious"
                value={formData.otHoursPrevious}
                onChange={(e) => setFormData({ ...formData, otHoursPrevious: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otPayCompensation">Total OT Pay/Compensation</Label>
              <Input
                id="otPayCompensation"
                value={formData.otPayCompensation}
                onChange={(e) => setFormData({ ...formData, otPayCompensation: e.target.value })}
              />
            </div>
          </div>
        </div>

        <OutsourcedServicesSection 
          outsourcedServices={outsourcedServices} 
          setOutsourcedServices={setOutsourcedServices} 
        />

        <div className="space-y-2">
          <Label htmlFor="facilitiesList">16. List of major facilities/Units/Departments (Manufacturing, Laboratory, Cafeteria) provided by property owner in the office space (With number of each facility)</Label>
          <Textarea
            id="facilitiesList"
            value={formData.facilitiesList}
            onChange={(e) => setFormData({ ...formData, facilitiesList: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productSafetyCertifications">17. Certifications (if any) for product safety</Label>
          <Textarea
            id="productSafetyCertifications"
            value={formData.productSafetyCertifications}
            onChange={(e) => setFormData({ ...formData, productSafetyCertifications: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyIncidents">18. Have the employees (on-roll, contract) been involved in any emergency incidents or accidents occurred in the workplace or during work related activities?</Label>
          <Textarea
            id="emergencyIncidents"
            value={formData.emergencyIncidents}
            onChange={(e) => setFormData({ ...formData, emergencyIncidents: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <Label>19. Team members/designation assigned the following responsibilities on ESG management?</Label>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facilitiesCompliance">(a) Compliances related to facility management (e-waste, waste management, water management, batteries, fire infra, occupancy certificate, fire NOC)</Label>
              <Input
                id="facilitiesCompliance"
                value={formData.facilitiesCompliance}
                onChange={(e) => setFormData({ ...formData, facilitiesCompliance: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labourCompliances">(b) Labour compliances (on-roll, on-contract)</Label>
              <Input
                id="labourCompliances"
                value={formData.labourCompliances}
                onChange={(e) => setFormData({ ...formData, labourCompliances: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fireTraining">(c) Fire training</Label>
              <Input
                id="fireTraining"
                value={formData.fireTraining}
                onChange={(e) => setFormData({ ...formData, fireTraining: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hrPoliciesTraining">(d) Training on HR policies</Label>
              <Input
                id="hrPoliciesTraining"
                value={formData.hrPoliciesTraining}
                onChange={(e) => setFormData({ ...formData, hrPoliciesTraining: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mockDrills">(e) Mock drills</Label>
              <Input
                id="mockDrills"
                value={formData.mockDrills}
                onChange={(e) => setFormData({ ...formData, mockDrills: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>20. Details of measures for the well-being of employees (including differently abled): % of employees covered by</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthInsurance">Health insurance</Label>
              <Input
                id="healthInsurance"
                value={formData.employeeWellbeingHealthInsurance}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingHealthInsurance: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accidentInsurance">Accident insurance</Label>
              <Input
                id="accidentInsurance"
                value={formData.employeeWellbeingAccidentInsurance}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingAccidentInsurance: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maternityBenefits">Maternity benefits</Label>
              <Input
                id="maternityBenefits"
                value={formData.employeeWellbeingMaternityBenefits}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingMaternityBenefits: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paternityBenefits">Paternity Benefits</Label>
              <Input
                id="paternityBenefits"
                value={formData.employeeWellbeingPaternityBenefits}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingPaternityBenefits: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dayCare">Day Care facilities</Label>
              <Input
                id="dayCare"
                value={formData.employeeWellbeingDayCare}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingDayCare: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lifeInsurance">Life Insurance</Label>
              <Input
                id="lifeInsurance"
                value={formData.employeeWellbeingLifeInsurance}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingLifeInsurance: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="retrenchmentDetails">21. Any retrenchment or mass dismissal of employees conducted?</Label>
          <Textarea
            id="retrenchmentDetails"
            value={formData.retrenchmentDetails}
            onChange={(e) => setFormData({ ...formData, retrenchmentDetails: e.target.value })}
          />
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

export default IRLCompanyInformation;
