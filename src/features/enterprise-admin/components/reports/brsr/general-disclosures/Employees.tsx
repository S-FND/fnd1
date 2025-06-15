
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

const Employees: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">IV. Employees</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Permanent</TableHead>
              <TableHead>Temporary/Contractual</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Male</TableCell>
              <TableCell>3,850</TableCell>
              <TableCell>1,250</TableCell>
              <TableCell>5,100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Female</TableCell>
              <TableCell>1,120</TableCell>
              <TableCell>380</TableCell>
              <TableCell>1,500</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Others</TableCell>
              <TableCell>35</TableCell>
              <TableCell>12</TableCell>
              <TableCell>47</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total</TableCell>
              <TableCell className="font-medium">5,005</TableCell>
              <TableCell className="font-medium">1,642</TableCell>
              <TableCell className="font-medium">6,647</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h4 className="text-md font-medium mt-6 mb-2">Employee Distribution by Function:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Function</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Operations</TableCell>
              <TableCell>3,945</TableCell>
              <TableCell>59.4%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sales & Marketing</TableCell>
              <TableCell>865</TableCell>
              <TableCell>13.0%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Technology & Digital</TableCell>
              <TableCell>520</TableCell>
              <TableCell>7.8%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Administration</TableCell>
              <TableCell>635</TableCell>
              <TableCell>9.6%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Finance & Accounting</TableCell>
              <TableCell>420</TableCell>
              <TableCell>6.3%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Management</TableCell>
              <TableCell>262</TableCell>
              <TableCell>3.9%</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h4 className="text-md font-medium mt-6 mb-2">Logistics-Specific Workforce:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>% Change YoY</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Professional Drivers</TableCell>
              <TableCell>1,280</TableCell>
              <TableCell>+8.5%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Warehouse Operators</TableCell>
              <TableCell>1,540</TableCell>
              <TableCell>+12.2%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Container Yard Operations</TableCell>
              <TableCell>620</TableCell>
              <TableCell>+5.1%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Equipment Operators</TableCell>
              <TableCell>385</TableCell>
              <TableCell>+3.8%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rail Operations Team</TableCell>
              <TableCell>210</TableCell>
              <TableCell>+15.4%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Employees;
