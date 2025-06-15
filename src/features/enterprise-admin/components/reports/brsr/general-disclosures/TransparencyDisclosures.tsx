
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

const TransparencyDisclosures: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">VI. Transparency and Disclosures</h3>
        
        <h4 className="text-md font-medium mt-4 mb-2">Complaints/Grievances on any of the principles:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>Stakeholder Group</TableHead>
              <TableHead colSpan={3}>Grievances Received FY 2023-24</TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Filed during the year</TableHead>
              <TableHead>Pending resolution</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Communities</TableCell>
              <TableCell>18</TableCell>
              <TableCell>1</TableCell>
              <TableCell>Primarily related to noise from operations</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Investors</TableCell>
              <TableCell>12</TableCell>
              <TableCell>0</TableCell>
              <TableCell>All resolved within SLA timelines</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Shareholders</TableCell>
              <TableCell>24</TableCell>
              <TableCell>0</TableCell>
              <TableCell>Majority related to dividend policy</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Employees & Workers</TableCell>
              <TableCell>42</TableCell>
              <TableCell>3</TableCell>
              <TableCell>Mostly regarding working conditions</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Customers</TableCell>
              <TableCell>156</TableCell>
              <TableCell>8</TableCell>
              <TableCell>Service quality and delivery timelines</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Value Chain Partners</TableCell>
              <TableCell>38</TableCell>
              <TableCell>5</TableCell>
              <TableCell>Payment cycles and digital integration</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h4 className="text-md font-medium mt-6 mb-2">Overview of Entity's Material Responsible Business Conduct Issues:</h4>
        <p className="mb-3">
          The company has conducted a comprehensive materiality assessment to identify ESG topics that are most relevant to its business and stakeholders in the logistics sector.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material Issue Identified</TableHead>
              <TableHead>Indicate whether risk or opportunity</TableHead>
              <TableHead>Rationale for identifying the risk/opportunity</TableHead>
              <TableHead>Approach to adapt or mitigate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>GHG Emissions from Transport</TableCell>
              <TableCell>Risk & Opportunity</TableCell>
              <TableCell>Regulatory compliance, carbon pricing, customer demand for green logistics</TableCell>
              <TableCell>Fleet modernization, modal shift to rail, alternative fuels, eco-driving</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Road Safety</TableCell>
              <TableCell>Risk</TableCell>
              <TableCell>Operational incidents, human safety, business continuity</TableCell>
              <TableCell>Driver training, vehicle maintenance, fatigue management, safety technology</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Digital Transformation</TableCell>
              <TableCell>Opportunity</TableCell>
              <TableCell>Operational efficiency, customer experience, data-driven decisions</TableCell>
              <TableCell>IoT integration, analytics platform, blockchain for transparency</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Talent Acquisition & Retention</TableCell>
              <TableCell>Risk</TableCell>
              <TableCell>Logistics skill shortages, high turnover in key positions</TableCell>
              <TableCell>Training programs, career development, improved working conditions</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Energy Transition</TableCell>
              <TableCell>Opportunity</TableCell>
              <TableCell>Cost savings, emissions reduction, stakeholder expectations</TableCell>
              <TableCell>Renewable energy for facilities, EV adoption for last-mile delivery</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransparencyDisclosures;
