
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const BRSRPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">BRSR Report Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Financial Year: 2023-24 | Generated on: {new Date().toLocaleDateString()}
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Section A: General Disclosures</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Corporate Identity Number</TableCell>
            <TableCell>L63030MH1995PLC089758</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Company Name</TableCell>
            <TableCell>Translog India Ltd.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Year of Incorporation</TableCell>
            <TableCell>1995</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Section B: Management and Process Disclosures</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Policy for business ethics</TableCell>
            <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Yes</Badge></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ESG risks in overall risk management</TableCell>
            <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Yes</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Section C: Principle-wise Performance</h4>
      <p className="text-sm mb-2">Key metrics across the 9 principles of BRSR:</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Principle 1: Ethics & Transparency</p>
          <p className="text-xs text-muted-foreground">0 corruption incidents</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Principle 2: Product Lifecycle</p>
          <p className="text-xs text-muted-foreground">15% reduction in resource use</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Principle 3: Employee Well-being</p>
          <p className="text-xs text-muted-foreground">98.5% health coverage</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Principle 4: Stakeholders</p>
          <p className="text-xs text-muted-foreground">12 engagement programs</p>
        </div>
      </div>
    </div>
  </div>
);

export default BRSRPreview;
