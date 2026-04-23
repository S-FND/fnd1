
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

interface SubsidiaryInfo {
  name: string;
  type: string;
  holdingPercentage: string;
}

interface CSRProject {
  projectName: string;
  district: string;
  state: string;
  amount: string;
  beneficiaries: string;
}

interface TradeAssociation {
  name: string;
  membershipType: string;
  year: string;
}

const AdvancedIRLCompany = () => {
  const [formData, setFormData] = useState({
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    reportingBoundary: '',
    hasSubsidiaries: false,
    businessActivitiesDescription: '',
    productsServicesDescription: '',
    exportsPercentage: '',
    inputMaterialPercentage: '',
    hasPreferentialProcurement: false,
    marginalizizedGroups: '',
    procurementPercentage: '',
    accountsPayableDays: '',
    hasCSR: false,
    csrApplicable: false,
    correctedActionDetails: '',
    publicPolicyPositions: '',
    rehabilitationProjects: '',
    grievanceMechanism: '',
    socialImpactAssessment: '',
    negativeSocialImpacts: '',
    concentrationDetails: '',
    jobCreationDetails: '',
    intellectualPropertyBenefits: '',
    intellectualPropertyDisputes: ''
  });

  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryInfo[]>([
    { name: '', type: '', holdingPercentage: '' }
  ]);

  const [csrProjects, setCSRProjects] = useState<CSRProject[]>([
    { projectName: '', district: '', state: '', amount: '', beneficiaries: '' }
  ]);

  const [tradeAssociations, setTradeAssociations] = useState<TradeAssociation[]>([
    { name: '', membershipType: '', year: '' }
  ]);

  const addSubsidiary = () => {
    setSubsidiaries([...subsidiaries, { name: '', type: '', holdingPercentage: '' }]);
  };

  const removeSubsidiary = (index: number) => {
    setSubsidiaries(subsidiaries.filter((_, i) => i !== index));
  };

  const addCSRProject = () => {
    setCSRProjects([...csrProjects, { projectName: '', district: '', state: '', amount: '', beneficiaries: '' }]);
  };

  const removeCSRProject = (index: number) => {
    setCSRProjects(csrProjects.filter((_, i) => i !== index));
  };

  const addTradeAssociation = () => {
    setTradeAssociations([...tradeAssociations, { name: '', membershipType: '', year: '' }]);
  };

  const removeTradeAssociation = (index: number) => {
    setTradeAssociations(tradeAssociations.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    logger.log('Saving Advanced IRL Company data:', { formData, subsidiaries, csrProjects, tradeAssociations });
  };

  const handleSubmit = () => {
    logger.log('Submitting Advanced IRL Company data:', { formData, subsidiaries, csrProjects, tradeAssociations });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced IRL - Company Information</CardTitle>
        <CardDescription>
          Comprehensive company information for BRSR compliance and advanced ESG due diligence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Details */}
        <div className="border-l-4 border-primary pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-primary">1. Contact Details for BRSR Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPersonName">Name</Label>
              <Input
                id="contactPersonName"
                value={formData.contactPersonName}
                onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                placeholder="Contact person name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPersonPhone">Telephone</Label>
              <Input
                id="contactPersonPhone"
                value={formData.contactPersonPhone}
                onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPersonEmail">Email Address</Label>
              <Input
                id="contactPersonEmail"
                type="email"
                value={formData.contactPersonEmail}
                onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                placeholder="Email address"
              />
            </div>
          </div>
        </div>

        {/* Reporting Boundary */}
        <div className="space-y-2">
          <Label htmlFor="reportingBoundary">2. Reporting Boundary</Label>
          <Select
            value={formData.reportingBoundary}
            onValueChange={(value) => setFormData({ ...formData, reportingBoundary: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reporting boundary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standalone">Standalone basis (only for the entity)</SelectItem>
              <SelectItem value="consolidated">Consolidated basis (entity and consolidated financial statements)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subsidiaries */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasSubsidiaries"
              checked={formData.hasSubsidiaries}
              onCheckedChange={(checked) => setFormData({ ...formData, hasSubsidiaries: !!checked })}
            />
            <Label htmlFor="hasSubsidiaries">3. Do you have any subsidiaries?</Label>
          </div>
          
          {formData.hasSubsidiaries && (
            <div className="space-y-4">
              <Label>Subsidiary Details</Label>
              {subsidiaries.map((subsidiary, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Subsidiary {index + 1}</h4>
                    {subsidiaries.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubsidiary(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={subsidiary.name}
                        onChange={(e) => {
                          const newSubsidiaries = [...subsidiaries];
                          newSubsidiaries[index].name = e.target.value;
                          setSubsidiaries(newSubsidiaries);
                        }}
                        placeholder="Company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={subsidiary.type}
                        onValueChange={(value) => {
                          const newSubsidiaries = [...subsidiaries];
                          newSubsidiaries[index].type = value;
                          setSubsidiaries(newSubsidiaries);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="holding">Holding Company</SelectItem>
                          <SelectItem value="subsidiary">Subsidiary</SelectItem>
                          <SelectItem value="associate">Associate Company</SelectItem>
                          <SelectItem value="joint-venture">Joint Venture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Holding Percentage (%)</Label>
                      <Input
                        type="number"
                        value={subsidiary.holdingPercentage}
                        onChange={(e) => {
                          const newSubsidiaries = [...subsidiaries];
                          newSubsidiaries[index].holdingPercentage = e.target.value;
                          setSubsidiaries(newSubsidiaries);
                        }}
                        placeholder="Percentage"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addSubsidiary} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Subsidiary
              </Button>
            </div>
          )}
        </div>

        {/* Business Activities */}
        <div className="space-y-2">
          <Label htmlFor="businessActivitiesDescription">4. Provide description of business activities (accounting for 90% of the turnover)</Label>
          <Textarea
            id="businessActivitiesDescription"
            value={formData.businessActivitiesDescription}
            onChange={(e) => setFormData({ ...formData, businessActivitiesDescription: e.target.value })}
            placeholder="Describe the main business activities that account for 90% of your turnover"
            rows={4}
          />
        </div>

        {/* Products and Services */}
        <div className="space-y-2">
          <Label htmlFor="productsServicesDescription">5. Provide details of products and services sold by the company (accounting for 90% of turnover)</Label>
          <Textarea
            id="productsServicesDescription"
            value={formData.productsServicesDescription}
            onChange={(e) => setFormData({ ...formData, productsServicesDescription: e.target.value })}
            placeholder="Describe products and services that account for 90% of turnover"
            rows={4}
          />
        </div>

        {/* Export Percentage */}
        <div className="space-y-2">
          <Label htmlFor="exportsPercentage">6. What are the percentage (%) of contribution of exports of the total turnover?</Label>
          <Input
            id="exportsPercentage"
            type="number"
            value={formData.exportsPercentage}
            onChange={(e) => setFormData({ ...formData, exportsPercentage: e.target.value })}
            placeholder="Enter percentage"
          />
        </div>

        {/* Input Material Sourcing */}
        <div className="space-y-4">
          <Label htmlFor="inputMaterialPercentage">7. What are the % of input material sourced from suppliers?</Label>
          <Input
            id="inputMaterialPercentage"
            type="number"
            value={formData.inputMaterialPercentage}
            onChange={(e) => setFormData({ ...formData, inputMaterialPercentage: e.target.value })}
            placeholder="Enter percentage"
          />
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPreferentialProcurement"
                checked={formData.hasPreferentialProcurement}
                onCheckedChange={(checked) => setFormData({ ...formData, hasPreferentialProcurement: !!checked })}
              />
              <Label htmlFor="hasPreferentialProcurement">Do you have a preferential procurement policy for marginalized/vulnerable groups?</Label>
            </div>
            
            {formData.hasPreferentialProcurement && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marginalizizedGroups">From which marginalized/vulnerable groups do you procure?</Label>
                  <Textarea
                    id="marginalizizedGroups"
                    value={formData.marginalizizedGroups}
                    onChange={(e) => setFormData({ ...formData, marginalizizedGroups: e.target.value })}
                    placeholder="List the groups"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="procurementPercentage">What percentage of total procurement does it constitute?</Label>
                  <Input
                    id="procurementPercentage"
                    type="number"
                    value={formData.procurementPercentage}
                    onChange={(e) => setFormData({ ...formData, procurementPercentage: e.target.value })}
                    placeholder="Enter percentage"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Accounts Payable */}
        <div className="space-y-2">
          <Label htmlFor="accountsPayableDays">8. Number of days of accounts payables ((Accounts payable *365) / Cost of goods/services procured)</Label>
          <Input
            id="accountsPayableDays"
            type="number"
            value={formData.accountsPayableDays}
            onChange={(e) => setFormData({ ...formData, accountsPayableDays: e.target.value })}
            placeholder="Enter number of days"
          />
        </div>

        {/* CSR Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCSR"
              checked={formData.hasCSR}
              onCheckedChange={(checked) => setFormData({ ...formData, hasCSR: !!checked })}
            />
            <Label htmlFor="hasCSR">9. Provide CSR Details</Label>
          </div>

          {formData.hasCSR && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="csrApplicable"
                  checked={formData.csrApplicable}
                  onCheckedChange={(checked) => setFormData({ ...formData, csrApplicable: !!checked })}
                />
                <Label htmlFor="csrApplicable">10. Whether CSR is applicable as per section 135 of the Companies Act, 2013</Label>
              </div>

              <div className="space-y-4">
                <Label>11. CSR Projects in Aspirational Districts</Label>
                {csrProjects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">CSR Project {index + 1}</h4>
                      {csrProjects.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCSRProject(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input
                          value={project.projectName}
                          onChange={(e) => {
                            const newProjects = [...csrProjects];
                            newProjects[index].projectName = e.target.value;
                            setCSRProjects(newProjects);
                          }}
                          placeholder="Project name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>District</Label>
                        <Input
                          value={project.district}
                          onChange={(e) => {
                            const newProjects = [...csrProjects];
                            newProjects[index].district = e.target.value;
                            setCSRProjects(newProjects);
                          }}
                          placeholder="District"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          value={project.state}
                          onChange={(e) => {
                            const newProjects = [...csrProjects];
                            newProjects[index].state = e.target.value;
                            setCSRProjects(newProjects);
                          }}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount (Rs)</Label>
                        <Input
                          type="number"
                          value={project.amount}
                          onChange={(e) => {
                            const newProjects = [...csrProjects];
                            newProjects[index].amount = e.target.value;
                            setCSRProjects(newProjects);
                          }}
                          placeholder="Amount"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Beneficiaries</Label>
                        <Input
                          type="number"
                          value={project.beneficiaries}
                          onChange={(e) => {
                            const newProjects = [...csrProjects];
                            newProjects[index].beneficiaries = e.target.value;
                            setCSRProjects(newProjects);
                          }}
                          placeholder="No. of beneficiaries"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addCSRProject} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add CSR Project
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Trade Associations */}
        <div className="space-y-4">
          <Label>13-14. Trade and Industry Associations</Label>
          {tradeAssociations.map((association, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Association {index + 1}</h4>
                {tradeAssociations.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTradeAssociation(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Association Name</Label>
                  <Input
                    value={association.name}
                    onChange={(e) => {
                      const newAssociations = [...tradeAssociations];
                      newAssociations[index].name = e.target.value;
                      setTradeAssociations(newAssociations);
                    }}
                    placeholder="Association name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Membership Type</Label>
                  <Select
                    value={association.membershipType}
                    onValueChange={(value) => {
                      const newAssociations = [...tradeAssociations];
                      newAssociations[index].membershipType = value;
                      setTradeAssociations(newAssociations);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="affiliated">Affiliated</SelectItem>
                      <SelectItem value="board-member">Board Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year of Joining</Label>
                  <Input
                    type="number"
                    value={association.year}
                    onChange={(e) => {
                      const newAssociations = [...tradeAssociations];
                      newAssociations[index].year = e.target.value;
                      setTradeAssociations(newAssociations);
                    }}
                    placeholder="Year"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addTradeAssociation} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Trade Association
          </Button>
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="correctedActionDetails">15. Details of corrective action underway for anti-competitive conduct</Label>
            <Textarea
              id="correctedActionDetails"
              value={formData.correctedActionDetails}
              onChange={(e) => setFormData({ ...formData, correctedActionDetails: e.target.value })}
              placeholder="Provide details of any corrective actions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicPolicyPositions">16. Details of public policy positions advocated by entity</Label>
            <Textarea
              id="publicPolicyPositions"
              value={formData.publicPolicyPositions}
              onChange={(e) => setFormData({ ...formData, publicPolicyPositions: e.target.value })}
              placeholder="Describe public policy positions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rehabilitationProjects">17. Details of rehabilitation and resettlement projects</Label>
            <Textarea
              id="rehabilitationProjects"
              value={formData.rehabilitationProjects}
              onChange={(e) => setFormData({ ...formData, rehabilitationProjects: e.target.value })}
              placeholder="Provide details of rehabilitation projects"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grievanceMechanism">18. Mechanisms to receive and redress grievances of the community</Label>
            <Textarea
              id="grievanceMechanism"
              value={formData.grievanceMechanism}
              onChange={(e) => setFormData({ ...formData, grievanceMechanism: e.target.value })}
              placeholder="Describe grievance mechanisms"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialImpactAssessment">19. Details of Social Impact Assessment (SIA) of projects</Label>
            <Textarea
              id="socialImpactAssessment"
              value={formData.socialImpactAssessment}
              onChange={(e) => setFormData({ ...formData, socialImpactAssessment: e.target.value })}
              placeholder="Provide SIA details"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="negativeSocialImpacts">20. Actions taken to mitigate negative social impacts identified under SIA</Label>
            <Textarea
              id="negativeSocialImpacts"
              value={formData.negativeSocialImpacts}
              onChange={(e) => setFormData({ ...formData, negativeSocialImpacts: e.target.value })}
              placeholder="Describe mitigation actions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concentrationDetails">21. Details of concentration of purchases and sales with trading houses</Label>
            <Textarea
              id="concentrationDetails"
              value={formData.concentrationDetails}
              onChange={(e) => setFormData({ ...formData, concentrationDetails: e.target.value })}
              placeholder="Provide concentration details"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobCreationDetails">22. Job creation in smaller towns - wages paid details</Label>
            <Textarea
              id="jobCreationDetails"
              value={formData.jobCreationDetails}
              onChange={(e) => setFormData({ ...formData, jobCreationDetails: e.target.value })}
              placeholder="Provide job creation details"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intellectualPropertyBenefits">23. Benefits derived from intellectual properties based on traditional knowledge</Label>
            <Textarea
              id="intellectualPropertyBenefits"
              value={formData.intellectualPropertyBenefits}
              onChange={(e) => setFormData({ ...formData, intellectualPropertyBenefits: e.target.value })}
              placeholder="Describe IP benefits"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intellectualPropertyDisputes">24. Corrective actions for IP disputes involving traditional knowledge</Label>
            <Textarea
              id="intellectualPropertyDisputes"
              value={formData.intellectualPropertyDisputes}
              onChange={(e) => setFormData({ ...formData, intellectualPropertyDisputes: e.target.value })}
              placeholder="Describe corrective actions"
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

export default AdvancedIRLCompany;
