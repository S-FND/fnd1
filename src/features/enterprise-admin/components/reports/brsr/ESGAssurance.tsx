
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ESGAssurance: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section D: ESG Assurance</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Independent Assurance</h3>
          <p className="mb-4">
            The ESG disclosures contained in this BRSR report have been independently assured by KPMG India as per AA1000 Assurance Standard. The scope of assurance covered environmental and social parameters based on materiality assessment. The assurance statement is available as an annexure to this report.
          </p>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">Assurance Statement Highlights</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assurance Provider</TableHead>
                <TableHead>Standard</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Validity Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>KPMG India</TableCell>
                <TableCell>AA1000 Assurance Standard v3</TableCell>
                <TableCell>Environmental & Social</TableCell>
                <TableCell>FY 2023-24</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">Environmental Parameters Assured</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>GHG Emissions (Scope 1, 2, and 3)</li>
            <li>Energy Consumption</li>
            <li>Water Withdrawal and Discharge</li>
            <li>Waste Management</li>
            <li>Fleet Efficiency Metrics</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Social Parameters Assured</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Health & Safety Metrics</li>
            <li>Human Rights Compliance</li>
            <li>Employee Diversity</li>
            <li>Community Investment</li>
            <li>Driver Welfare Programs</li>
          </ul>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Note: The complete assurance statement with methodologies, limitations, and recommendations is available upon request from the Sustainability Department.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default ESGAssurance;
