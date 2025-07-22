import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { EmployeesData } from './types/company';

interface EmployeesProps {
  data?: EmployeesData;
}

const DEFAULT_DATA: EmployeesData = {
  genderStats: [
    { category: 'Male', permanent: '3,850', contractual: '1,250', total: '5,100' },
    { category: 'Female', permanent: '1,120', contractual: '380', total: '1,500' },
    { category: 'Others', permanent: '35', contractual: '12', total: '47' },
    { category: 'Total', permanent: '5,005', contractual: '1,642', total: '6,647' },
  ],
  functionDistribution: [
    { function: 'Operations', number: '3,945', percentage: '59.4%' },
    { function: 'Sales & Marketing', number: '865', percentage: '13.0%' },
    { function: 'Technology & Digital', number: '520', percentage: '7.8%' },
    { function: 'Administration', number: '635', percentage: '9.6%' },
    { function: 'Finance & Accounting', number: '420', percentage: '6.3%' },
    { function: 'Management', number: '262', percentage: '3.9%' },
  ],
  logisticsWorkforce: [
    { category: 'Professional Drivers', number: '1,280', changeYoY: '+8.5%' },
    { category: 'Warehouse Operators', number: '1,540', changeYoY: '+12.2%' },
    { category: 'Container Yard Operations', number: '620', changeYoY: '+5.1%' },
    { category: 'Equipment Operators', number: '385', changeYoY: '+3.8%' },
    { category: 'Rail Operations Team', number: '210', changeYoY: '+15.4%' },
  ]
};

const Employees: React.FC<EmployeesProps> = ({ data = DEFAULT_DATA }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">IV. Employees</h3>

        {/* Gender Stats Table */}
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
            {data.genderStats.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.permanent}</TableCell>
                <TableCell>{row.contractual}</TableCell>
                <TableCell>{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Function Distribution */}
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
            {data.functionDistribution.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.function}</TableCell>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.percentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Logistics Workforce */}
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
            {data.logisticsWorkforce.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.changeYoY}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Employees;