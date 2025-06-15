
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

const ProductsServices: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">II. Products/Services</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Activity Description</TableHead>
              <TableHead>NIC Code</TableHead>
              <TableHead>% of Turnover</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Multimodal Transport Operations</TableCell>
              <TableCell>52291</TableCell>
              <TableCell>42%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Container Freight Stations & Inland Container Depots</TableCell>
              <TableCell>52109</TableCell>
              <TableCell>28%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Third-party Logistics (3PL) Services</TableCell>
              <TableCell>52299</TableCell>
              <TableCell>20%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Project Logistics</TableCell>
              <TableCell>52242</TableCell>
              <TableCell>10%</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h4 className="text-md font-medium mt-6 mb-2">Business Model Overview:</h4>
        <p className="mb-4">
          Translog India Ltd. operates as an integrated logistics solutions provider with a nationwide network of facilities and a comprehensive service portfolio. Our business model focuses on providing end-to-end logistics solutions that combine transportation, warehousing, and value-added services through a technology-enabled platform.
        </p>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Segment</TableHead>
              <TableHead>Key Services</TableHead>
              <TableHead>Infrastructure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Multimodal Transport</TableCell>
              <TableCell>
                <ul className="list-disc pl-4">
                  <li>Rail-Road Transportation</li>
                  <li>Container Movement</li>
                  <li>Coastal Shipping Integration</li>
                  <li>International Freight Forwarding</li>
                </ul>
              </TableCell>
              <TableCell>14 rail operations routes, 4,050 vehicles, 8 transshipment hubs</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Container Freight Stations & ICDs</TableCell>
              <TableCell>
                <ul className="list-disc pl-4">
                  <li>Container Handling</li>
                  <li>Customs Clearance</li>
                  <li>Cargo Consolidation</li>
                  <li>Bonded Warehousing</li>
                </ul>
              </TableCell>
              <TableCell>12 CFS/ICDs at major ports and inland locations with 1.8M TEU capacity</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3PL Services</TableCell>
              <TableCell>
                <ul className="list-disc pl-4">
                  <li>Warehousing & Distribution</li>
                  <li>Inventory Management</li>
                  <li>Order Fulfillment</li>
                  <li>Value-Added Services</li>
                </ul>
              </TableCell>
              <TableCell>4.5M sq. ft. warehouse space across 16 strategic locations</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductsServices;
