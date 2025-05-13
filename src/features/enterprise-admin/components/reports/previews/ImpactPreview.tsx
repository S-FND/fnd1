
import React from 'react';
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ImpactPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">Impact Assessment Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Environmental and Social Impact Analysis | FY 2023-24
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Environmental Impact</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Impact Category</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Change (YoY)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>GHG Emissions</TableCell>
            <TableCell>22,170 tCO₂e</TableCell>
            <TableCell className="text-green-600">-15.1%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Water Consumption</TableCell>
            <TableCell>125,000 m³</TableCell>
            <TableCell className="text-green-600">-8.2%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Waste Generation</TableCell>
            <TableCell>4,850 tonnes</TableCell>
            <TableCell className="text-green-600">-5.7%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Habitat Restoration</TableCell>
            <TableCell>45 hectares</TableCell>
            <TableCell className="text-green-600">+12 hectares</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Social Impact</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Workforce Development</p>
          <ul className="list-disc pl-4 text-xs">
            <li>120 new jobs in underserved communities</li>
            <li>42 hours of training per employee</li>
          </ul>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Community Engagement</p>
          <ul className="list-disc pl-4 text-xs">
            <li>₹18.5 Crore invested in CSR</li>
            <li>10,000+ community program beneficiaries</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">SDG Contributions</h4>
      <div className="grid grid-cols-3 gap-2">
        <Badge variant="outline" className="justify-center py-1">
          SDG 8: Decent Work
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 9: Industry & Innovation
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 11: Sustainable Cities
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 12: Responsible Consumption
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 13: Climate Action
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 17: Partnerships
        </Badge>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Impact Recommendations</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Area</TableHead>
            <TableHead>Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Environmental</TableCell>
            <TableCell>Accelerate renewable energy transition for warehouses</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Social</TableCell>
            <TableCell>Scale up driver welfare and apprenticeship programs</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Governance</TableCell>
            <TableCell>Enhance ESG data collection and verification processes</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
);

export default ImpactPreview;
