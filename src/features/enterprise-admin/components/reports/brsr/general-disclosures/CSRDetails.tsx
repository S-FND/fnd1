import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { CSRDetailsData } from './types/company';

interface CSRDetailsProps {
  data?: CSRDetailsData;
}

const DEFAULT_DATA: CSRDetailsData = {
  csrRegistrationNumber: 'CSR00001246',
  totalSpendingOnCSR: '₹ 18.5 Crore (2.2% of average net profits)',
  csrCommitteeComposition: '2 Independent Directors, 1 Executive Director',
  csrFocusAreas: [
    { initiative: 'Driver Welfare Program', amount: '4.8', impact: '12,500 drivers and families benefited' },
    { initiative: 'Community Skill Development', amount: '6.2', impact: '3,800 youth trained in logistics skills' },
    { initiative: 'Environmental Initiatives', amount: '3.5', impact: '85,000 trees planted, 5 water bodies rejuvenated' },
    { initiative: 'Road Safety Awareness', amount: '2.1', impact: '120 workshops conducted, 28,000 participants' },
    { initiative: 'Healthcare Outreach', amount: '1.9', impact: '22 health camps, 18,500 beneficiaries' },
  ]
};

const CSRDetails: React.FC<CSRDetailsProps> = ({ data = DEFAULT_DATA }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">V. CSR Details</h3>

        {/* CSR Summary Info */}
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium w-1/2">CSR Registration Number</TableCell>
              <TableCell>{data.csrRegistrationNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Spending on CSR</TableCell>
              <TableCell>{data.totalSpendingOnCSR}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">CSR Committee Composition</TableCell>
              <TableCell>{data.csrCommitteeComposition}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* CSR Focus Areas */}
        <h4 className="text-md font-medium mt-4 mb-2">CSR Focus Areas:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Initiative</TableHead>
              <TableHead>Amount (₹ Crore)</TableHead>
              <TableHead>Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.csrFocusAreas.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.initiative}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.impact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CSRDetails;