
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { industries } from '../../data/materiality';

interface MethodologyTabProps {
  selectedIndustries: string[];
  frameworks: string[];
}

const MethodologyTab: React.FC<MethodologyTabProps> = ({ selectedIndustries, frameworks }) => {
  const selectedIndustryNames = selectedIndustries.map(industryId => {
    const industry = industries.find(i => i.id === industryId);
    return industry?.name || industryId;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Methodology</CardTitle>
        <CardDescription>How the materiality assessment was conducted</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Double Materiality Approach</h3>
          <p className="text-sm text-muted-foreground">
            This assessment uses a double materiality approach, which considers both:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Business Impact:</strong> How ESG topics affect financial performance, operations, and reputation
            </li>
            <li>
              <strong>Sustainability Impact:</strong> How the organization's activities impact society and the environment
            </li>
          </ul>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Frameworks Used</h3>
          <div className="space-y-4">
            {frameworks.includes('SASB') && (
              <div>
                <h4 className="text-base font-medium">SASB Standards</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The Sustainability Accounting Standards Board (SASB) Standards identify the subset of 
                  environmental, social, and governance issues most relevant to financial performance in 
                  each of 77 industries. Topics from these standards have been included based on their
                  relevance to the selected industries.
                </p>
              </div>
            )}
            
            {frameworks.includes('GRI') && (
              <div>
                <h4 className="text-base font-medium">GRI Standards</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The Global Reporting Initiative (GRI) provides a comprehensive framework for ESG 
                  reporting. Material topics from GRI Standards have been included based on their 
                  relevance to understanding the organization's impacts on the economy, environment, 
                  and people.
                </p>
              </div>
            )}
            
            {frameworks.includes('Custom') && (
              <div>
                <h4 className="text-base font-medium">Custom Topics</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  In addition to standardized frameworks, custom material topics specific to the 
                  organization's operations and context have been included to ensure comprehensive coverage.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Industry Scope</h3>
          {selectedIndustries.length > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Topics have been selected based on their relevance to the following industries:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                {selectedIndustryNames.map((industry, index) => (
                  <li key={index}>{industry}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Currently using a general set of material topics. Select specific industries to customize the assessment.
            </p>
          )}
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Stakeholder Input</h3>
          <p className="text-sm text-muted-foreground">
            The materiality assessment includes input from both internal and external stakeholders:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Internal stakeholders:</strong> Executives, managers, employees
            </li>
            <li>
              <strong>External stakeholders:</strong> Customers, suppliers, investors, community representatives, regulators
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Stakeholders prioritize the importance of each material topic from their perspective, which is then 
            aggregated to determine overall priority for the organization.
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Matrix Interpretation</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>The materiality matrix plots topics across four quadrants:</p>
            <p>
              <strong>Focus & Act (top-right):</strong> High priority topics with significant business and sustainability impacts
            </p>
            <p>
              <strong>Manage (top-left):</strong> Topics with high business impact but lower sustainability impact
            </p>
            <p>
              <strong>Maintain (bottom-right):</strong> Topics with high sustainability impact but lower business impact
            </p>
            <p>
              <strong>Monitor (bottom-left):</strong> Lower priority topics to be monitored over time
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologyTab;
