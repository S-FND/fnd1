
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { industries } from '../../data/materiality';

interface MethodologyTabProps {
  selectedIndustries: string[];
}

const MethodologyTab: React.FC<MethodologyTabProps> = ({ selectedIndustries }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Materiality Assessment Methodology</CardTitle>
        <CardDescription>Our approach to determining material ESG topics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Double Materiality Approach</h3>
          <p className="text-sm">
            Our materiality assessment follows the double materiality principle, which considers both:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>
              <span className="font-medium">Impact Materiality:</span> How our company's activities impact the environment and society
            </li>
            <li>
              <span className="font-medium">Financial Materiality:</span> How ESG factors impact our company's financial performance and value creation
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Industry-Specific Considerations</h3>
          <p className="text-sm">
            Our materiality assessment is tailored to the specific industries in which we operate. We have selected {selectedIndustries.length} {selectedIndustries.length === 1 ? 'industry' : 'industries'} for this assessment:
          </p>
          <div className="mt-2">
            {selectedIndustries.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedIndustries.map(id => {
                  const industry = industries.find(i => i.id === id);
                  return industry ? (
                    <Badge key={id} variant="outline">{industry.name}</Badge>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No industries selected. Using default materiality assessment.</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Assessment Process</h3>
          <ol className="list-decimal pl-6 mt-2 space-y-3 text-sm">
            <li>
              <span className="font-medium block">Identification of Topics</span>
              Topics were identified through stakeholder consultations, industry benchmarking, and ESG reporting frameworks (GRI, SASB, TCFD).
            </li>
            <li>
              <span className="font-medium block">Stakeholder Engagement</span>
              We engaged with various stakeholders including employees, investors, customers, suppliers, regulators, and community representatives.
            </li>
            <li>
              <span className="font-medium block">Prioritization</span>
              Topics were rated on a scale from 1-10 for both business impact and sustainability impact based on stakeholder input and expert assessment.
            </li>
            <li>
              <span className="font-medium block">Validation</span>
              The final materiality matrix was reviewed and validated by our ESG Committee and Board of Directors.
            </li>
          </ol>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Review Cycle</h3>
          <p className="text-sm">
            Our materiality assessment is reviewed annually and updated completely every three years to ensure continued relevance to our business strategy and stakeholder concerns.
          </p>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button>Download Full Assessment Report</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologyTab;
