
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ESGDDRequiredFields from './ESGDDRequiredFields';
import BasicCompanyFields from './BasicCompanyFields';
import OfficeSpaceSection from './OfficeSpaceSection';
import OutsourcedServicesSection from './OutsourcedServicesSection';
import { CompanyFormData, OfficeSpace, OutsourcedService, LocationDetails } from './types';

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

  const [officeSpaces, setOfficeSpaces] = useState<OfficeSpace[]>([
    { location: '', type: '', address: '', geotagLocation: '', numberOfSeats: '' }
  ]);

  const [outsourcedServices, setOutsourcedServices] = useState<OutsourcedService[]>([
    { agencyName: '', servicesDischarged: '', malePersons: '', femalePersons: '' }
  ]);

  const [locationDetails, setLocationDetails] = useState<LocationDetails[]>([
    { locationType: 'National', warehouses: '', offices: '', distributionCenters: '', total: '' },
    { locationType: 'International', warehouses: '', offices: '', distributionCenters: '', total: '' }
  ]);

  const handleSave = () => {
    console.log('Saving form data:', { formData, officeSpaces, outsourcedServices, locationDetails });
  };

  const handleSubmit = () => {
    console.log('Submitting form data:', { formData, officeSpaces, outsourcedServices, locationDetails });
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

        <OfficeSpaceSection officeSpaces={officeSpaces} setOfficeSpaces={setOfficeSpaces} />

        <div className="space-y-2">
          <Label htmlFor="totalBeneficiaries">12. Total Beneficiaries/Customer Base</Label>
          <Input
            id="totalBeneficiaries"
            value={formData.totalBeneficiaries}
            onChange={(e) => setFormData({ ...formData, totalBeneficiaries: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="litigationDetails">13. Provide details of litigation or financial penalties against Company/Board of Directors/Founders or KMPs, if any?</Label>
          <Textarea
            id="litigationDetails"
            value={formData.litigationDetails}
            onChange={(e) => setFormData({ ...formData, litigationDetails: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workingHours">14. Working hours for FTEs</Label>
          <Input
            id="workingHours"
            value={formData.workingHours}
            onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <Label>15. Shift timing for contract workers (if any)</Label>
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
          <Label htmlFor="facilitiesList">17. List of major facilities/Units/Departments (Manufacturing, Laboratory, Cafeteria) provided by property owner in the office space (With number of each facility)</Label>
          <Textarea
            id="facilitiesList"
            value={formData.facilitiesList}
            onChange={(e) => setFormData({ ...formData, facilitiesList: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productSafetyCertifications">18. Certifications (if any) for product safety</Label>
          <Textarea
            id="productSafetyCertifications"
            value={formData.productSafetyCertifications}
            onChange={(e) => setFormData({ ...formData, productSafetyCertifications: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyIncidents">19. Have the employees (on-roll, contract) been involved in any emergency incidents or accidents occurred in the workplace or during work related activities?</Label>
          <Textarea
            id="emergencyIncidents"
            value={formData.emergencyIncidents}
            onChange={(e) => setFormData({ ...formData, emergencyIncidents: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <Label>20. Team members/designation assigned the following responsibilities on ESG management?</Label>
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
          <Label>21. Number of locations where plants (in case of manufacturing businesses) and/or operations/offices (in case of non-manufacturing) of the Company are situated:</Label>
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

        <div className="space-y-4">
          <Label>22. Details of measures for the well-being of employees (including differently abled): % of employees covered by</Label>
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
          <Label htmlFor="transportationDetails">23. Does the company organise transportation of raw materials and/or finished goods. If yes, are any vehicles owned. If yes, please provide details</Label>
          <Textarea
            id="transportationDetails"
            value={formData.transportationDetails}
            onChange={(e) => setFormData({ ...formData, transportationDetails: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="youngWorkers">24. Are any workers between the age of 14 - 18 years employed at the facility?</Label>
          <Textarea
            id="youngWorkers"
            value={formData.youngWorkers}
            onChange={(e) => setFormData({ ...formData, youngWorkers: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="retrenchmentDetails">25. Any retrenchment or mass dismissal of employees conducted?</Label>
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
