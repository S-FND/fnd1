
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CommunityImpactTable: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program</TableHead>
              <TableHead>Beneficiaries</TableHead>
              <TableHead>Investment</TableHead>
              <TableHead>Impact Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Clean Water Initiative</TableCell>
              <TableCell>5,200 people</TableCell>
              <TableCell>$320,000</TableCell>
              <TableCell>High Positive</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>STEM Education Support</TableCell>
              <TableCell>3,500 students</TableCell>
              <TableCell>$280,000</TableCell>
              <TableCell>Medium Positive</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Healthcare Access Program</TableCell>
              <TableCell>1,800 people</TableCell>
              <TableCell>$175,000</TableCell>
              <TableCell>Medium Positive</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CommunityImpactTable;
