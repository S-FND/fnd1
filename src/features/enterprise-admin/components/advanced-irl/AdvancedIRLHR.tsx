
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { logger } from '@/hooks/logger';

interface EmergencyIncident {
  date: string;
  location: string;
  peopleAffected: string;
  description: string;
}

interface SexualHarassmentGrievance {
  date: string;
  location: string;
  status: string;
  description: string;
}

interface OutsourcedService {
  agencyName: string;
  serviceType: string;
  maleWorkers: string;
  femaleWorkers: string;
}

const AdvancedIRLHR = () => {
  const [formData, setFormData] = useState({
    workingHoursFTE: '',
    shiftTimingContract: '',
    hasGrievanceRedressal: false,
    grievanceDetails: '',
    healthInsuranceMale: '',
    healthInsuranceFemale: '',
    accidentInsuranceMale: '',
    accidentInsuranceFemale: '',
    maternityBenefits: '',
    paternityBenefits: '',
    daycarePercentage: '',
    pfCoverageCurrentFY: '',
    pfCoveragePreviousFY: '',
    gratuityCurrentFY: '',
    gratuityPreviousFY: '',
    esiCurrentFY: '',
    esiPreviousFY: '',
    deductionsDeposited: false,
    unionMembershipMale: '',
    unionMembershipFemale: '',
    trainingHealthSafety: '',
    trainingSkillUpgradation: '',
    womenInBoD: '',
    womenInKMP: '',
    turnoverVoluntaryMale: '',
    turnoverVoluntaryFemale: '',
    turnoverInvoluntaryMale: '',
    turnoverInvoluntaryFemale: '',
    accessibilityDetails: '',
    hasEqualOpportunityPolicy: false,
    equalOpportunityPolicyLink: '',
    medianRemunerationMale: '',
    medianRemunerationFemale: '',
    humanRightsFocalPoint: '',
    humanRightsGrievanceMechanism: '',
    discriminationPreventionMechanisms: '',
    humanRightsInContracts: false,
    plantsAssessedPercentage: '',
    correctiveActionsDetails: '',
    businessProcessModifications: '',
    humanRightsDueDiligence: '',
    valueChainAssessment: ''
  });

  const [emergencyIncidents, setEmergencyIncidents] = useState<EmergencyIncident[]>([
    { date: '', location: '', peopleAffected: '', description: '' }
  ]);

  const [sexualHarassmentGrievances, setSexualHarassmentGrievances] = useState<SexualHarassmentGrievance[]>([
    { date: '', location: '', status: '', description: '' }
  ]);

  const [outsourcedServices, setOutsourcedServices] = useState<OutsourcedService[]>([
    { agencyName: '', serviceType: '', maleWorkers: '', femaleWorkers: '' }
  ]);

  const addEmergencyIncident = () => {
    setEmergencyIncidents([...emergencyIncidents, { date: '', location: '', peopleAffected: '', description: '' }]);
  };

  const removeEmergencyIncident = (index: number) => {
    setEmergencyIncidents(emergencyIncidents.filter((_, i) => i !== index));
  };

  const addSexualHarassmentGrievance = () => {
    setSexualHarassmentGrievances([...sexualHarassmentGrievances, { date: '', location: '', status: '', description: '' }]);
  };

  const removeSexualHarassmentGrievance = (index: number) => {
    setSexualHarassmentGrievances(sexualHarassmentGrievances.filter((_, i) => i !== index));
  };

  const addOutsourcedService = () => {
    setOutsourcedServices([...outsourcedServices, { agencyName: '', serviceType: '', maleWorkers: '', femaleWorkers: '' }]);
  };

  const removeOutsourcedService = (index: number) => {
    setOutsourcedServices(outsourcedServices.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    logger.log('Saving Advanced IRL HR data:', { formData, emergencyIncidents, sexualHarassmentGrievances, outsourcedServices });
  };

  const handleSubmit = () => {
    logger.log('Submitting Advanced IRL HR data:', { formData, emergencyIncidents, sexualHarassmentGrievances, outsourcedServices });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced IRL - HR Information</CardTitle>
        <CardDescription>
          Comprehensive HR and employee-related information for BRSR compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Working Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workingHoursFTE">1. Working hours for FTEs</Label>
            <Input
              id="workingHoursFTE"
              value={formData.workingHoursFTE}
              onChange={(e) => setFormData({ ...formData, workingHoursFTE: e.target.value })}
              placeholder="e.g. 09:30 AM to 06:30 PM"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shiftTimingContract">2. Shift timing for contract workers</Label>
            <Input
              id="shiftTimingContract"
              value={formData.shiftTimingContract}
              onChange={(e) => setFormData({ ...formData, shiftTimingContract: e.target.value })}
              placeholder="Enter shift timings"
            />
          </div>
        </div>

        {/* Outsourced Services */}
        <div className="space-y-4">
          <Label>3. Outsourced services through professional services agencies</Label>
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
                  <Label>Agency Name</Label>
                  <Input
                    value={service.agencyName}
                    onChange={(e) => {
                      const newServices = [...outsourcedServices];
                      newServices[index].agencyName = e.target.value;
                      setOutsourcedServices(newServices);
                    }}
                    placeholder="Agency name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Input
                    value={service.serviceType}
                    onChange={(e) => {
                      const newServices = [...outsourcedServices];
                      newServices[index].serviceType = e.target.value;
                      setOutsourcedServices(newServices);
                    }}
                    placeholder="Service type"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Male Workers</Label>
                  <Input
                    type="number"
                    value={service.maleWorkers}
                    onChange={(e) => {
                      const newServices = [...outsourcedServices];
                      newServices[index].maleWorkers = e.target.value;
                      setOutsourcedServices(newServices);
                    }}
                    placeholder="Count"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Female Workers</Label>
                  <Input
                    type="number"
                    value={service.femaleWorkers}
                    onChange={(e) => {
                      const newServices = [...outsourcedServices];
                      newServices[index].femaleWorkers = e.target.value;
                      setOutsourcedServices(newServices);
                    }}
                    placeholder="Count"
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

        {/* Employee Benefits Coverage */}
        <div className="border-l-4 border-primary pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-primary">4-5. Employee Benefits Coverage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthInsuranceMale">Health Insurance - Male (%)</Label>
              <Input
                id="healthInsuranceMale"
                type="number"
                value={formData.healthInsuranceMale}
                onChange={(e) => setFormData({ ...formData, healthInsuranceMale: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="healthInsuranceFemale">Health Insurance - Female (%)</Label>
              <Input
                id="healthInsuranceFemale"
                type="number"
                value={formData.healthInsuranceFemale}
                onChange={(e) => setFormData({ ...formData, healthInsuranceFemale: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accidentInsuranceMale">Accident Insurance - Male (%)</Label>
              <Input
                id="accidentInsuranceMale"
                type="number"
                value={formData.accidentInsuranceMale}
                onChange={(e) => setFormData({ ...formData, accidentInsuranceMale: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accidentInsuranceFemale">Accident Insurance - Female (%)</Label>
              <Input
                id="accidentInsuranceFemale"
                type="number"
                value={formData.accidentInsuranceFemale}
                onChange={(e) => setFormData({ ...formData, accidentInsuranceFemale: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maternityBenefits">Maternity Benefits (%)</Label>
              <Input
                id="maternityBenefits"
                type="number"
                value={formData.maternityBenefits}
                onChange={(e) => setFormData({ ...formData, maternityBenefits: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paternityBenefits">Paternity Benefits (%)</Label>
              <Input
                id="paternityBenefits"
                type="number"
                value={formData.paternityBenefits}
                onChange={(e) => setFormData({ ...formData, paternityBenefits: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daycarePercentage">Daycare Facilities (%)</Label>
              <Input
                id="daycarePercentage"
                type="number"
                value={formData.daycarePercentage}
                onChange={(e) => setFormData({ ...formData, daycarePercentage: e.target.value })}
                placeholder="Percentage"
              />
            </div>
          </div>
        </div>

        {/* PF, Gratuity, ESI Coverage */}
        <div className="border-l-4 border-secondary pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-secondary">6. Coverage under PF, Gratuity, ESI</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pfCoverageCurrentFY">PF Coverage - Current FY (%)</Label>
              <Input
                id="pfCoverageCurrentFY"
                type="number"
                value={formData.pfCoverageCurrentFY}
                onChange={(e) => setFormData({ ...formData, pfCoverageCurrentFY: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pfCoveragePreviousFY">PF Coverage - Previous FY (%)</Label>
              <Input
                id="pfCoveragePreviousFY"
                type="number"
                value={formData.pfCoveragePreviousFY}
                onChange={(e) => setFormData({ ...formData, pfCoveragePreviousFY: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gratuityCurrentFY">Gratuity - Current FY (%)</Label>
              <Input
                id="gratuityCurrentFY"
                type="number"
                value={formData.gratuityCurrentFY}
                onChange={(e) => setFormData({ ...formData, gratuityCurrentFY: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gratuityPreviousFY">Gratuity - Previous FY (%)</Label>
              <Input
                id="gratuityPreviousFY"
                type="number"
                value={formData.gratuityPreviousFY}
                onChange={(e) => setFormData({ ...formData, gratuityPreviousFY: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="esiCurrentFY">ESI - Current FY (%)</Label>
              <Input
                id="esiCurrentFY"
                type="number"
                value={formData.esiCurrentFY}
                onChange={(e) => setFormData({ ...formData, esiCurrentFY: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="esiPreviousFY">ESI - Previous FY (%)</Label>
              <Input
                id="esiPreviousFY"
                type="number"
                value={formData.esiPreviousFY}
                onChange={(e) => setFormData({ ...formData, esiPreviousFY: e.target.value })}
                placeholder="Percentage"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="deductionsDeposited"
                checked={formData.deductionsDeposited}
                onCheckedChange={(checked) => setFormData({ ...formData, deductionsDeposited: !!checked })}
              />
              <Label htmlFor="deductionsDeposited">7. Whether deductions were deposited with the relevant authority</Label>
            </div>
          </div>
        </div>

        {/* Grievance Redressal */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasGrievanceRedressal"
              checked={formData.hasGrievanceRedressal}
              onCheckedChange={(checked) => setFormData({ ...formData, hasGrievanceRedressal: !!checked })}
            />
            <Label htmlFor="hasGrievanceRedressal">8. Is there a grievance redressal mechanism?</Label>
          </div>
          
          {formData.hasGrievanceRedressal && (
            <div className="space-y-2">
              <Label htmlFor="grievanceDetails">10. Provide details of the mechanism</Label>
              <Textarea
                id="grievanceDetails"
                value={formData.grievanceDetails}
                onChange={(e) => setFormData({ ...formData, grievanceDetails: e.target.value })}
                placeholder="Describe the grievance redressal mechanism"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Union Membership */}
        <div className="space-y-4">
          <Label>11-13. Membership of employees in associations or unions</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unionMembershipMale">Male Employees in Unions (%)</Label>
              <Input
                id="unionMembershipMale"
                type="number"
                value={formData.unionMembershipMale}
                onChange={(e) => setFormData({ ...formData, unionMembershipMale: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unionMembershipFemale">Female Employees in Unions (%)</Label>
              <Input
                id="unionMembershipFemale"
                type="number"
                value={formData.unionMembershipFemale}
                onChange={(e) => setFormData({ ...formData, unionMembershipFemale: e.target.value })}
                placeholder="Percentage"
              />
            </div>
          </div>
        </div>

        {/* Training Details */}
        <div className="space-y-4">
          <Label>14-16. Training Details</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainingHealthSafety">Health and Safety Training (Hours)</Label>
              <Input
                id="trainingHealthSafety"
                type="number"
                value={formData.trainingHealthSafety}
                onChange={(e) => setFormData({ ...formData, trainingHealthSafety: e.target.value })}
                placeholder="Training hours"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingSkillUpgradation">Skill Upgradation Training (Hours)</Label>
              <Input
                id="trainingSkillUpgradation"
                type="number"
                value={formData.trainingSkillUpgradation}
                onChange={(e) => setFormData({ ...formData, trainingSkillUpgradation: e.target.value })}
                placeholder="Training hours"
              />
            </div>
          </div>
        </div>

        {/* Emergency Incidents */}
        <div className="space-y-4">
          <Label>Emergency Incidents or Accidents</Label>
          {emergencyIncidents.map((incident, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Incident {index + 1}</h4>
                {emergencyIncidents.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEmergencyIncident(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={incident.date}
                    onChange={(e) => {
                      const newIncidents = [...emergencyIncidents];
                      newIncidents[index].date = e.target.value;
                      setEmergencyIncidents(newIncidents);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={incident.location}
                    onChange={(e) => {
                      const newIncidents = [...emergencyIncidents];
                      newIncidents[index].location = e.target.value;
                      setEmergencyIncidents(newIncidents);
                    }}
                    placeholder="Location"
                  />
                </div>
                <div className="space-y-2">
                  <Label>People Affected</Label>
                  <Input
                    type="number"
                    value={incident.peopleAffected}
                    onChange={(e) => {
                      const newIncidents = [...emergencyIncidents];
                      newIncidents[index].peopleAffected = e.target.value;
                      setEmergencyIncidents(newIncidents);
                    }}
                    placeholder="Count"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={incident.description}
                    onChange={(e) => {
                      const newIncidents = [...emergencyIncidents];
                      newIncidents[index].description = e.target.value;
                      setEmergencyIncidents(newIncidents);
                    }}
                    placeholder="Incident description"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addEmergencyIncident} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Emergency Incident
          </Button>
        </div>

        {/* Sexual Harassment Grievances */}
        <div className="space-y-4">
          <Label>Sexual Harassment Grievances</Label>
          {sexualHarassmentGrievances.map((grievance, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Grievance {index + 1}</h4>
                {sexualHarassmentGrievances.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSexualHarassmentGrievance(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={grievance.date}
                    onChange={(e) => {
                      const newGrievances = [...sexualHarassmentGrievances];
                      newGrievances[index].date = e.target.value;
                      setSexualHarassmentGrievances(newGrievances);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={grievance.location}
                    onChange={(e) => {
                      const newGrievances = [...sexualHarassmentGrievances];
                      newGrievances[index].location = e.target.value;
                      setSexualHarassmentGrievances(newGrievances);
                    }}
                    placeholder="Location"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={grievance.status}
                    onValueChange={(value) => {
                      const newGrievances = [...sexualHarassmentGrievances];
                      newGrievances[index].status = value;
                      setSexualHarassmentGrievances(newGrievances);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="under-investigation">Under Investigation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={grievance.description}
                    onChange={(e) => {
                      const newGrievances = [...sexualHarassmentGrievances];
                      newGrievances[index].description = e.target.value;
                      setSexualHarassmentGrievances(newGrievances);
                    }}
                    placeholder="Grievance description"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addSexualHarassmentGrievance} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Sexual Harassment Grievance
          </Button>
        </div>

        {/* Remaining fields in a grid layout for better organization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Women in Leadership */}
          <div className="space-y-4">
            <Label>Women's Participation in Leadership</Label>
            <div className="space-y-2">
              <Label htmlFor="womenInBoD">Women in Board of Directors (%)</Label>
              <Input
                id="womenInBoD"
                type="number"
                value={formData.womenInBoD}
                onChange={(e) => setFormData({ ...formData, womenInBoD: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="womenInKMP">Women in Key Management Personnel (%)</Label>
              <Input
                id="womenInKMP"
                type="number"
                value={formData.womenInKMP}
                onChange={(e) => setFormData({ ...formData, womenInKMP: e.target.value })}
                placeholder="Percentage"
              />
            </div>
          </div>

          {/* Turnover Rates */}
          <div className="space-y-4">
            <Label>Turnover Rates</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="turnoverVoluntaryMale">Voluntary - Male (%)</Label>
                <Input
                  id="turnoverVoluntaryMale"
                  type="number"
                  value={formData.turnoverVoluntaryMale}
                  onChange={(e) => setFormData({ ...formData, turnoverVoluntaryMale: e.target.value })}
                  placeholder="%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turnoverVoluntaryFemale">Voluntary - Female (%)</Label>
                <Input
                  id="turnoverVoluntaryFemale"
                  type="number"
                  value={formData.turnoverVoluntaryFemale}
                  onChange={(e) => setFormData({ ...formData, turnoverVoluntaryFemale: e.target.value })}
                  placeholder="%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turnoverInvoluntaryMale">Involuntary - Male (%)</Label>
                <Input
                  id="turnoverInvoluntaryMale"
                  type="number"
                  value={formData.turnoverInvoluntaryMale}
                  onChange={(e) => setFormData({ ...formData, turnoverInvoluntaryMale: e.target.value })}
                  placeholder="%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turnoverInvoluntaryFemale">Involuntary - Female (%)</Label>
                <Input
                  id="turnoverInvoluntaryFemale"
                  type="number"
                  value={formData.turnoverInvoluntaryFemale}
                  onChange={(e) => setFormData({ ...formData, turnoverInvoluntaryFemale: e.target.value })}
                  placeholder="%"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Remaining long-form fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accessibilityDetails">Accessibility for Differently-Abled Employees</Label>
            <Textarea
              id="accessibilityDetails"
              value={formData.accessibilityDetails}
              onChange={(e) => setFormData({ ...formData, accessibilityDetails: e.target.value })}
              placeholder="Details of accessibility features like ramps, washrooms, parking etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasEqualOpportunityPolicy"
                checked={formData.hasEqualOpportunityPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, hasEqualOpportunityPolicy: !!checked })}
              />
              <Label htmlFor="hasEqualOpportunityPolicy">Does the entity have an equal opportunity policy?</Label>
            </div>
            {formData.hasEqualOpportunityPolicy && (
              <div className="space-y-2">
                <Label htmlFor="equalOpportunityPolicyLink">Web link to the policy</Label>
                <Input
                  id="equalOpportunityPolicyLink"
                  type="url"
                  value={formData.equalOpportunityPolicyLink}
                  onChange={(e) => setFormData({ ...formData, equalOpportunityPolicyLink: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medianRemunerationMale">Median Remuneration - Male (Rs)</Label>
              <Input
                id="medianRemunerationMale"
                type="number"
                value={formData.medianRemunerationMale}
                onChange={(e) => setFormData({ ...formData, medianRemunerationMale: e.target.value })}
                placeholder="Amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medianRemunerationFemale">Median Remuneration - Female (Rs)</Label>
              <Input
                id="medianRemunerationFemale"
                type="number"
                value={formData.medianRemunerationFemale}
                onChange={(e) => setFormData({ ...formData, medianRemunerationFemale: e.target.value })}
                placeholder="Amount"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="humanRightsFocalPoint">Human Rights Focal Point</Label>
            <Textarea
              id="humanRightsFocalPoint"
              value={formData.humanRightsFocalPoint}
              onChange={(e) => setFormData({ ...formData, humanRightsFocalPoint: e.target.value })}
              placeholder="Details of individual or committee responsible for human rights"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humanRightsGrievanceMechanism">Internal mechanisms to redress human rights grievances</Label>
            <Textarea
              id="humanRightsGrievanceMechanism"
              value={formData.humanRightsGrievanceMechanism}
              onChange={(e) => setFormData({ ...formData, humanRightsGrievanceMechanism: e.target.value })}
              placeholder="Describe the mechanisms in place"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discriminationPreventionMechanisms">Mechanisms to prevent adverse consequences in discrimination/harassment cases</Label>
            <Textarea
              id="discriminationPreventionMechanisms"
              value={formData.discriminationPreventionMechanisms}
              onChange={(e) => setFormData({ ...formData, discriminationPreventionMechanisms: e.target.value })}
              placeholder="How does the entity protect complainants?"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="humanRightsInContracts"
              checked={formData.humanRightsInContracts}
              onCheckedChange={(checked) => setFormData({ ...formData, humanRightsInContracts: !!checked })}
            />
            <Label htmlFor="humanRightsInContracts">Are human rights requirements included in business agreements?</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plantsAssessedPercentage">% of plants/offices assessed for human rights risks</Label>
            <Input
              id="plantsAssessedPercentage"
              type="number"
              value={formData.plantsAssessedPercentage}
              onChange={(e) => setFormData({ ...formData, plantsAssessedPercentage: e.target.value })}
              placeholder="Percentage"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctiveActionsDetails">Corrective actions taken for significant risks</Label>
            <Textarea
              id="correctiveActionsDetails"
              value={formData.correctiveActionsDetails}
              onChange={(e) => setFormData({ ...formData, correctiveActionsDetails: e.target.value })}
              placeholder="Details of actions underway or completed"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessProcessModifications">Business process modifications due to human rights grievances</Label>
            <Textarea
              id="businessProcessModifications"
              value={formData.businessProcessModifications}
              onChange={(e) => setFormData({ ...formData, businessProcessModifications: e.target.value })}
              placeholder="Examples of changes introduced"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humanRightsDueDiligence">Scope and coverage of human rights due diligence</Label>
            <Textarea
              id="humanRightsDueDiligence"
              value={formData.humanRightsDueDiligence}
              onChange={(e) => setFormData({ ...formData, humanRightsDueDiligence: e.target.value })}
              placeholder="Details of the due diligence conducted"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valueChainAssessment">Assessment of value chain partners</Label>
            <Textarea
              id="valueChainAssessment"
              value={formData.valueChainAssessment}
              onChange={(e) => setFormData({ ...formData, valueChainAssessment: e.target.value })}
              placeholder="How are partners evaluated for human rights compliance?"
              rows={3}
            />
          </div>
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

export default AdvancedIRLHR;
