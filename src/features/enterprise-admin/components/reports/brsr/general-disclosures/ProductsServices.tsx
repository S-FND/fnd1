import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { ProductsServicesData } from './types/company';

interface ProductsServicesProps {
  data?: ProductsServicesData;
}

const DEFAULT_DATA: ProductsServicesData = {
  businessActivities: [
    {
      description: 'Multimodal Transport Operations',
      nicCode: '52291',
      turnoverPercentage: '42%',
    },
    {
      description: 'Container Freight Stations & Inland Container Depots',
      nicCode: '52109',
      turnoverPercentage: '28%',
    },
    {
      description: 'Third-party Logistics (3PL) Services',
      nicCode: '52299',
      turnoverPercentage: '20%',
    },
    {
      description: 'Project Logistics',
      nicCode: '52242',
      turnoverPercentage: '10%',
    },
  ],
  businessModel: {
    overview:
      'Translog India Ltd. operates as an integrated logistics solutions provider with a nationwide network of facilities and a comprehensive service portfolio. Our business model focuses on providing end-to-end logistics solutions that combine transportation, warehousing, and value-added services through a technology-enabled platform.',
    segments: [
      {
        name: 'Multimodal Transport',
        services: ['Rail-Road Transportation', 'Container Movement', 'Coastal Shipping Integration', 'International Freight Forwarding'],
        infrastructure: '14 rail operations routes, 4,050 vehicles, 8 transshipment hubs',
      },
      {
        name: 'Container Freight Stations & ICDs',
        services: ['Container Handling', 'Customs Clearance', 'Cargo Consolidation', 'Bonded Warehousing'],
        infrastructure: '12 CFS/ICDs at major ports and inland locations with 1.8M TEU capacity',
      },
      {
        name: '3PL Services',
        services: ['Warehousing & Distribution', 'Inventory Management', 'Order Fulfillment', 'Value-Added Services'],
        infrastructure: '4.5M sq. ft. warehouse space across 16 strategic locations',
      },
    ],
  },
};

const ProductsServices: React.FC<ProductsServicesProps> = ({ data = DEFAULT_DATA }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">II. Products/Services</h3>

        {/* Business Activities Table */}
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Business Activity Description</TableHead>
              <TableHead className="w-[20%]">NIC Code</TableHead>
              <TableHead className="w-[30%]">% of Turnover</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.businessActivities.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.nicCode}</TableCell>
                <TableCell>{item.turnoverPercentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Business Model Overview */}
        <h4 className="text-md font-medium mt-6 mb-2">Business Model Overview:</h4>
        <p className="mb-4">{data.businessModel.overview}</p>

        {/* Business Segments Table */}
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Business Segment</TableHead>
              <TableHead className="w-[40%]">Key Services</TableHead>
              <TableHead className="w-[30%]">Infrastructure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.businessModel.segments.map((segment, index) => (
              <TableRow key={index}>
                <TableCell>{segment.name}</TableCell>
                <TableCell>
                  <ul className="list-disc pl-4">
                    {segment.services.map((service, i) => (
                      <li key={i}>{service}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{segment.infrastructure}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductsServices;