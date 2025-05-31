
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const AdvancedIRLEnvironment = () => {
  const [formData, setFormData] = useState({
    wasteManagementPolicy: '',
    waterManagementPolicy: '',
    hazardousWastePolicy: '',
    msdsDataSheet: '',
    totalEnergyRenewable: '',
    totalEnergyNonRenewable: '',
    energyIntensity: '',
    totalWaterConsumption: '',
    waterIntensity: '',
    waterDischargeDetails: '',
    zeroLiquidDischarge: false,
    zldDetails: '',
    airEmissionsNOx: '',
    airEmissionsSOx: '',
    airEmissionsPM: '',
    ghgScope1: '',
    ghgScope2: '',
    ghgScope3: '',
    ghgReductionProjects: '',
    wasteGenerated: '',
    wasteRecycled: '',
    wasteDisposalMethod: '',
    wasteManagementPractices: '',
    environmentalCompliance: true,
    complianceDetails: '',
    eiaProjects: '',
    ecologicallySensitiveAreas: '',
    biodiversityImpacts: '',
    resourceEfficiencyInitiatives: '',
    businessContinuityPlan: '',
    valueChainEnvironmentalImpact: '',
    patSchemeCompliance: false,
    patTargetsAchieved: ''
  });

  const handleSave = () => {
    console.log('Saving Advanced IRL Environment data:', formData);
  };

  const handleSubmit = () => {
    console.log('Submitting Advanced IRL Environment data:', formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced IRL - Environment</CardTitle>
        <CardDescription>
          Environmental policies, energy consumption, emissions, and compliance information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Environmental Policies */}
        <div className="border-l-4 border-green-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Environmental Policies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wasteManagementPolicy">1. Waste Management Policy</Label>
              <Textarea
                id="wasteManagementPolicy"
                value={formData.wasteManagementPolicy}
                onChange={(e) => setFormData({ ...formData, wasteManagementPolicy: e.target.value })}
                placeholder="Describe waste management policy"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterManagementPolicy">2. Water Management Policy</Label>
              <Textarea
                id="waterManagementPolicy"
                value={formData.waterManagementPolicy}
                onChange={(e) => setFormData({ ...formData, waterManagementPolicy: e.target.value })}
                placeholder="Describe water management policy"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hazardousWastePolicy">3. Hazardous Waste Management Policy</Label>
              <Textarea
                id="hazardousWastePolicy"
                value={formData.hazardousWastePolicy}
                onChange={(e) => setFormData({ ...formData, hazardousWastePolicy: e.target.value })}
                placeholder="Describe hazardous waste management policy"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msdsDataSheet">4. MSDS Data Sheet Details</Label>
              <Textarea
                id="msdsDataSheet"
                value={formData.msdsDataSheet}
                onChange={(e) => setFormData({ ...formData, msdsDataSheet: e.target.value })}
                placeholder="Provide MSDS data sheet information"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Energy Consumption */}
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Energy Consumption</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalEnergyRenewable">Total Energy from Renewable Sources (Joules)</Label>
              <Input
                id="totalEnergyRenewable"
                type="number"
                value={formData.totalEnergyRenewable}
                onChange={(e) => setFormData({ ...formData, totalEnergyRenewable: e.target.value })}
                placeholder="Renewable energy"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalEnergyNonRenewable">Total Energy from Non-Renewable Sources (Joules)</Label>
              <Input
                id="totalEnergyNonRenewable"
                type="number"
                value={formData.totalEnergyNonRenewable}
                onChange={(e) => setFormData({ ...formData, totalEnergyNonRenewable: e.target.value })}
                placeholder="Non-renewable energy"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="energyIntensity">Energy Intensity per Rupee of Turnover</Label>
              <Input
                id="energyIntensity"
                type="number"
                value={formData.energyIntensity}
                onChange={(e) => setFormData({ ...formData, energyIntensity: e.target.value })}
                placeholder="Energy intensity"
              />
            </div>
          </div>
        </div>

        {/* Water Consumption */}
        <div className="border-l-4 border-cyan-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-cyan-700">Water Consumption</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalWaterConsumption">Total Water Consumption (Kilolitres)</Label>
              <Input
                id="totalWaterConsumption"
                type="number"
                value={formData.totalWaterConsumption}
                onChange={(e) => setFormData({ ...formData, totalWaterConsumption: e.target.value })}
                placeholder="Water consumption"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterIntensity">Water Intensity per Rupee of Turnover</Label>
              <Input
                id="waterIntensity"
                type="number"
                value={formData.waterIntensity}
                onChange={(e) => setFormData({ ...formData, waterIntensity: e.target.value })}
                placeholder="Water intensity"
              />
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="waterDischargeDetails">Water Discharge Details by Destination</Label>
            <Textarea
              id="waterDischargeDetails"
              value={formData.waterDischargeDetails}
              onChange={(e) => setFormData({ ...formData, waterDischargeDetails: e.target.value })}
              placeholder="Provide details of water discharge by destination and treatment level"
              rows={3}
            />
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="zeroLiquidDischarge"
                checked={formData.zeroLiquidDischarge}
                onCheckedChange={(checked) => setFormData({ ...formData, zeroLiquidDischarge: !!checked })}
              />
              <Label htmlFor="zeroLiquidDischarge">Has the entity implemented Zero Liquid Discharge?</Label>
            </div>
            {formData.zeroLiquidDischarge && (
              <div className="space-y-2">
                <Label htmlFor="zldDetails">Provide details of ZLD coverage and implementation</Label>
                <Textarea
                  id="zldDetails"
                  value={formData.zldDetails}
                  onChange={(e) => setFormData({ ...formData, zldDetails: e.target.value })}
                  placeholder="ZLD implementation details"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>

        {/* Air Emissions */}
        <div className="border-l-4 border-orange-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-700">Air Emissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="airEmissionsNOx">NOx Emissions (Metric Tonnes)</Label>
              <Input
                id="airEmissionsNOx"
                type="number"
                value={formData.airEmissionsNOx}
                onChange={(e) => setFormData({ ...formData, airEmissionsNOx: e.target.value })}
                placeholder="NOx emissions"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airEmissionsSOx">SOx Emissions (Metric Tonnes)</Label>
              <Input
                id="airEmissionsSOx"
                type="number"
                value={formData.airEmissionsSOx}
                onChange={(e) => setFormData({ ...formData, airEmissionsSOx: e.target.value })}
                placeholder="SOx emissions"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airEmissionsPM">Particulate Matter (Metric Tonnes)</Label>
              <Input
                id="airEmissionsPM"
                type="number"
                value={formData.airEmissionsPM}
                onChange={(e) => setFormData({ ...formData, airEmissionsPM: e.target.value })}
                placeholder="PM emissions"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="ghgScope1">GHG Scope 1 Emissions (Metric Tonnes)</Label>
              <Input
                id="ghgScope1"
                type="number"
                value={formData.ghgScope1}
                onChange={(e) => setFormData({ ...formData, ghgScope1: e.target.value })}
                placeholder="Scope 1 emissions"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ghgScope2">GHG Scope 2 Emissions (Metric Tonnes)</Label>
              <Input
                id="ghgScope2"
                type="number"
                value={formData.ghgScope2}
                onChange={(e) => setFormData({ ...formData, ghgScope2: e.target.value })}
                placeholder="Scope 2 emissions"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ghgScope3">GHG Scope 3 Emissions (Metric Tonnes)</Label>
              <Input
                id="ghgScope3"
                type="number"
                value={formData.ghgScope3}
                onChange={(e) => setFormData({ ...formData, ghgScope3: e.target.value })}
                placeholder="Scope 3 emissions"
              />
            </div>
          </div>
        </div>

        {/* Remaining sections with simplified layout for brevity */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ghgReductionProjects">GHG Reduction Projects and Initiatives</Label>
            <Textarea
              id="ghgReductionProjects"
              value={formData.ghgReductionProjects}
              onChange={(e) => setFormData({ ...formData, ghgReductionProjects: e.target.value })}
              placeholder="Describe GHG reduction projects and innovative technologies"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wasteGenerated">Total Waste Generated (Metric Tonnes)</Label>
              <Input
                id="wasteGenerated"
                type="number"
                value={formData.wasteGenerated}
                onChange={(e) => setFormData({ ...formData, wasteGenerated: e.target.value })}
                placeholder="Waste generated"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wasteRecycled">Waste Recycled/Reused (Metric Tonnes)</Label>
              <Input
                id="wasteRecycled"
                type="number"
                value={formData.wasteRecycled}
                onChange={(e) => setFormData({ ...formData, wasteRecycled: e.target.value })}
                placeholder="Waste recycled"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wasteDisposalMethod">Waste Disposal Method</Label>
              <Select
                value={formData.wasteDisposalMethod}
                onValueChange={(value) => setFormData({ ...formData, wasteDisposalMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recycling">Recycling</SelectItem>
                  <SelectItem value="composting">Composting</SelectItem>
                  <SelectItem value="incineration">Incineration</SelectItem>
                  <SelectItem value="landfill">Landfill</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wasteManagementPractices">Waste Management Practices</Label>
            <Textarea
              id="wasteManagementPractices"
              value={formData.wasteManagementPractices}
              onChange={(e) => setFormData({ ...formData, wasteManagementPractices: e.target.value })}
              placeholder="Describe waste management practices and strategy to reduce hazardous chemicals"
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="environmentalCompliance"
                checked={formData.environmentalCompliance}
                onCheckedChange={(checked) => setFormData({ ...formData, environmentalCompliance: !!checked })}
              />
              <Label htmlFor="environmentalCompliance">Is the entity compliant with environmental laws/regulations?</Label>
            </div>
            {!formData.environmentalCompliance && (
              <div className="space-y-2">
                <Label htmlFor="complianceDetails">Details of non-compliance</Label>
                <Textarea
                  id="complianceDetails"
                  value={formData.complianceDetails}
                  onChange={(e) => setFormData({ ...formData, complianceDetails: e.target.value })}
                  placeholder="Specify laws not complied with, details of non-compliance, fines/penalties, and corrective actions"
                  rows={4}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eiaProjects">Environmental Impact Assessment (EIA) Projects</Label>
            <Textarea
              id="eiaProjects"
              value={formData.eiaProjects}
              onChange={(e) => setFormData({ ...formData, eiaProjects: e.target.value })}
              placeholder="Provide details of EIA projects including notification numbers, dates, and results"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ecologicallySensitiveAreas">Operations in Ecologically Sensitive Areas</Label>
            <Textarea
              id="ecologicallySensitiveAreas"
              value={formData.ecologicallySensitiveAreas}
              onChange={(e) => setFormData({ ...formData, ecologicallySensitiveAreas: e.target.value })}
              placeholder="Specify locations, type of operations, compliance status, and corrective actions"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="biodiversityImpacts">Biodiversity Impacts and Remediation</Label>
            <Textarea
              id="biodiversityImpacts"
              value={formData.biodiversityImpacts}
              onChange={(e) => setFormData({ ...formData, biodiversityImpacts: e.target.value })}
              placeholder="Describe significant impacts on biodiversity and prevention/remediation activities"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resourceEfficiencyInitiatives">Resource Efficiency Initiatives</Label>
            <Textarea
              id="resourceEfficiencyInitiatives"
              value={formData.resourceEfficiencyInitiatives}
              onChange={(e) => setFormData({ ...formData, resourceEfficiencyInitiatives: e.target.value })}
              placeholder="Details of initiatives to improve resource efficiency or reduce emissions/waste"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessContinuityPlan">Business Continuity and Disaster Management Plan</Label>
            <Textarea
              id="businessContinuityPlan"
              value={formData.businessContinuityPlan}
              onChange={(e) => setFormData({ ...formData, businessContinuityPlan: e.target.value })}
              placeholder="Provide details of business continuity and disaster management plan"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valueChainEnvironmentalImpact">Value Chain Environmental Impact</Label>
            <Textarea
              id="valueChainEnvironmentalImpact"
              value={formData.valueChainEnvironmentalImpact}
              onChange={(e) => setFormData({ ...formData, valueChainEnvironmentalImpact: e.target.value })}
              placeholder="Disclose significant adverse environmental impacts from value chain and mitigation measures"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="patSchemeCompliance"
                checked={formData.patSchemeCompliance}
                onCheckedChange={(checked) => setFormData({ ...formData, patSchemeCompliance: !!checked })}
              />
              <Label htmlFor="patSchemeCompliance">Does the entity have sites identified as designated consumers under PAT Scheme?</Label>
            </div>
            {formData.patSchemeCompliance && (
              <div className="space-y-2">
                <Label htmlFor="patTargetsAchieved">PAT Scheme Targets Achievement</Label>
                <Textarea
                  id="patTargetsAchieved"
                  value={formData.patTargetsAchieved}
                  onChange={(e) => setFormData({ ...formData, patTargetsAchieved: e.target.value })}
                  placeholder="Disclose whether targets set under PAT scheme have been achieved. If not, provide remedial actions"
                  rows={3}
                />
              </div>
            )}
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

export default AdvancedIRLEnvironment;
