
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

const PrincipleWisePerformance: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section C: Principle-wise Performance</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Principle 1: Ethics, Transparency and Accountability</h3>
          <Separator className="my-2" />
          
          <p className="mt-2">
            The company has established robust governance mechanisms that ensure ethical conduct across all business operations. Our Code of Conduct covers 100% of our employees and extends to our supply chain partners. During the reporting period:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Zero confirmed incidents of corruption</li>
            <li>100% of employees received ethics training</li>
            <li>24 stakeholder complaints received, 23 resolved (96% resolution rate)</li>
            <li>Three independent directors serving on the Board's Ethics Committee</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Principle 2: Safety and Sustainability of Products & Services</h3>
          <Separator className="my-2" />
          
          <p className="mt-2">
            Our product development process incorporates life-cycle sustainability assessments for all new products.
          </p>
          
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Current Usage</TableHead>
                <TableHead>Reduction during sourcing/production/distribution</TableHead>
                <TableHead>Reduction during usage by consumers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Energy</TableCell>
                <TableCell>12,450 MWh</TableCell>
                <TableCell>15% reduction</TableCell>
                <TableCell>22% reduction</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Water</TableCell>
                <TableCell>145,000 m³</TableCell>
                <TableCell>8% reduction</TableCell>
                <TableCell>12% reduction</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Raw Materials</TableCell>
                <TableCell>28,700 tons</TableCell>
                <TableCell>5% reduction</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Principle 3: Employee Well-being</h3>
          <Separator className="my-2" />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Accessibility of workplaces</TableCell>
                <TableCell>85% facilities fully accessible</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Return to work and retention rates after parental leave</TableCell>
                <TableCell>92% return rate, 85% retention (one year)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Grievance redressal mechanism for employees</TableCell>
                <TableCell>Yes, online portal and anonymous hotline</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Safety incidents</TableCell>
                <TableCell>LTIFR: 0.3, Zero fatalities</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default PrincipleWisePerformance;
