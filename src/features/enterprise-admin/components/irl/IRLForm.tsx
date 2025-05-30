
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Send } from 'lucide-react';
import { IRLFormData } from '../../types/irl';
import { useToast } from '@/hooks/use-toast';

const IRLForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<IRLFormData>({
    legalEntityName: '',
    emailId: '',
    incorporationMonth: '',
    incorporationYear: '',
    companyBrandName: '',
    contactNumber: '',
    paidUpCapital: '',
    currentYearTurnover: '',
    previousYearTurnover: '',
    parentCompanySubsidiaries: '',
    productsServices: [''],
    foundingTeam: [{ name: '', education: '', workExperience: '' }],
    officeSpaces: [{ location: '', type: 'Coworking', address: '', geotagLocation: '', numberOfSeats: '' }],
    totalBeneficiaries: '',
    litigationDetails: '',
    workingHoursFTE: '',
    shiftTimingContractWorkers: '',
    totalOTHoursCurrent: '',
    totalOTHoursPrevious: '',
    totalOTPayCurrent: '',
    totalOTPayPrevious: '',
    outsourcedServices: [{ agencyName: '', servicesProvided: '', malePersons: '', femalePersons: '' }],
    facilitiesDetails: '',
    productSafetyCertifications: '',
    emergencyIncidents: '',
    esgManagement: {
      facilityManagement: '',
      labourCompliances: '',
      fireTraining: '',
      hrPoliciesTraining: '',
      mockDrills: ''
    },
    nationalWarehouses: '',
    nationalOffices: '',
    nationalDCs: '',
    internationalWarehouses: '',
    internationalOffices: '',
    internationalDCs: '',
    wellbeingMeasures: {
      healthInsurance: '',
      accidentInsurance: '',
      maternityBenefits: '',
      paternityBenefits: '',
      dayCareFacilities: '',
      lifeInsurance: ''
    },
    transportationDetails: '',
    youngWorkersDetails: '',
    retrenchmentDetails: '',
    status: 'draft'
  });

  const handleSave = () => {
    setFormData({ ...formData, status: 'draft', updatedAt: new Date().toISOString() });
    toast({
      title: "Form Saved",
      description: "Your IRL form has been saved as draft.",
    });
  };

  const handleSubmit = () => {
    setFormData({ ...formData, status: 'submitted', updatedAt: new Date().toISOString() });
    toast({
      title: "Form Submitted",
      description: "Your IRL form has been submitted successfully.",
    });
  };

  const addArrayItem = (field: string, defaultItem: any) => {
    setFormData({
      ...formData,
      [field]: [...(formData as any)[field], defaultItem]
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData({
      ...formData,
      [field]: (formData as any)[field].filter((_: any, i: number) => i !== index)
    });
  };

  const updateArrayItem = (field: string, index: number, updates: any) => {
    const newArray = [...(formData as any)[field]];
    newArray[index] = { ...newArray[index], ...updates };
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">IRL (In Real Life) Information</h1>
          <p className="text-muted-foreground">Complete company information for ESG due diligence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="team">Team & Office</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="legalEntityName">1. Name of legal entity</Label>
                  <Input
                    id="legalEntityName"
                    value={formData.legalEntityName}
                    onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="emailId">2. Email ID</Label>
                  <Input
                    id="emailId"
                    type="email"
                    value={formData.emailId}
                    onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="incorporationMonth">3. Month of Incorporation</Label>
                  <Select value={formData.incorporationMonth} onValueChange={(value) => setFormData({ ...formData, incorporationMonth: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="incorporationYear">Year of Incorporation</Label>
                  <Input
                    id="incorporationYear"
                    type="number"
                    value={formData.incorporationYear}
                    onChange={(e) => setFormData({ ...formData, incorporationYear: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="companyBrandName">4. Name of company/brand</Label>
                  <Input
                    id="companyBrandName"
                    value={formData.companyBrandName}
                    onChange={(e) => setFormData({ ...formData, companyBrandName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactNumber">5. Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="paidUpCapital">6. Paid Up Capital (Rs)</Label>
                  <Input
                    id="paidUpCapital"
                    value={formData.paidUpCapital}
                    onChange={(e) => setFormData({ ...formData, paidUpCapital: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="currentYearTurnover">7. Current Year Turnover</Label>
                  <Input
                    id="currentYearTurnover"
                    value={formData.currentYearTurnover}
                    onChange={(e) => setFormData({ ...formData, currentYearTurnover: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="previousYearTurnover">Previous Year Turnover</Label>
                  <Input
                    id="previousYearTurnover"
                    value={formData.previousYearTurnover}
                    onChange={(e) => setFormData({ ...formData, previousYearTurnover: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="parentCompanySubsidiaries">8. Name of parent company/subsidiaries (if any)</Label>
                <Textarea
                  id="parentCompanySubsidiaries"
                  value={formData.parentCompanySubsidiaries}
                  onChange={(e) => setFormData({ ...formData, parentCompanySubsidiaries: e.target.value })}
                />
              </div>

              <div>
                <Label>9. List of products/services</Label>
                {formData.productsServices.map((service, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={service}
                      onChange={(e) => {
                        const newServices = [...formData.productsServices];
                        newServices[index] = e.target.value;
                        setFormData({ ...formData, productsServices: newServices });
                      }}
                      placeholder="Enter product/service"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('productsServices', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('productsServices', '')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product/Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team & Office Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>10. Founding Team Details</Label>
                {formData.foundingTeam.map((member, index) => (
                  <div key={index} className="border p-4 rounded-lg mt-2 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => updateArrayItem('foundingTeam', index, { name: e.target.value })}
                      />
                      <Input
                        placeholder="Educational details"
                        value={member.education}
                        onChange={(e) => updateArrayItem('foundingTeam', index, { education: e.target.value })}
                      />
                      <Input
                        placeholder="Previous work experience"
                        value={member.workExperience}
                        onChange={(e) => updateArrayItem('foundingTeam', index, { workExperience: e.target.value })}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('foundingTeam', index)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('foundingTeam', { name: '', education: '', workExperience: '' })}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>

              <div>
                <Label>11. Office Space Details</Label>
                {formData.officeSpaces.map((office, index) => (
                  <div key={index} className="border p-4 rounded-lg mt-2 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Location"
                        value={office.location}
                        onChange={(e) => updateArrayItem('officeSpaces', index, { location: e.target.value })}
                      />
                      <Select
                        value={office.type}
                        onValueChange={(value) => updateArrayItem('officeSpaces', index, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Coworking">Coworking</SelectItem>
                          <SelectItem value="Leased">Leased</SelectItem>
                          <SelectItem value="WFH">WFH</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Address"
                        value={office.address}
                        onChange={(e) => updateArrayItem('officeSpaces', index, { address: e.target.value })}
                      />
                      <Input
                        placeholder="Geotag location"
                        value={office.geotagLocation}
                        onChange={(e) => updateArrayItem('officeSpaces', index, { geotagLocation: e.target.value })}
                      />
                      <Input
                        placeholder="Number of seats (NA if WFH)"
                        value={office.numberOfSeats}
                        onChange={(e) => updateArrayItem('officeSpaces', index, { numberOfSeats: e.target.value })}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('officeSpaces', index)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('officeSpaces', { location: '', type: 'Coworking', address: '', geotagLocation: '', numberOfSeats: '' })}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Office Space
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card>
            <CardHeader>
              <CardTitle>Operations Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="totalBeneficiaries">12. Total Beneficiaries/Customer Base</Label>
                <Input
                  id="totalBeneficiaries"
                  value={formData.totalBeneficiaries}
                  onChange={(e) => setFormData({ ...formData, totalBeneficiaries: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="litigationDetails">13. Litigation or financial penalties details</Label>
                <Textarea
                  id="litigationDetails"
                  value={formData.litigationDetails}
                  onChange={(e) => setFormData({ ...formData, litigationDetails: e.target.value })}
                  placeholder="Provide details of litigation or financial penalties against Company/Board of Directors/Founders or KMPs, if any"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workingHoursFTE">14. Working hours for FTEs</Label>
                  <Input
                    id="workingHoursFTE"
                    value={formData.workingHoursFTE}
                    onChange={(e) => setFormData({ ...formData, workingHoursFTE: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shiftTimingContractWorkers">15. Shift timing for contract workers</Label>
                  <Input
                    id="shiftTimingContractWorkers"
                    value={formData.shiftTimingContractWorkers}
                    onChange={(e) => setFormData({ ...formData, shiftTimingContractWorkers: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="totalOTHoursCurrent">Total OT hours (Current FY)</Label>
                  <Input
                    id="totalOTHoursCurrent"
                    value={formData.totalOTHoursCurrent}
                    onChange={(e) => setFormData({ ...formData, totalOTHoursCurrent: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="totalOTHoursPrevious">Total OT hours (Previous FY)</Label>
                  <Input
                    id="totalOTHoursPrevious"
                    value={formData.totalOTHoursPrevious}
                    onChange={(e) => setFormData({ ...formData, totalOTHoursPrevious: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="totalOTPayCurrent">Total OT Pay (Current FY)</Label>
                  <Input
                    id="totalOTPayCurrent"
                    value={formData.totalOTPayCurrent}
                    onChange={(e) => setFormData({ ...formData, totalOTPayCurrent: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="totalOTPayPrevious">Total OT Pay (Previous FY)</Label>
                  <Input
                    id="totalOTPayPrevious"
                    value={formData.totalOTPayPrevious}
                    onChange={(e) => setFormData({ ...formData, totalOTPayPrevious: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>16. Outsourced Services</Label>
                {formData.outsourcedServices.map((service, index) => (
                  <div key={index} className="border p-4 rounded-lg mt-2 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Name of Agency"
                        value={service.agencyName}
                        onChange={(e) => updateArrayItem('outsourcedServices', index, { agencyName: e.target.value })}
                      />
                      <Input
                        placeholder="Services discharged"
                        value={service.servicesProvided}
                        onChange={(e) => updateArrayItem('outsourcedServices', index, { servicesProvided: e.target.value })}
                      />
                      <Input
                        placeholder="No. of Male Persons"
                        value={service.malePersons}
                        onChange={(e) => updateArrayItem('outsourcedServices', index, { malePersons: e.target.value })}
                      />
                      <Input
                        placeholder="No. of Female Persons"
                        value={service.femalePersons}
                        onChange={(e) => updateArrayItem('outsourcedServices', index, { femalePersons: e.target.value })}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('outsourcedServices', index)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('outsourcedServices', { agencyName: '', servicesProvided: '', malePersons: '', femalePersons: '' })}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Outsourced Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Safety Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facilitiesDetails">17. Major facilities/Units/Departments details</Label>
                <Textarea
                  id="facilitiesDetails"
                  value={formData.facilitiesDetails}
                  onChange={(e) => setFormData({ ...formData, facilitiesDetails: e.target.value })}
                  placeholder="List major facilities (Manufacturing, Laboratory, Cafeteria) with number of each facility"
                />
              </div>

              <div>
                <Label htmlFor="productSafetyCertifications">18. Certifications for product safety</Label>
                <Textarea
                  id="productSafetyCertifications"
                  value={formData.productSafetyCertifications}
                  onChange={(e) => setFormData({ ...formData, productSafetyCertifications: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="emergencyIncidents">19. Emergency incidents or accidents</Label>
                <Textarea
                  id="emergencyIncidents"
                  value={formData.emergencyIncidents}
                  onChange={(e) => setFormData({ ...formData, emergencyIncidents: e.target.value })}
                  placeholder="Have employees been involved in any emergency incidents or accidents?"
                />
              </div>

              <div>
                <Label>20. ESG Management Team Responsibilities</Label>
                <div className="space-y-2 mt-2">
                  <div>
                    <Label htmlFor="facilityManagement">Facility Management Compliances</Label>
                    <Input
                      id="facilityManagement"
                      value={formData.esgManagement.facilityManagement}
                      onChange={(e) => setFormData({
                        ...formData,
                        esgManagement: { ...formData.esgManagement, facilityManagement: e.target.value }
                      })}
                      placeholder="Team member/designation for facility management"
                    />
                  </div>
                  <div>
                    <Label htmlFor="labourCompliances">Labour Compliances</Label>
                    <Input
                      id="labourCompliances"
                      value={formData.esgManagement.labourCompliances}
                      onChange={(e) => setFormData({
                        ...formData,
                        esgManagement: { ...formData.esgManagement, labourCompliances: e.target.value }
                      })}
                      placeholder="Team member/designation for labour compliances"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fireTraining">Fire Training</Label>
                    <Input
                      id="fireTraining"
                      value={formData.esgManagement.fireTraining}
                      onChange={(e) => setFormData({
                        ...formData,
                        esgManagement: { ...formData.esgManagement, fireTraining: e.target.value }
                      })}
                      placeholder="Team member/designation for fire training"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hrPoliciesTraining">HR Policies Training</Label>
                    <Input
                      id="hrPoliciesTraining"
                      value={formData.esgManagement.hrPoliciesTraining}
                      onChange={(e) => setFormData({
                        ...formData,
                        esgManagement: { ...formData.esgManagement, hrPoliciesTraining: e.target.value }
                      })}
                      placeholder="Team member/designation for HR policies training"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mockDrills">Mock Drills</Label>
                    <Input
                      id="mockDrills"
                      value={formData.esgManagement.mockDrills}
                      onChange={(e) => setFormData({
                        ...formData,
                        esgManagement: { ...formData.esgManagement, mockDrills: e.target.value }
                      })}
                      placeholder="Team member/designation for mock drills"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Locations & Transportation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>21. Number of locations</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">National</h4>
                    <div>
                      <Label htmlFor="nationalWarehouses">Number of Warehouses</Label>
                      <Input
                        id="nationalWarehouses"
                        value={formData.nationalWarehouses}
                        onChange={(e) => setFormData({ ...formData, nationalWarehouses: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationalOffices">Number of Offices</Label>
                      <Input
                        id="nationalOffices"
                        value={formData.nationalOffices}
                        onChange={(e) => setFormData({ ...formData, nationalOffices: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationalDCs">Number of DCs</Label>
                      <Input
                        id="nationalDCs"
                        value={formData.nationalDCs}
                        onChange={(e) => setFormData({ ...formData, nationalDCs: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">International</h4>
                    <div>
                      <Label htmlFor="internationalWarehouses">Number of Warehouses</Label>
                      <Input
                        id="internationalWarehouses"
                        value={formData.internationalWarehouses}
                        onChange={(e) => setFormData({ ...formData, internationalWarehouses: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="internationalOffices">Number of Offices</Label>
                      <Input
                        id="internationalOffices"
                        value={formData.internationalOffices}
                        onChange={(e) => setFormData({ ...formData, internationalOffices: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="internationalDCs">Number of DCs</Label>
                      <Input
                        id="internationalDCs"
                        value={formData.internationalDCs}
                        onChange={(e) => setFormData({ ...formData, internationalDCs: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="transportationDetails">23. Transportation details</Label>
                <Textarea
                  id="transportationDetails"
                  value={formData.transportationDetails}
                  onChange={(e) => setFormData({ ...formData, transportationDetails: e.target.value })}
                  placeholder="Does the company organise transportation of raw materials and/or finished goods. If yes, vehicle ownership details."
                />
              </div>

              <div>
                <Label htmlFor="youngWorkersDetails">24. Workers between 14-18 years</Label>
                <Textarea
                  id="youngWorkersDetails"
                  value={formData.youngWorkersDetails}
                  onChange={(e) => setFormData({ ...formData, youngWorkersDetails: e.target.value })}
                  placeholder="Are any workers between the age of 14-18 years employed at the facility?"
                />
              </div>

              <div>
                <Label htmlFor="retrenchmentDetails">25. Retrenchment or mass dismissal</Label>
                <Textarea
                  id="retrenchmentDetails"
                  value={formData.retrenchmentDetails}
                  onChange={(e) => setFormData({ ...formData, retrenchmentDetails: e.target.value })}
                  placeholder="Any retrenchment or mass dismissal of employees conducted?"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Employee Well-being Measures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>22. Employee well-being measures (% of employees covered)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="healthInsurance">Health Insurance</Label>
                    <Input
                      id="healthInsurance"
                      value={formData.wellbeingMeasures.healthInsurance}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellbeingMeasures: { ...formData.wellbeingMeasures, healthInsurance: e.target.value }
                      })}
                      placeholder="% of employees covered"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accidentInsurance">Accident Insurance</Label>
                    <Input
                      id="accidentInsurance"
                      value={formData.wellbeingMeasures.accidentInsurance}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellbeingMeasures: { ...formData.wellbeingMeasures, accidentInsurance: e.target.value }
                      })}
                      placeholder="% of employees covered"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maternityBenefits">Maternity Benefits</Label>
                    <Input
                      id="maternityBenefits"
                      value={formData.wellbeingMeasures.maternityBenefits}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellbeingMeasures: { ...formData.wellbeingMeasures, maternityBenefits: e.target.value }
                      })}
                      placeholder="% of employees covered"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paternityBenefits">Paternity Benefits</Label>
                    <Input
                      id="paternityBenefits"
                      value={formData.wellbeingMeasures.paternityBenefits}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellbeingMeasures: { ...formData.wellbeingMeasures, paternityBenefits: e.target.value }
                      })}
                      placeholder="% of employees covered"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dayCareFacilities">Day Care Facilities</Label>
                    <Input
                      id="dayCareFacilities"
                      value={formData.wellbeingMeasures.dayCareFacilities}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellbeingMeasures: { ...formData.wellbeingMeasures, dayCareFacilities: e.target.value }
                      })}
                      placeholder="% of employees covered"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lifeInsurance">Life Insurance</Label>
                    <Input
                      id="lifeInsurance"
                      value={formData.wellbeingMeasures.lifeInsurance}
                      onChange={(e) => setFormData({
                        ...formData,
                        wellbeingMeasures: { ...formData.wellbeingMeasures, lifeInsurance: e.target.value }
                      })}
                      placeholder="% of employees covered"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IRLForm;
