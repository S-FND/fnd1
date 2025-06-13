
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ClimateImpactTable: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Climate Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Impact Category</TableHead>
              <TableHead>Baseline (2020)</TableHead>
              <TableHead>Current (2023)</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Impact Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>GHG Emissions (tCO2e)</TableCell>
              <TableCell>38,500</TableCell>
              <TableCell>32,670</TableCell>
              <TableCell className="text-green-600">-15.1%</TableCell>
              <TableCell>Medium Positive</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Carbon Offset Projects (tCO2e)</TableCell>
              <TableCell>5,000</TableCell>
              <TableCell>12,000</TableCell>
              <TableCell className="text-green-600">+140%</TableCell>
              <TableCell>High Positive</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Climate Adaptation Investments ($)</TableCell>
              <TableCell>250,000</TableCell>
              <TableCell>750,000</TableCell>
              <TableCell className="text-green-600">+200%</TableCell>
              <TableCell>High Positive</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClimateImpactTable;
