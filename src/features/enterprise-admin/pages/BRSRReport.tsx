
import React from 'react';
import ReportViewer from '../components/reports/ReportViewer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const BRSRReport: React.FC = () => {
  return (
    <ReportViewer title="BRSR Report" reportType="BRSR">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Section A: General Disclosures</h2>
          
          <div className="space-y-6">
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
                  <TableRow>
                    <TableCell className="font-medium">Corporate Address</TableCell>
                    <TableCell>Tower A, Business Park, Bandra Kurla Complex, Mumbai - 400051</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>sustainability@fandoro.com</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Telephone</TableCell>
                    <TableCell>+91-22-12345678</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Website</TableCell>
                    <TableCell>www.fandoroenterprises.com</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Financial Year Reported</TableCell>
                    <TableCell>2023-24</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">II. Products/Services</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Activity Description</TableHead>
                    <TableHead>NIC Code</TableHead>
                    <TableHead>% of Turnover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Sustainable Manufacturing</TableCell>
                    <TableCell>29102</TableCell>
                    <TableCell>65%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Environmental Consulting</TableCell>
                    <TableCell>74909</TableCell>
                    <TableCell>35%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">III. Operations</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Number of Plants</TableHead>
                    <TableHead>Number of Offices</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>National (India)</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>12</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>International</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>5</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">IV. Employees</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Permanent</TableHead>
                    <TableHead>Temporary/Contractual</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Male</TableCell>
                    <TableCell>1,250</TableCell>
                    <TableCell>420</TableCell>
                    <TableCell>1,670</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Female</TableCell>
                    <TableCell>980</TableCell>
                    <TableCell>300</TableCell>
                    <TableCell>1,280</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Others</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>35</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell className="font-medium">2,255</TableCell>
                    <TableCell className="font-medium">730</TableCell>
                    <TableCell className="font-medium">2,985</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
        
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
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Section C: Principle-wise Performance</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Principle 1: Ethics, Transparency and Accountability</h3>
              <Separator className="my-2" />
              
              <p className="mt-2">
                The company has established robust governance mechanisms that ensure ethical conduct across all business operations. Our Code of Conduct covers 100% of our employees and extends to our supply chain partners. During the reporting period:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Zero confirmed incidents of corruption</li>
                <li>100% of employees received ethics training</li>
                <li>24 stakeholder complaints received, 23 resolved (96% resolution rate)</li>
                <li>Three independent directors serving on the Board's Ethics Committee</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Principle 2: Safety and Sustainability of Products & Services</h3>
              <Separator className="my-2" />
              
              <p className="mt-2">
                Our product development process incorporates life-cycle sustainability assessments for all new products.
              </p>
              
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Current Usage</TableHead>
                    <TableHead>Reduction during sourcing/production/distribution</TableHead>
                    <TableHead>Reduction during usage by consumers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Energy</TableCell>
                    <TableCell>12,450 MWh</TableCell>
                    <TableCell>15% reduction</TableCell>
                    <TableCell>22% reduction</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Water</TableCell>
                    <TableCell>145,000 m³</TableCell>
                    <TableCell>8% reduction</TableCell>
                    <TableCell>12% reduction</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Raw Materials</TableCell>
                    <TableCell>28,700 tons</TableCell>
                    <TableCell>5% reduction</TableCell>
                    <TableCell>N/A</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Principle 3: Employee Well-being</h3>
              <Separator className="my-2" />
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Accessibility of workplaces</TableCell>
                    <TableCell>85% facilities fully accessible</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Return to work and retention rates after parental leave</TableCell>
                    <TableCell>92% return rate, 85% retention (one year)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Grievance redressal mechanism for employees</TableCell>
                    <TableCell>Yes, online portal and anonymous hotline</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Safety incidents</TableCell>
                    <TableCell>LTIFR: 0.3, Zero fatalities</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Section D: ESG Assurance</h2>
          
          <div>
            <h3 className="text-lg font-semibold">Independent Assurance</h3>
            <p className="mt-2">
              The ESG disclosures contained in this BRSR report have been independently assured by EY India as per AA1000 Assurance Standard. The scope of assurance covered environmental and social parameters based on materiality assessment. The assurance statement is available as an annexure to this report.
            </p>
          </div>
        </section>
      </div>
    </ReportViewer>
  );
};

export default BRSRReport;
