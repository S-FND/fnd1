
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GeneralRequirements: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">ESRS 1: General Requirements</h2>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Reporting Principles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Materiality Assessment</h3>
              <p>
                Translog India Ltd. has conducted a comprehensive double materiality assessment, 
                identifying key sustainability topics that have significant impact on our business 
                and those where our operations impact stakeholders and the environment. Our materiality 
                assessment involved engagement with 150+ stakeholders across 12 stakeholder groups.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Value Chain Boundaries</h3>
              <p>
                Our sustainability reporting covers our direct operations (8 manufacturing facilities, 
                12 distribution centers, and corporate offices) and extends to our value chain, including 
                654 tier-1 suppliers and distribution network across 18 countries.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Time Periods</h3>
              <p>
                This report covers the fiscal year 2024-2025 (April 1, 2024 to March 31, 2025). 
                Where relevant, we include historical data from 2020 onwards to demonstrate progress 
                against our sustainability goals.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Compliance Declaration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This sustainability report has been prepared in accordance with the European Sustainability 
              Reporting Standards (ESRS). The Board of Directors of Translog India Ltd. has approved this 
              report and confirms that it presents a true and fair view of the company's sustainability 
              risks, opportunities, and performance for the fiscal year 2024-2025.
            </p>
            <div className="mt-4">
              <p className="font-medium">Sanjay Mehta</p>
              <p className="text-sm text-muted-foreground">Chairperson, Sustainability Committee</p>
              <p className="text-sm text-muted-foreground">June 15, 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GeneralRequirements;
