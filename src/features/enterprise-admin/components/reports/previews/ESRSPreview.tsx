
import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ESRSPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">ESRS Report Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        European Sustainability Reporting Standards | FY 2023-24
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">ESRS 1: General Requirements</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Sustainability statement</TableCell>
            <TableCell>Board approved and publicly disclosed</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Double materiality assessment</TableCell>
            <TableCell>Completed and validated by third party</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Value chain assessment</TableCell>
            <TableCell>100% of tier 1 suppliers, 65% of tier 2 suppliers</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">ESRS 2: General Disclosures</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Strategy & Business Model</p>
          <p className="text-xs text-muted-foreground">Sustainability integrated into core operations</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Governance & Organization</p>
          <p className="text-xs text-muted-foreground">Board oversight, ESG committee established</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Policies & Targets</p>
          <p className="text-xs text-muted-foreground">12 sustainability policies, 8 targets set</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Stakeholder Engagement</p>
          <p className="text-xs text-muted-foreground">8 key stakeholder groups engaged</p>
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Thematic Standards (ESRS 3-12)</h4>
      <Separator className="my-2" />
      <h5 className="text-sm font-medium mb-1">Climate Change (ESRS E1)</h5>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">GHG emissions</TableCell>
            <TableCell>12% reduction year-over-year</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Energy consumption</TableCell>
            <TableCell>27,450 MWh, 22% renewable sources</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <Separator className="my-2" />
      <h5 className="text-sm font-medium mb-1">Biodiversity & Ecosystems (ESRS E4)</h5>
      <p className="text-xs mb-2">Key initiatives:</p>
      <ul className="list-disc pl-4 text-xs">
        <li>Natural habitat protection around logistics facilities</li>
        <li>Biodiversity impact assessment completed for 85% of operations</li>
      </ul>
      
      <Separator className="my-2" />
      <h5 className="text-sm font-medium mb-1">Human Rights (ESRS S1)</h5>
      <p className="text-xs mb-2">Due diligence process:</p>
      <ul className="list-disc pl-4 text-xs">
        <li>Human rights policy implemented across all operations</li>
        <li>Supply chain due diligence covering 80% of critical suppliers</li>
        <li>Grievance mechanisms accessible to all stakeholders</li>
      </ul>
    </div>
  </div>
);

export default ESRSPreview;
