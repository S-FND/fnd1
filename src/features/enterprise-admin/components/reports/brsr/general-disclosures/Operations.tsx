import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { OperationsData } from './types/company';

interface OperationsProps {
  data?: OperationsData;
}

const DEFAULT_DATA: OperationsData = {
  operationalLocations: [
    {
      location: 'National (India)',
      facilitiesCount: '28 (12 CFS/ICDs, 16 Warehouses)',
      officesCount: '24',
    },
    {
      location: 'International',
      facilitiesCount: '6 (4 Warehouses, 2 Distribution Centers)',
      officesCount: '8',
    },
  ],
  keyStatistics: [
    { parameter: 'Container Handling Capacity', details: '1.8 million TEUs per annum' },
    { parameter: 'Warehousing Space', details: '4.5 million sq. ft. across India' },
    { parameter: 'Fleet Size', details: '1,250 owned vehicles, 2,800 partner vehicles' },
    { parameter: 'Rail Operations', details: '14 train sets operating on 8 major routes' },
    { parameter: 'Annual Cargo Volume', details: '22 million tons' },
    { parameter: 'Digital Tracking Coverage', details: '100% of fleet with real-time visibility' },
    { parameter: 'Customs Processing', details: '650,000 documents annually' },
    { parameter: 'Annual Container Movements', details: '1.2 million TEUs' },
  ],
  majorLocations: [
    { cityRegion: 'JNPT (Mumbai)', facilityType: 'CFS + Warehouse', capabilities: '400,000 TEU capacity, 120,000 sq.ft. warehouse' },
    { cityRegion: 'Chennai', facilityType: 'CFS + ICD', capabilities: '250,000 TEU capacity, rail siding' },
    { cityRegion: 'Delhi NCR', facilityType: 'ICD + Distribution Center', capabilities: '300,000 TEU capacity, 500,000 sq.ft. fulfillment center' },
    { cityRegion: 'Mundra', facilityType: 'CFS', capabilities: '200,000 TEU capacity, cold chain facilities' },
    { cityRegion: 'Bangalore', facilityType: 'Logistics Park', capabilities: '350,000 sq.ft. warehouse, cross-dock facilities' },
  ]
};

const Operations: React.FC<OperationsProps> = ({ data = DEFAULT_DATA }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">III. Operations</h3>

        {/* Operational Locations */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Number of Facilities</TableHead>
              <TableHead>Number of Offices</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.operationalLocations.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.facilitiesCount}</TableCell>
                <TableCell>{item.officesCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Key Statistics */}
        <h4 className="text-md font-medium mt-6 mb-2">Key Operational Statistics:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parameter</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.keyStatistics.map((stat, index) => (
              <TableRow key={index}>
                <TableCell>{stat.parameter}</TableCell>
                <TableCell>{stat.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Major Locations */}
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
            {data.majorLocations.map((location, index) => (
              <TableRow key={index}>
                <TableCell>{location.cityRegion}</TableCell>
                <TableCell>{location.facilityType}</TableCell>
                <TableCell>{location.capabilities}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Operations;