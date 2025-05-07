
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

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
          
          <Separator className="my-6" />
          
          <h3 className="text-lg font-semibold mb-4">Logistics-Specific ESG Assurance</h3>
          <p className="mb-4">
            In addition to standard ESG parameters, our assurance process specifically focuses on key logistics material topics including:
          </p>
          
          <Table className="mb-6">
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Logistics-Specific Metrics Assured</TableHead>
                <TableHead>Assurance Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Fleet Management</TableCell>
                <TableCell>Vehicle utilization rates, fuel efficiency, emissions per ton-km</TableCell>
                <TableCell>High</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Warehouse Operations</TableCell>
                <TableCell>Energy intensity, space utilization efficiency, renewable energy %</TableCell>
                <TableCell>High</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Intermodal Transport</TableCell>
                <TableCell>Modal shift metrics, emissions avoided through rail usage</TableCell>
                <TableCell>Moderate</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last-Mile Delivery</TableCell>
                <TableCell>Electric vehicle adoption, route optimization effectiveness</TableCell>
                <TableCell>Moderate</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Supply Chain Resilience</TableCell>
                <TableCell>Climate risk assessments, business continuity tests</TableCell>
                <TableCell>Limited</TableCell>
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
            <li>Container Utilization Rates</li>
            <li>Modal Shift Performance (Road to Rail)</li>
            <li>Warehouse Energy Efficiency</li>
            <li>Renewable Energy Usage</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Social Parameters Assured</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Health & Safety Metrics</li>
            <li>Human Rights Compliance</li>
            <li>Employee Diversity</li>
            <li>Community Investment</li>
            <li>Driver Welfare Programs</li>
            <li>Community Impact Near Logistics Hubs</li>
            <li>Labor Practices in Warehouses</li>
            <li>Training Hours for Safety Procedures</li>
          </ul>
          
          <Separator className="my-6" />
          
          <h3 className="text-lg font-semibold mb-4">Assurance Methodology</h3>
          <p className="mb-4">
            The assurance engagement was conducted in accordance with AA1000 Assurance Standard v3 and ISAE 3000 (Revised). The process involved:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Site visits to 8 major logistics facilities including CFSs, ICDs, and warehouses</li>
            <li>Interviews with 42 key personnel across operations, sustainability, and management functions</li>
            <li>Review of documentation and management systems</li>
            <li>Data sampling and verification for reported KPIs</li>
            <li>Assessment of adherence to reporting principles of inclusivity, materiality, responsiveness, and impact</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-4">Assurance Conclusion</h3>
          <p className="mb-4">
            Based on the work performed, KPMG concludes that the BRSR report of Translog India Ltd. presents a fair and balanced view of the company's ESG performance. The reported data is accurate and reliable within the specified boundaries. The logistics-specific metrics demonstrate the company's commitment to sustainable integrated logistics operations across its multimodal transport, CFS/ICD, and 3PL services.
          </p>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Note: The complete assurance statement with methodologies, limitations, and recommendations is available upon request from the Sustainability Department.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default ESGAssurance;
