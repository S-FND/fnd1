
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ResourceUsageTable: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Consumption</TableHead>
              <TableHead>YOY Change</TableHead>
              <TableHead>Impact Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Water (m³)</TableCell>
              <TableCell>145,000</TableCell>
              <TableCell className="text-green-600">-8.2%</TableCell>
              <TableCell>Medium Positive</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Energy (MWh)</TableCell>
              <TableCell>12,450</TableCell>
              <TableCell className="text-green-600">-5.7%</TableCell>
              <TableCell>Medium Positive</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Raw Materials (tons)</TableCell>
              <TableCell>28,700</TableCell>
              <TableCell className="text-green-600">-3.1%</TableCell>
              <TableCell>Low Positive</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResourceUsageTable;
