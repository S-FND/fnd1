
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface DataBreach {
  date: string;
  description: string;
  affectedRecords: string;
  containmentActions: string;
}

const AdvancedIRLITSecurity = () => {
  const [formData, setFormData] = useState({
    hasDataSecurityCertification: false,
    hasBusinessContinuityPlan: false,
    hasDisasterRecoveryPlan: false,
    hasITSecurityPolicy: false,
    hasCybersecurityPolicy: false,
    hasTermsAndConditions: false,
    hasPrivacyPolicy: false,
    hasITSecurityAudit: false,
    hasDataBreaches: false,
    piiBreachPercentage: '',
    piiBreachDetails: '',
    serverType: '',
    serverNames: '',
    dataStorageScope: '',
    dataSecurityMeasures: '',
    hasITSecurityCertifications: false,
    itSecurityCertificationDetails: '',
    hasProductSafetyCertifications: false,
    productSafetyCertificationDetails: ''
  });

  const [dataBreaches, setDataBreaches] = useState<DataBreach[]>([
    { date: '', description: '', affectedRecords: '', containmentActions: '' }
  ]);

  const addDataBreach = () => {
    setDataBreaches([...dataBreaches, { date: '', description: '', affectedRecords: '', containmentActions: '' }]);
  };

  const removeDataBreach = (index: number) => {
    setDataBreaches(dataBreaches.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Saving Advanced IRL IT Security data:', { formData, dataBreaches });
  };

  const handleSubmit = () => {
    console.log('Submitting Advanced IRL IT Security data:', { formData, dataBreaches });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced IRL - IT Security</CardTitle>
        <CardDescription>
          IT security policies, data protection measures, and cybersecurity compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* IT Security Policies */}
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">1. IT Security Policies and Documents</h3>
          <p className="text-sm text-gray-600 mb-4">Select applicable policies/documents and upload supporting files:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDataSecurityCertification"
                checked={formData.hasDataSecurityCertification}
                onCheckedChange={(checked) => setFormData({ ...formData, hasDataSecurityCertification: !!checked })}
              />
              <Label htmlFor="hasDataSecurityCertification" className="text-sm">Data Security and Privacy Certifications</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasBusinessContinuityPlan"
                checked={formData.hasBusinessContinuityPlan}
                onCheckedChange={(checked) => setFormData({ ...formData, hasBusinessContinuityPlan: !!checked })}
              />
              <Label htmlFor="hasBusinessContinuityPlan" className="text-sm">Business Continuity Plan</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDisasterRecoveryPlan"
                checked={formData.hasDisasterRecoveryPlan}
                onCheckedChange={(checked) => setFormData({ ...formData, hasDisasterRecoveryPlan: !!checked })}
              />
              <Label htmlFor="hasDisasterRecoveryPlan" className="text-sm">Disaster Recovery Plan</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasITSecurityPolicy"
                checked={formData.hasITSecurityPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, hasITSecurityPolicy: !!checked })}
              />
              <Label htmlFor="hasITSecurityPolicy" className="text-sm">Policy on IT Security and Data Privacy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCybersecurityPolicy"
                checked={formData.hasCybersecurityPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, hasCybersecurityPolicy: !!checked })}
              />
              <Label htmlFor="hasCybersecurityPolicy" className="text-sm">Cybersecurity Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasTermsAndConditions"
                checked={formData.hasTermsAndConditions}
                onCheckedChange={(checked) => setFormData({ ...formData, hasTermsAndConditions: !!checked })}
              />
              <Label htmlFor="hasTermsAndConditions" className="text-sm">Terms and Conditions for App/Website</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPrivacyPolicy"
                checked={formData.hasPrivacyPolicy}
                onCheckedChange={(checked) => setFormData({ ...formData, hasPrivacyPolicy: !!checked })}
              />
              <Label htmlFor="hasPrivacyPolicy" className="text-sm">Privacy Policy</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasITSecurityAudit"
                checked={formData.hasITSecurityAudit}
                onCheckedChange={(checked) => setFormData({ ...formData, hasITSecurityAudit: !!checked })}
              />
              <Label htmlFor="hasITSecurityAudit" className="text-sm">Documents of IT Security Audit</Label>
            </div>
          </div>
        </div>

        {/* Data Breaches */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasDataBreaches"
              checked={formData.hasDataBreaches}
              onCheckedChange={(checked) => setFormData({ ...formData, hasDataBreaches: !!checked })}
            />
            <Label htmlFor="hasDataBreaches">2. Have there been any data breaches?</Label>
          </div>
          
          {formData.hasDataBreaches && (
            <div className="space-y-4">
              <Label>Provide details of data breaches:</Label>
              {dataBreaches.map((breach, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Data Breach {index + 1}</h4>
                    {dataBreaches.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDataBreach(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Breach</Label>
                      <Input
                        type="date"
                        value={breach.date}
                        onChange={(e) => {
                          const newBreaches = [...dataBreaches];
                          newBreaches[index].date = e.target.value;
                          setDataBreaches(newBreaches);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Affected Records</Label>
                      <Input
                        type="number"
                        value={breach.affectedRecords}
                        onChange={(e) => {
                          const newBreaches = [...dataBreaches];
                          newBreaches[index].affectedRecords = e.target.value;
                          setDataBreaches(newBreaches);
                        }}
                        placeholder="Number of records"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={breach.description}
                        onChange={(e) => {
                          const newBreaches = [...dataBreaches];
                          newBreaches[index].description = e.target.value;
                          setDataBreaches(newBreaches);
                        }}
                        placeholder="Breach description"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Containment Actions</Label>
                      <Textarea
                        value={breach.containmentActions}
                        onChange={(e) => {
                          const newBreaches = [...dataBreaches];
                          newBreaches[index].containmentActions = e.target.value;
                          setDataBreaches(newBreaches);
                        }}
                        placeholder="Actions taken"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addDataBreach} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Data Breach
              </Button>
            </div>
          )}
        </div>

        {/* PII Data Breaches */}
        <div className="space-y-4">
          <Label>3. Percentage of Data Breaches Involving Personally Identifiable Information (PII)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="piiBreachPercentage">Percentage of PII breaches (%)</Label>
              <Input
                id="piiBreachPercentage"
                type="number"
                value={formData.piiBreachPercentage}
                onChange={(e) => setFormData({ ...formData, piiBreachPercentage: e.target.value })}
                placeholder="Percentage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="piiBreachDetails">Details of PII breaches</Label>
              <Textarea
                id="piiBreachDetails"
                value={formData.piiBreachDetails}
                onChange={(e) => setFormData({ ...formData, piiBreachDetails: e.target.value })}
                placeholder="Provide details of PII breaches"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Server Information */}
        <div className="border-l-4 border-green-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Server and Data Information</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serverType">4. What type of servers are used?</Label>
              <Select
                value={formData.serverType}
                onValueChange={(value) => setFormData({ ...formData, serverType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select server type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical Servers</SelectItem>
                  <SelectItem value="cloud">Cloud Servers</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Physical + Cloud)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serverNames">5. Name of servers used</Label>
              <Input
                id="serverNames"
                value={formData.serverNames}
                onChange={(e) => setFormData({ ...formData, serverNames: e.target.value })}
                placeholder="AWS, Azure, Google Cloud, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataStorageScope">6. Scope of data stored in servers</Label>
              <Textarea
                id="dataStorageScope"
                value={formData.dataStorageScope}
                onChange={(e) => setFormData({ ...formData, dataStorageScope: e.target.value })}
                placeholder="Describe the types and scope of data stored"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataSecurityMeasures">7. How are data security and privacy of customers ensured?</Label>
              <Textarea
                id="dataSecurityMeasures"
                value={formData.dataSecurityMeasures}
                onChange={(e) => setFormData({ ...formData, dataSecurityMeasures: e.target.value })}
                placeholder="Describe security measures, encryption methods, access controls, etc."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasITSecurityCertifications"
                checked={formData.hasITSecurityCertifications}
                onCheckedChange={(checked) => setFormData({ ...formData, hasITSecurityCertifications: !!checked })}
              />
              <Label htmlFor="hasITSecurityCertifications">8. Are there any product or IT security certifications?</Label>
            </div>
            
            {formData.hasITSecurityCertifications && (
              <div className="space-y-2">
                <Label htmlFor="itSecurityCertificationDetails">IT Security Certification Details</Label>
                <Textarea
                  id="itSecurityCertificationDetails"
                  value={formData.itSecurityCertificationDetails}
                  onChange={(e) => setFormData({ ...formData, itSecurityCertificationDetails: e.target.value })}
                  placeholder="Provide details of IT security certifications (ISO 27001, SOC 2, etc.)"
                  rows={3}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasProductSafetyCertifications"
                checked={formData.hasProductSafetyCertifications}
                onCheckedChange={(checked) => setFormData({ ...formData, hasProductSafetyCertifications: !!checked })}
              />
              <Label htmlFor="hasProductSafetyCertifications">9. Are there any certifications for product safety?</Label>
            </div>
            
            {formData.hasProductSafetyCertifications && (
              <div className="space-y-2">
                <Label htmlFor="productSafetyCertificationDetails">Product Safety Certification Details</Label>
                <Textarea
                  id="productSafetyCertificationDetails"
                  value={formData.productSafetyCertificationDetails}
                  onChange={(e) => setFormData({ ...formData, productSafetyCertificationDetails: e.target.value })}
                  placeholder="Provide details of product safety certifications"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">IT Security Best Practices:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Implement multi-factor authentication for all systems</li>
            <li>• Regular security audits and vulnerability assessments</li>
            <li>• Employee training on cybersecurity awareness</li>
            <li>• Data encryption both in transit and at rest</li>
            <li>• Regular backup and disaster recovery testing</li>
            <li>• Incident response plan and procedures</li>
            <li>• Compliance with relevant data protection regulations</li>
          </ul>
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

export default AdvancedIRLITSecurity;
