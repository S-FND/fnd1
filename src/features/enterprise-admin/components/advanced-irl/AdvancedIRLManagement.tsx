
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { logger } from '@/hooks/logger';

const AdvancedIRLManagement = () => {
  const [formData, setFormData] = useState({
    organizationChart: null,
    hrPolicy: false,
    ethicsPolicy: false,
    productResponsibilityPolicy: false,
    equalOpportunityPolicy: false,
    leavePolicy: false,
    ehsPolicy: false,
    codeOfConduct: false,
    poshPolicy: false,
    diversityPolicy: false,
    antiDiscriminationPolicy: false,
    antiBriberyPolicy: false,
    trainingPolicy: false,
    humanRightsPolicy: false,
    retirementPolicy: false,
    conflictManagementPolicy: false,
    emergencyEvacuationPlan: false,
    fireExtinguisherChecklist: false,
    stakeholderEngagementPlan: false,
    // Add many more fields for all the requirements
    materialIssues: '',
    esgChallenges: '',
    performanceTargets: '',
    independentAssessment: false,
    assessmentAgency: ''
  });

  const handleSave = () => {
    logger.log('Saving Advanced IRL Management data:', formData);
  };

  const handleSubmit = () => {
    logger.log('Submitting Advanced IRL Management data:', formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced IRL - Management Systems</CardTitle>
        <CardDescription>
          Management systems, policies, governance, and NGRBC principle compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Organization Structure */}
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">1. Organizational Structure</h3>
          <div className="space-y-2">
            <Label htmlFor="organizationChart">Upload Organization Chart</Label>
            <Input
              id="organizationChart"
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) => setFormData({ ...formData, organizationChart: e.target.files?.[0] || null })}
            />
          </div>
        </div>

        {/* Policies in Place */}
        <div className="border-l-4 border-green-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-green-700">2. Policies in Place</h3>
          <p className="text-sm text-gray-600 mb-4">Select applicable policies and upload supporting documents:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hrPolicy"
                checked={formData.hrPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, hrPolicy: !!checked })}
              />
              <Label htmlFor="hrPolicy" className="text-sm">Human Resource Policy and Procedures Manual</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ethicsPolicy"
                checked={formData.ethicsPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, ethicsPolicy: !!checked })}
              />
              <Label htmlFor="ethicsPolicy" className="text-sm">Ethics and Transparency Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="productResponsibilityPolicy"
                checked={formData.productResponsibilityPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, productResponsibilityPolicy: !!checked })}
              />
              <Label htmlFor="productResponsibilityPolicy" className="text-sm">Product Responsibility Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="equalOpportunityPolicy"
                checked={formData.equalOpportunityPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, equalOpportunityPolicy: !!checked })}
              />
              <Label htmlFor="equalOpportunityPolicy" className="text-sm">Equal Opportunity Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="leavePolicy"
                checked={formData.leavePolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, leavePolicy: !!checked })}
              />
              <Label htmlFor="leavePolicy" className="text-sm">Leave Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ehsPolicy"
                checked={formData.ehsPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, ehsPolicy: !!checked })}
              />
              <Label htmlFor="ehsPolicy" className="text-sm">EHS (Environment, Health, and Safety) Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="codeOfConduct"
                checked={formData.codeOfConduct}
                onCheckedChange={(checked) => setFormData({ ...formData, codeOfConduct: !!checked })}
              />
              <Label htmlFor="codeOfConduct" className="text-sm">Code of Conduct</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="poshPolicy"
                checked={formData.poshPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, poshPolicy: !!checked })}
              />
              <Label htmlFor="poshPolicy" className="text-sm">POSH (Prevention of Sexual Harassment) Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diversityPolicy"
                checked={formData.diversityPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, diversityPolicy: !!checked })}
              />
              <Label htmlFor="diversityPolicy" className="text-sm">Diversity, Equity, and Inclusion Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="antiDiscriminationPolicy"
                checked={formData.antiDiscriminationPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, antiDiscriminationPolicy: !!checked })}
              />
              <Label htmlFor="antiDiscriminationPolicy" className="text-sm">Anti-Discrimination Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="antiBriberyPolicy"
                checked={formData.antiBriberyPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, antiBriberyPolicy: !!checked })}
              />
              <Label htmlFor="antiBriberyPolicy" className="text-sm">Anti-Bribery and Anti-Corruption Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trainingPolicy"
                checked={formData.trainingPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, trainingPolicy: !!checked })}
              />
              <Label htmlFor="trainingPolicy" className="text-sm">Employee Induction and Training Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="humanRightsPolicy"
                checked={formData.humanRightsPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, humanRightsPolicy: !!checked })}
              />
              <Label htmlFor="humanRightsPolicy" className="text-sm">Human Rights Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="retirementPolicy"
                checked={formData.retirementPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, retirementPolicy: !!checked })}
              />
              <Label htmlFor="retirementPolicy" className="text-sm">Policy for Assistance on Retirement</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="conflictManagementPolicy"
                checked={formData.conflictManagementPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, conflictManagementPolicy: !!checked })}
              />
              <Label htmlFor="conflictManagementPolicy" className="text-sm">Conflict Management Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergencyEvacuationPlan"
                checked={formData.emergencyEvacuationPlan}
                onCheckedChange={(checked) => setFormData({ ...formData, emergencyEvacuationPlan: !!checked })}
              />
              <Label htmlFor="emergencyEvacuationPlan" className="text-sm">Emergency Evacuation Plan</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fireExtinguisherChecklist"
                checked={formData.fireExtinguisherChecklist}
                onCheckedChange={(checked) => setFormData({ ...formData, fireExtinguisherChecklist: !!checked })}
              />
              <Label htmlFor="fireExtinguisherChecklist" className="text-sm">Fire Extinguishers Maintenance Checklist</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stakeholderEngagementPlan"
                checked={formData.stakeholderEngagementPlan}
                onCheckedChange={(checked) => setFormData({ ...formData, stakeholderEngagementPlan: !!checked })}
              />
              <Label htmlFor="stakeholderEngagementPlan" className="text-sm">Stakeholder Engagement Plan</Label>
            </div>
          </div>
        </div>

        {/* ESG Management and Governance */}
        <div className="border-l-4 border-purple-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">5. Governance, Leadership, and Oversight</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="esgChallenges">Statement by director highlighting ESG-related challenges, targets, and achievements</Label>
              <Textarea
                id="esgChallenges"
                value={formData.esgChallenges}
                onChange={(e) => setFormData({ ...formData, esgChallenges: e.target.value })}
                placeholder="Provide statement highlighting ESG challenges, targets, and achievements"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="performanceTargets">Specific commitments, goals, and targets with defined timelines</Label>
              <Textarea
                id="performanceTargets"
                value={formData.performanceTargets}
                onChange={(e) => setFormData({ ...formData, performanceTargets: e.target.value })}
                placeholder="Describe specific commitments, goals, and targets with timelines"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Material Issues */}
        <div className="border-l-4 border-orange-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-700">10. Material Responsible Business Conduct Issues</h3>
          <div className="space-y-2">
            <Label htmlFor="materialIssues">Provide details of material issues identified</Label>
            <Textarea
              id="materialIssues"
              value={formData.materialIssues}
              onChange={(e) => setFormData({ ...formData, materialIssues: e.target.value })}
              placeholder="Describe material issues, risks/opportunities, rationale, approach to mitigate, and financial implications"
              rows={6}
            />
          </div>
        </div>

        {/* Independent Assessment */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="independentAssessment"
              checked={formData.independentAssessment}
              onCheckedChange={(checked) => setFormData({ ...formData, independentAssessment: !!checked })}
            />
            <Label htmlFor="independentAssessment">7. Has the entity carried out independent assessment/evaluation by an external agency?</Label>
          </div>
          
          {formData.independentAssessment && (
            <div className="space-y-2">
              <Label htmlFor="assessmentAgency">Name of the external agency</Label>
              <Input
                id="assessmentAgency"
                value={formData.assessmentAgency}
                onChange={(e) => setFormData({ ...formData, assessmentAgency: e.target.value })}
                placeholder="External agency name"
              />
            </div>
          )}
        </div>

        {/* Note about comprehensive form */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Note:</h4>
          <p className="text-sm text-yellow-700">
            This form contains a subset of the management system requirements. The complete form includes detailed sections for:
            NGRBC Principles (P1-P9) compliance, stakeholder engagement details, performance reviews, litigation details, 
            R&D investments, sustainable sourcing, product recalls, parental leave policies, union membership, 
            grievance mechanisms, consumer complaints, and sexual harassment protocols.
          </p>
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

export default AdvancedIRLManagement;
