
import React from 'react';
import ReportViewer from '../components/reports/ReportViewer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const BRSRReport: React.FC = () => {
  return (
    <ReportViewer title="BRSR Report" reportType="BRSR">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Section A: General Disclosures</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">I. Company Details</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">Corporate Identity Number (CIN)</TableCell>
                    <TableCell>L12345MH2000PLC123456</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Company Name</TableCell>
                    <TableCell>Fandoro Enterprises Ltd.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Year of Incorporation</TableCell>
                    <TableCell>2000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Registered Office Address</TableCell>
                    <TableCell>123 Sustainability Street, Mumbai - 400001</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">II. Products/Services</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Activity</TableHead>
                    <TableHead>% of Turnover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Sustainable Manufacturing</TableCell>
                    <TableCell>65%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Environmental Consulting</TableCell>
                    <TableCell>35%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Section B: Management and Process Disclosures</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Policy and Management Processes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Coverage of various principles under the National Guidelines on Responsible Business Conduct (NGRBC)
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disclosure Questions</TableHead>
                    <TableHead>P1</TableHead>
                    <TableHead>P2</TableHead>
                    <TableHead>P3</TableHead>
                    <TableHead>P4</TableHead>
                    <TableHead>P5</TableHead>
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
                  </TableRow>
                  <TableRow>
                    <TableCell>Policies conforming to national/international standards</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>Yes</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Section C: Principle-wise Performance</h2>
          <p>Auto-populated content based on GHG accounting data and ESG management data in the system.</p>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Principle 1: Ethics, Transparency and Accountability</h3>
            <p className="mt-2">The company has established robust governance mechanisms that ensure ethical conduct...</p>
          </div>
        </section>
      </div>
    </ReportViewer>
  );
};

export default BRSRReport;
