
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { industries } from '../../data/materiality';

// Define allowed framework types
type Framework = 'SASB' | 'GRI' | 'Custom';

interface MethodologyTabProps {
  selectedIndustries: string[];
  frameworks: Framework[];
}

const MethodologyTab: React.FC<MethodologyTabProps> = ({ selectedIndustries, frameworks }) => {
  // Get industry names from selected IDs
  const selectedIndustryNames = selectedIndustries.map(id => 
    industries.find(industry => industry.id === id)?.name || id
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Methodology</CardTitle>
        <CardDescription>The methodology used for materiality assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Double Materiality Approach</h3>
          <p className="text-muted-foreground">
            The materiality assessment follows a double materiality approach, which considers both the impact 
            of sustainability topics on the company's financial performance and value creation (financial materiality) 
            and the company's impact on the environment, society, and economy (impact materiality).
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Industry Scope</h3>
          {selectedIndustries.length > 0 ? (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                The assessment is tailored to the following {selectedIndustries.length} selected {selectedIndustries.length === 1 ? 'industry' : 'industries'}:
              </p>
              <ul className="list-disc pl-6">
                {selectedIndustryNames.map(industry => (
                  <li key={industry} className="text-muted-foreground">{industry}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground">
              The assessment uses a general set of material topics since no specific industry is selected.
            </p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Frameworks Applied</h3>
          <p className="text-muted-foreground">
            The following frameworks are applied in the materiality assessment:
          </p>
          <ul className="list-disc pl-6 mt-2">
            {frameworks.map(framework => (
              <li key={framework} className="text-muted-foreground">
                {framework === 'SASB' ? 'Sustainability Accounting Standards Board (SASB)' :
                 framework === 'GRI' ? 'Global Reporting Initiative (GRI)' :
                 'Custom Topics (Company-specific)'}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Topic Selection Process</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li className="text-muted-foreground">
              Initial identification of potentially material topics based on selected industries and frameworks
            </li>
            <li className="text-muted-foreground">
              Stakeholder engagement to prioritize topics based on business impact and sustainability impact
            </li>
            <li className="text-muted-foreground">
              Validation and finalization of material topics
            </li>
            <li className="text-muted-foreground">
              Regular review and update of the materiality assessment
            </li>
          </ol>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Prioritization Methodology</h3>
          <p className="text-muted-foreground">
            Topics are prioritized based on two dimensions:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li className="text-muted-foreground">
              <span className="font-medium">Business Impact:</span> The topic's potential impact on business value creation, including financial performance, operational efficiency, reputation, and strategic alignment.
            </li>
            <li className="text-muted-foreground">
              <span className="font-medium">Sustainability Impact:</span> The significance of the company's impact on the environment, society, and economy related to the topic.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologyTab;
