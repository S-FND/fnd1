
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const GRIPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">GRI Report Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Reporting Period: April 2023 - March 2024
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">GRI 102: General Disclosures</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">102-1 Organization name</TableCell>
            <TableCell>Translog India Ltd.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">102-2 Activities, brands, products, services</TableCell>
            <TableCell>Integrated logistics solutions provider</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">102-3 Headquarters location</TableCell>
            <TableCell>Mumbai, India</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">GRI 300: Environmental Standards</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">GRI 302: Energy</p>
          <p className="text-xs text-muted-foreground">Total consumption: 27,450 MWh</p>
          <p className="text-xs text-muted-foreground">Renewable energy: 22%</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">GRI 303: Water</p>
          <p className="text-xs text-muted-foreground">Total withdrawal: 125,000 m³</p>
          <p className="text-xs text-muted-foreground">Recycled: 35%</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">GRI 305: Emissions</p>
          <p className="text-xs text-muted-foreground">Scope 1: 15,280 tCO₂e</p>
          <p className="text-xs text-muted-foreground">Scope 2: 6,890 tCO₂e</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">GRI 306: Waste</p>
          <p className="text-xs text-muted-foreground">Total waste: 4,850 tonnes</p>
          <p className="text-xs text-muted-foreground">Recycled: 62%</p>
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">GRI 400: Social Standards</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">GRI 401: Employment</TableCell>
            <TableCell>6,647 employees, 22% women, 8.5% turnover rate</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">GRI 403: Health & Safety</TableCell>
            <TableCell>0 fatalities, LTIFR 0.3, 16 safety training hours/employee</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
);

export default GRIPreview;
