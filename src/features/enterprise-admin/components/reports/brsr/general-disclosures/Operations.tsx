
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

const Operations: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">III. Operations</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Number of Facilities</TableHead>
              <TableHead>Number of Offices</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>National (India)</TableCell>
              <TableCell>28 (12 CFS/ICDs, 16 Warehouses)</TableCell>
              <TableCell>24</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>International</TableCell>
              <TableCell>6 (4 Warehouses, 2 Distribution Centers)</TableCell>
              <TableCell>8</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h4 className="text-md font-medium mt-6 mb-2">Key Operational Statistics:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parameter</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Container Handling Capacity</TableCell>
              <TableCell>1.8 million TEUs per annum</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Warehousing Space</TableCell>
              <TableCell>4.5 million sq. ft. across India</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fleet Size</TableCell>
              <TableCell>1,250 owned vehicles, 2,800 partner vehicles</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rail Operations</TableCell>
              <TableCell>14 train sets operating on 8 major routes</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Annual Cargo Volume</TableCell>
              <TableCell>22 million tons</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Digital Tracking Coverage</TableCell>
              <TableCell>100% of fleet with real-time visibility</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Customs Processing</TableCell>
              <TableCell>650,000 documents annually</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Annual Container Movements</TableCell>
              <TableCell>1.2 million TEUs</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h4 className="text-md font-medium mt-6 mb-2">Major Operational Locations:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City/Region</TableHead>
              <TableHead>Facility Type</TableHead>
              <TableHead>Key Capabilities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>JNPT (Mumbai)</TableCell>
              <TableCell>CFS + Warehouse</TableCell>
              <TableCell>400,000 TEU capacity, 120,000 sq.ft. warehouse</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Chennai</TableCell>
              <TableCell>CFS + ICD</TableCell>
              <TableCell>250,000 TEU capacity, rail siding</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Delhi NCR</TableCell>
              <TableCell>ICD + Distribution Center</TableCell>
              <TableCell>300,000 TEU capacity, 500,000 sq.ft. fulfillment center</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mundra</TableCell>
              <TableCell>CFS</TableCell>
              <TableCell>200,000 TEU capacity, cold chain facilities</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bangalore</TableCell>
              <TableCell>Logistics Park</TableCell>
              <TableCell>350,000 sq.ft. warehouse, cross-dock facilities</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Operations;
