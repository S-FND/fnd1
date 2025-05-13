
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const GeneralDisclosures: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">ESRS 2: General Disclosures</h2>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Governance Structure & Oversight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Board of Directors' Role</h3>
              <p>
                The Board of Directors oversees Translog India Ltd.'s sustainability strategy, 
                risks, and opportunities. The Board's Sustainability Committee meets quarterly to 
                review sustainability performance and provides strategic guidance on ESG matters.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Management's Role</h3>
              <p>
                Our Chief Sustainability Officer (CSO) reports directly to the CEO and leads 
                the corporate sustainability team of 15 professionals. The CSO is responsible 
                for implementing the sustainability strategy, monitoring performance, and reporting 
                progress to the Board.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Executive Compensation</h3>
              <p>
                20% of executive compensation is tied to sustainability performance metrics, 
                including GHG emissions reduction, water conservation, diversity targets, 
                and safety performance.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Strategy & Business Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Value Creation Model</h3>
              <p>
                Translog India Ltd. is a leading logistics and transportation provider specializing 
                in sustainable supply chain solutions. Our business model focuses on optimizing 
                transportation networks, reducing environmental impact, and providing value-added 
                services that enhance our clients' sustainability performance.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Strategic Sustainability Objectives</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Achieve carbon neutrality in our operations by 2030</li>
                <li>Convert 80% of our fleet to zero-emission vehicles by 2035</li>
                <li>Reduce water consumption by 50% across all facilities by 2028</li>
                <li>Achieve zero waste to landfill at all locations by 2026</li>
                <li>Maintain industry-leading safety records with zero fatalities</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stakeholder Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stakeholder Group</TableHead>
                  <TableHead>Engagement Methods</TableHead>
                  <TableHead>Key Topics Raised</TableHead>
                  <TableHead>Our Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Employees</TableCell>
                  <TableCell>Annual surveys, town halls, focus groups</TableCell>
                  <TableCell>Work-life balance, career development, diversity</TableCell>
                  <TableCell>Flexible work policy, expanded training programs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Customers</TableCell>
                  <TableCell>Satisfaction surveys, advisory panels</TableCell>
                  <TableCell>Carbon footprint of deliveries, sustainable packaging</TableCell>
                  <TableCell>Low-carbon delivery options, packaging optimization</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Investors</TableCell>
                  <TableCell>Quarterly calls, annual meetings</TableCell>
                  <TableCell>Climate risks, governance, long-term strategy</TableCell>
                  <TableCell>Enhanced ESG disclosures, TCFD alignment</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Communities</TableCell>
                  <TableCell>Local forums, partnership programs</TableCell>
                  <TableCell>Noise pollution, traffic congestion, local employment</TableCell>
                  <TableCell>Route optimization, community hiring initiatives</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GeneralDisclosures;
