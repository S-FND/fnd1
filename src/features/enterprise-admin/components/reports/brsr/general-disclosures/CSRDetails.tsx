
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

const CSRDetails: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">V. CSR Details</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium w-1/2">CSR Registration Number</TableCell>
              <TableCell>CSR00001246</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Spending on CSR</TableCell>
              <TableCell>₹ 18.5 Crore (2.2% of average net profits)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">CSR Committee Composition</TableCell>
              <TableCell>2 Independent Directors, 1 Executive Director</TableCell>
            </TableRow>
          </TableBody>
        </Table>

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
            <TableRow>
              <TableCell>Driver Welfare Program</TableCell>
              <TableCell>4.8</TableCell>
              <TableCell>12,500 drivers and families benefited</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Community Skill Development</TableCell>
              <TableCell>6.2</TableCell>
              <TableCell>3,800 youth trained in logistics skills</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Environmental Initiatives</TableCell>
              <TableCell>3.5</TableCell>
              <TableCell>85,000 trees planted, 5 water bodies rejuvenated</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Road Safety Awareness</TableCell>
              <TableCell>2.1</TableCell>
              <TableCell>120 workshops conducted, 28,000 participants</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Healthcare Outreach</TableCell>
              <TableCell>1.9</TableCell>
              <TableCell>22 health camps, 18,500 beneficiaries</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CSRDetails;
