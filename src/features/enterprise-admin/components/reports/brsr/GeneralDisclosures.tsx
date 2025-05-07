
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

const GeneralDisclosures: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section A: General Disclosures</h2>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">I. Company Details</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/3">Corporate Identity Number (CIN)</TableCell>
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
                <TableRow>
                  <TableCell className="font-medium">Registered Office Address</TableCell>
                  <TableCell>Translog House, Plot No. 84, Sector 44, Gurugram - 122003, Haryana, India</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Corporate Address</TableCell>
                  <TableCell>Translog Towers, 14th Floor, Bandra Kurla Complex, Mumbai - 400051, Maharashtra, India</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>investor.relations@translogindia.com</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Telephone</TableCell>
                  <TableCell>+91-22-66780800</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Website</TableCell>
                  <TableCell>www.translogindia.com</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Financial Year Reported</TableCell>
                  <TableCell>2023-24</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
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
                  <TableCell>Multimodal Transport Operations</TableCell>
                  <TableCell>52291</TableCell>
                  <TableCell>42%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Container Freight Stations & Inland Container Depots</TableCell>
                  <TableCell>52109</TableCell>
                  <TableCell>28%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Third-party Logistics (3PL) Services</TableCell>
                  <TableCell>52299</TableCell>
                  <TableCell>20%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Project Logistics</TableCell>
                  <TableCell>52242</TableCell>
                  <TableCell>10%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">III. Operations</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Number of Facilities</TableHead>
                  <TableHead>Number of Offices</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>National (India)</TableCell>
                  <TableCell>28 (12 CFS/ICDs, 16 Warehouses)</TableCell>
                  <TableCell>24</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>International</TableCell>
                  <TableCell>6 (4 Warehouses, 2 Distribution Centers)</TableCell>
                  <TableCell>8</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-md font-medium mt-6 mb-2">Key Operational Statistics:</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Container Handling Capacity</TableCell>
                  <TableCell>1.8 million TEUs per annum</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Warehousing Space</TableCell>
                  <TableCell>4.5 million sq. ft. across India</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fleet Size</TableCell>
                  <TableCell>1,250 owned vehicles, 2,800 partner vehicles</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rail Operations</TableCell>
                  <TableCell>14 train sets operating on 8 major routes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Annual Cargo Volume</TableCell>
                  <TableCell>22 million tons</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
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
                  <TableCell>3,850</TableCell>
                  <TableCell>1,250</TableCell>
                  <TableCell>5,100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Female</TableCell>
                  <TableCell>1,120</TableCell>
                  <TableCell>380</TableCell>
                  <TableCell>1,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Others</TableCell>
                  <TableCell>35</TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>47</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="font-medium">5,005</TableCell>
                  <TableCell className="font-medium">1,642</TableCell>
                  <TableCell className="font-medium">6,647</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-md font-medium mt-6 mb-2">Employee Distribution by Function:</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Function</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Operations</TableCell>
                  <TableCell>3,945</TableCell>
                  <TableCell>59.4%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sales & Marketing</TableCell>
                  <TableCell>865</TableCell>
                  <TableCell>13.0%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Technology & Digital</TableCell>
                  <TableCell>520</TableCell>
                  <TableCell>7.8%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Administration</TableCell>
                  <TableCell>635</TableCell>
                  <TableCell>9.6%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Finance & Accounting</TableCell>
                  <TableCell>420</TableCell>
                  <TableCell>6.3%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Management</TableCell>
                  <TableCell>262</TableCell>
                  <TableCell>3.9%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">V. CSR Details</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/2">CSR Registration Number</TableCell>
                  <TableCell>CSR00001246</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Spending on CSR</TableCell>
                  <TableCell>₹ 18.5 Crore (2.2% of average net profits)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CSR Committee Composition</TableCell>
                  <TableCell>2 Independent Directors, 1 Executive Director</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-md font-medium mt-4 mb-2">CSR Focus Areas:</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Initiative</TableHead>
                  <TableHead>Amount (₹ Crore)</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Driver Welfare Program</TableCell>
                  <TableCell>4.8</TableCell>
                  <TableCell>12,500 drivers and families benefited</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Community Skill Development</TableCell>
                  <TableCell>6.2</TableCell>
                  <TableCell>3,800 youth trained in logistics skills</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Environmental Initiatives</TableCell>
                  <TableCell>3.5</TableCell>
                  <TableCell>85,000 trees planted, 5 water bodies rejuvenated</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Road Safety Awareness</TableCell>
                  <TableCell>2.1</TableCell>
                  <TableCell>120 workshops conducted, 28,000 participants</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Healthcare Outreach</TableCell>
                  <TableCell>1.9</TableCell>
                  <TableCell>22 health camps, 18,500 beneficiaries</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GeneralDisclosures;
