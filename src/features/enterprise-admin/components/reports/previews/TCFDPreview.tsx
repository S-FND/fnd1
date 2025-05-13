
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

const TCFDPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">TCFD Report Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Climate-related Financial Disclosures | FY 2023-24
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Governance</h4>
      <p className="text-sm mb-2">Board oversight and management's role in assessing and managing climate-related risks and opportunities:</p>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Board Oversight</TableCell>
            <TableCell>
              <ul className="list-disc pl-4 text-sm">
                <li>Quarterly Sustainability Committee meetings</li>
                <li>Board-approved Climate Strategy</li>
              </ul>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Management Role</TableCell>
            <TableCell>
              <ul className="list-disc pl-4 text-sm">
                <li>CSO reports directly to CEO</li>
                <li>Climate targets linked to executive compensation</li>
              </ul>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Strategy</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Short-term (0-3 years)</p>
          <ul className="list-disc pl-4 text-xs">
            <li>Fuel efficiency programs</li>
            <li>Route optimization</li>
          </ul>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Medium-term (3-10 years)</p>
          <ul className="list-disc pl-4 text-xs">
            <li>Fleet electrification</li>
            <li>Renewable energy transition</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Risk Management</h4>
      <p className="text-sm mb-2">Climate risks integrated into Enterprise Risk Management:</p>
      <div className="border rounded-md p-2">
        <p className="text-xs font-medium">Physical Risks:</p>
        <ul className="list-disc pl-4 text-xs">
          <li>Disruption to operations from extreme weather</li>
          <li>Damage to infrastructure</li>
        </ul>
      </div>
      <div className="border rounded-md p-2 mt-2">
        <p className="text-xs font-medium">Transition Risks:</p>
        <ul className="list-disc pl-4 text-xs">
          <li>Carbon pricing mechanisms</li>
          <li>Shift to low-carbon technologies</li>
        </ul>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Metrics & Targets</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Total Emissions</TableCell>
            <TableCell>22,170 tCO₂e (Scope 1 & 2)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Emission Intensity</TableCell>
            <TableCell>18.2 tCO₂e per million revenue</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">2030 Target</TableCell>
            <TableCell>50% reduction in absolute emissions</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">2050 Target</TableCell>
            <TableCell>Net-zero emissions</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
);

export default TCFDPreview;
