import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface OfficeSpace {
  location: string;
  type: string;
  address: string;
  geotagLocation: string;
  numberOfSeats: string;
}

interface OutsourcedService {
  agencyName: string;
  servicesDischarged: string;
  malePersons: string;
  femalePersons: string;
}

interface LocationDetails {
  locationType: string;
  warehouses: string;
  offices: string;
  distributionCenters: string;
  total: string;
}

const IRLCompanyInformation = () => {
  const [formData, setFormData] = useState({
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
    // New ESGDD fields
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

  const addOfficeSpace = () => {
    setOfficeSpaces([...officeSpaces, { location: '', type: '', address: '', geotagLocation: '', numberOfSeats: '' }]);
  };

  const removeOfficeSpace = (index: number) => {
    setOfficeSpaces(officeSpaces.filter((_, i) => i !== index));
  };

  const addOutsourcedService = () => {
    setOutsourcedServices([...outsourcedServices, { agencyName: '', servicesDischarged: '', malePersons: '', femalePersons: '' }]);
  };

  const removeOutsourcedService = (index: number) => {
    setOutsourcedServices(outsourcedServices.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Saving form data:', { formData, officeSpaces, outsourcedServices, locationDetails });
    // TODO: Implement save functionality
  };

  const handleSubmit = () => {
    console.log('Submitting form data:', { formData, officeSpaces, outsourcedServices, locationDetails });
    // TODO: Implement submit functionality
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
        {/* New ESGDD Required Fields */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="legalEntityName">1. Name of legal entity</Label>
            <Input
              id="legalEntityName"
              value={formData.legalEntityName}
              onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emailId">2. Email ID</Label>
            <Input
              id="emailId"
              type="email"
              value={formData.emailId}
              onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="incorporationDate">3. Month & Year of Incorporation</Label>
            <Input
              id="incorporationDate"
              type="month"
              value={formData.incorporationDate}
              onChange={(e) => setFormData({ ...formData, incorporationDate: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName">4. Name of company/brand</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactNumber">5. Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paidUpCapital">6. Paid Up Capital (Rs)</Label>
            <Input
              id="paidUpCapital"
              value={formData.paidUpCapital}
              onChange={(e) => setFormData({ ...formData, paidUpCapital: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentTurnover">7. Turnover - Current Year (Rs)</Label>
            <Input
              id="currentTurnover"
              value={formData.currentTurnover}
              onChange={(e) => setFormData({ ...formData, currentTurnover: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="previousTurnover">7. Turnover - Previous Year (Rs)</Label>
            <Input
              id="previousTurnover"
              value={formData.previousTurnover}
              onChange={(e) => setFormData({ ...formData, previousTurnover: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentCompany">8. Name of parent company/subsidiaries (if any)</Label>
          <Textarea
            id="parentCompany"
            value={formData.parentCompany}
            onChange={(e) => setFormData({ ...formData, parentCompany: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productsServices">9. List of products/services</Label>
          <Textarea
            id="productsServices"
            value={formData.productsServices}
            onChange={(e) => setFormData({ ...formData, productsServices: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="foundingTeam">10. About the founding team (Name, educational details, previous work experience)</Label>
          <Textarea
            id="foundingTeam"
            value={formData.foundingTeam}
            onChange={(e) => setFormData({ ...formData, foundingTeam: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <Label>11. Type of office space & no. of seats</Label>
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

        <div className="space-y-4">
          <Label>16. Any outsourced services through professional services agencies?</Label>
          {outsourcedServices.map((service, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Outsourced Service {index + 1}</h4>
                {outsourcedServices.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOutsourcedService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Name of Agency</Label>
                  <Input
                    value={service.agencyName}
                    onChange={(e) => {
                      const newServices = [...outsourcedServices];
                      newServices[index].agencyName = e.target.value;
                      setOutsourcedServices(newServices);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Services discharged</Label>
                  <Input
                    value={service.servicesDischarged}
                    onChange={(e) => {
                      const newServices = [...outsourcedServices];
                      newServices[index].servicesDischarged = e.target.value;
                      setOutsourcedServices(newServices);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Male Persons</Label>
                  <Input
                    type="number"
                    value={service.malePersons}
                    onChange={(e) => {
                      const newServices = [...outsourcedServices];
                      newServices[index].malePersons = e.target.value;
                      setOutsourcedServices(newServices);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Female Persons</Label>
                  <Input
                    type="number"
                    value={service.femalePersons}
                    onChange={(e) => {
                      const newServices = [...outsourcedServices];
                      newServices[index].femalePersons = e.target.value;
                      setOutsourcedServices(newServices);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addOutsourcedService} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Outsourced Service
          </Button>
        </div>

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
