import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { TransparencyDisclosuresData } from './types/company';

interface TransparencyDisclosuresProps {
  data?: TransparencyDisclosuresData;
}

const DEFAULT_DATA: TransparencyDisclosuresData = {
  grievances: [
    { stakeholderGroup: 'Communities', filedDuringYear: '18', pendingResolution: '1', remarks: 'Primarily related to noise from operations' },
    { stakeholderGroup: 'Investors', filedDuringYear: '12', pendingResolution: '0', remarks: 'All resolved within SLA timelines' },
    { stakeholderGroup: 'Shareholders', filedDuringYear: '24', pendingResolution: '0', remarks: 'Majority related to dividend policy' },
    { stakeholderGroup: 'Employees & Workers', filedDuringYear: '42', pendingResolution: '3', remarks: 'Mostly regarding working conditions' },
    { stakeholderGroup: 'Customers', filedDuringYear: '156', pendingResolution: '8', remarks: 'Service quality and delivery timelines' },
    { stakeholderGroup: 'Value Chain Partners', filedDuringYear: '38', pendingResolution: '5', remarks: 'Payment cycles and digital integration' },
  ],
  materialIssues: [
    {
      materialIssueIdentified: 'GHG Emissions from Transport',
      riskOrOpportunity: 'Risk & Opportunity',
      rationale: 'Regulatory compliance, carbon pricing, customer demand for green logistics',
      approachToAdaptOrMitigate: 'Fleet modernization, modal shift to rail, alternative fuels, eco-driving'
    },
    {
      materialIssueIdentified: 'Road Safety',
      riskOrOpportunity: 'Risk',
      rationale: 'Operational incidents, human safety, business continuity',
      approachToAdaptOrMitigate: 'Driver training, vehicle maintenance, fatigue management, safety technology'
    },
    {
      materialIssueIdentified: 'Digital Transformation',
      riskOrOpportunity: 'Opportunity',
      rationale: 'Operational efficiency, customer experience, data-driven decisions',
      approachToAdaptOrMitigate: 'IoT integration, analytics platform, blockchain for transparency'
    },
    {
      materialIssueIdentified: 'Talent Acquisition & Retention',
      riskOrOpportunity: 'Risk',
      rationale: 'Logistics skill shortages, high turnover in key positions',
      approachToAdaptOrMitigate: 'Training programs, career development, improved working conditions'
    },
    {
      materialIssueIdentified: 'Energy Transition',
      riskOrOpportunity: 'Opportunity',
      rationale: 'Cost savings, emissions reduction, stakeholder expectations',
      approachToAdaptOrMitigate: 'Renewable energy for facilities, EV adoption for last-mile delivery'
    },
  ]
};

const TransparencyDisclosures: React.FC<TransparencyDisclosuresProps> = ({ data = DEFAULT_DATA }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">VI. Transparency and Disclosures</h3>

        {/* Grievances Section */}
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
            {data.grievances.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.stakeholderGroup}</TableCell>
                <TableCell>{item.filedDuringYear}</TableCell>
                <TableCell>{item.pendingResolution}</TableCell>
                <TableCell>{item.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Material Issues Section */}
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
            {data.materialIssues.map((issue, index) => (
              <TableRow key={index}>
                <TableCell>{issue.materialIssueIdentified}</TableCell>
                <TableCell>{issue.riskOrOpportunity}</TableCell>
                <TableCell>{issue.rationale}</TableCell>
                <TableCell>{issue.approachToAdaptOrMitigate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransparencyDisclosures;