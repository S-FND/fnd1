
import React from 'react';
import ReportViewer from '../components/reports/ReportViewer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

const GRIReport: React.FC = () => {
  return (
    <ReportViewer title="GRI Report" reportType="GRI">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">GRI 102: General Disclosures</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Organizational Profile</h3>
              <Separator className="my-2" />
              
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">GRI 102-1: Name of the organization</TableCell>
                    <TableCell>Fandoro Enterprises Ltd.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GRI 102-2: Activities, brands, products, and services</TableCell>
                    <TableCell>Sustainable Manufacturing, Environmental Consulting</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GRI 102-3: Location of headquarters</TableCell>
                    <TableCell>Mumbai, India</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GRI 102-4: Location of operations</TableCell>
                    <TableCell>India, Singapore, UAE</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Strategy</h3>
              <Separator className="my-2" />
              
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">GRI 102-14: Statement from senior decision-maker</TableCell>
                    <TableCell>
                      <p>"Our commitment to sustainable development remains unwavering as we navigate global challenges..."</p>
                      <p className="text-sm text-muted-foreground mt-2">- CEO, Fandoro Enterprises</p>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Ethics and Integrity</h3>
              <Separator className="my-2" />
              
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">GRI 102-16: Values, principles, standards, and norms of behavior</TableCell>
                    <TableCell>
                      Fandoro's core values include environmental stewardship, social responsibility, and ethical governance.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">GRI 300: Environmental Standards</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">GRI 302: Energy</h3>
              <Separator className="my-2" />
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disclosure</TableHead>
                    <TableHead>2023</TableHead>
                    <TableHead>2022</TableHead>
                    <TableHead>% Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">GRI 302-1: Energy consumption (MWh)</TableCell>
                    <TableCell>12,450</TableCell>
                    <TableCell>13,200</TableCell>
                    <TableCell className="text-green-600">-5.7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GRI 302-3: Energy intensity (MWh/revenue)</TableCell>
                    <TableCell>0.45</TableCell>
                    <TableCell>0.52</TableCell>
                    <TableCell className="text-green-600">-13.5%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">GRI 305: Emissions</h3>
              <Separator className="my-2" />
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disclosure</TableHead>
                    <TableHead>2023</TableHead>
                    <TableHead>2022</TableHead>
                    <TableHead>% Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">GRI 305-1: Direct (Scope 1) GHG emissions (tCO2e)</TableCell>
                    <TableCell>4,820</TableCell>
                    <TableCell>5,100</TableCell>
                    <TableCell className="text-green-600">-5.5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GRI 305-2: Indirect (Scope 2) GHG emissions (tCO2e)</TableCell>
                    <TableCell>9,350</TableCell>
                    <TableCell>10,200</TableCell>
                    <TableCell className="text-green-600">-8.3%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>
    </ReportViewer>
  );
};

export default GRIReport;
