
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ManagementDisclosures: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section B: Management and Process Disclosures</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Policy and Management Processes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Coverage of various principles under the National Guidelines on Responsible Business Conduct (NGRBC)
          </p>
          
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Disclosure Questions</TableHead>
                <TableHead>P1 - Ethics</TableHead>
                <TableHead>P2 - Safety</TableHead>
                <TableHead>P3 - Wellbeing</TableHead>
                <TableHead>P4 - Stakeholders</TableHead>
                <TableHead>P5 - Human Rights</TableHead>
                <TableHead>P6 - Environment</TableHead>
                <TableHead>P7 - Advocacy</TableHead>
                <TableHead>P8 - Inclusive Growth</TableHead>
                <TableHead>P9 - Customer Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Policy formulation approved by Board</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Policies conforming to national/international standards</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>No</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Policy approved by designated stakeholders</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Board committee to oversee implementation</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Yes</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Governance, Leadership and Oversight</h3>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Statement by Director Responsible for BRSR</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                "At Fandoro Enterprises, we recognize that Environmental, Social, and Governance (ESG) factors are integral to our long-term business strategy. Our Board is committed to maintaining high standards of sustainability performance across our operations. We have integrated ESG considerations into our risk management framework and regularly review our progress against established sustainability goals."
              </p>
              <p className="text-sm mt-3">
                "This Business Responsibility and Sustainability Report (BRSR) has been prepared in accordance with the SEBI guidelines and represents our commitment to transparent disclosure of sustainability performance."
              </p>
              <p className="text-sm font-medium mt-4">Mr. Rajesh Kumar</p>
              <p className="text-sm">Chairperson, Sustainability Committee</p>
              <p className="text-sm">DIN: 01234567</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ManagementDisclosures;
