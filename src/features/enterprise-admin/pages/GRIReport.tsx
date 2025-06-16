import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ReportViewer from '../components/reports/ReportViewer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const GRIReport: React.FC = () => {
  return (
    <UnifiedSidebarLayout>
      <ReportViewer title="GRI Report" reportType="GRI">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">GRI 102: General</TabsTrigger>
            <TabsTrigger value="economic">GRI 200: Economic</TabsTrigger>
            <TabsTrigger value="environmental">GRI 300: Environmental</TabsTrigger>
            <TabsTrigger value="social">GRI 400: Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-8">
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
                        <TableCell>Fandoro Logistics Ltd.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 102-2: Activities, brands, products, and services</TableCell>
                        <TableCell>Integrated logistics solutions including multimodal transport operations (MTO), container freight stations (CFS), inland container depots (ICD), project logistics, and third-party logistics (3PL)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 102-3: Location of headquarters</TableCell>
                        <TableCell>Mumbai, Maharashtra, India</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 102-4: Location of operations</TableCell>
                        <TableCell>India (Mumbai, Delhi, Chennai, Kolkata, Ahmedabad, Bangalore), UAE, Singapore, Sri Lanka</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 102-5: Ownership and legal form</TableCell>
                        <TableCell>Public Limited Company, listed on BSE and NSE</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 102-6: Markets served</TableCell>
                        <TableCell>Serves automotive, pharmaceuticals, FMCG, retail, e-commerce, infrastructure, and manufacturing sectors across Asia, Middle East and parts of Europe</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 102-7: Scale of the organization</TableCell>
                        <TableCell>
                          <ul className="list-disc pl-5">
                            <li>Total employees: 4,850</li>
                            <li>Annual revenue: INR 7,520 crore (FY 2023-24)</li>
                            <li>Total operations: 42 logistics centers, 15 container freight stations</li>
                            <li>Fleet size: 1,500+ owned vehicles, 3,000+ partner vehicles</li>
                            <li>Warehouse capacity: 12 million sq. ft across 35 locations</li>
                          </ul>
                        </TableCell>
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
                          <p>"As a leading logistics provider in India, we recognize our responsibility to operate sustainably while facilitating global trade. Our commitment to sustainable development remains unwavering as we navigate global challenges. We're proud of our progress in reducing our carbon footprint while expanding our operational footprint. Our strategy centers on technological innovation, fleet modernization, and renewable energy integration across our facilities."</p>
                          <p className="text-sm text-muted-foreground mt-2">- CEO, Fandoro Logistics Ltd.</p>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 102-15: Key impacts, risks, and opportunities</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <p className="font-semibold">Key Opportunities:</p>
                            <ul className="list-disc pl-5">
                              <li>Expansion of green logistics offerings to clients seeking carbon-neutral supply chains</li>
                              <li>Development of multimodal solutions reducing road transport dependency</li>
                              <li>Investment in electric and CNG fleet to reduce emissions and operating costs</li>
                            </ul>
                            
                            <p className="font-semibold mt-2">Key Risks:</p>
                            <ul className="list-disc pl-5">
                              <li>Regulatory changes regarding emissions and operational hours</li>
                              <li>Climate-related disruptions to transportation networks</li>
                              <li>Volatile fuel prices affecting operational costs</li>
                              <li>Competitive pressure from digital-first logistics platforms</li>
                            </ul>
                          </div>
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
                          <div className="space-y-2">
                            <p>Fandoro's core values include environmental stewardship, innovation, integrity, customer-centricity, and inclusive growth. Our Code of Conduct and Ethics Policy govern all operations and are regularly updated.</p>
                            <p>All employees and contractors undergo ethics training annually, with 98% completion rate in 2023.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 102-17: Mechanisms for advice and concerns about ethics</TableCell>
                        <TableCell>
                          <ul className="list-disc pl-5">
                            <li>Ethics helpline available 24/7 in 5 languages</li>
                            <li>Anonymous whistleblower portal managed by third-party provider</li>
                            <li>Regular ethics workshops and refresher training</li>
                            <li>Dedicated Ethics Committee with quarterly reviews of concerns raised</li>
                          </ul>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Governance</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">GRI 102-18: Governance structure</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <p>The Board of Directors consists of 11 members, with 6 independent directors. The ESG Committee meets quarterly and reports directly to the Board.</p>
                            <p>Three board committees oversee sustainability matters: ESG Committee, Risk Management Committee, and Corporate Social Responsibility Committee.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 102-20: Executive-level responsibility for economic, environmental, and social topics</TableCell>
                        <TableCell>
                          <p>The Chief Sustainability Officer (CSO) reports directly to the CEO and is responsible for implementing the company's ESG strategy. Department heads for Fleet Management, Facilities, and Human Resources have sustainability KPIs integrated into their performance evaluation.</p>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="economic" className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">GRI 200: Economic Standards</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">GRI 201: Economic Performance</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Disclosure</TableHead>
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 201-1: Direct economic value generated (Revenue in INR crore)</TableCell>
                        <TableCell>7,520</TableCell>
                        <TableCell>6,890</TableCell>
                        <TableCell className="text-green-600">+9.1%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 201-1: Economic value distributed - Operating costs (INR crore)</TableCell>
                        <TableCell>5,240</TableCell>
                        <TableCell>4,950</TableCell>
                        <TableCell className="text-red-600">+5.9%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 201-1: Economic value distributed - Employee wages and benefits (INR crore)</TableCell>
                        <TableCell>865</TableCell>
                        <TableCell>790</TableCell>
                        <TableCell className="text-red-600">+9.5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 201-1: Economic value distributed - Community investments (INR crore)</TableCell>
                        <TableCell>38.5</TableCell>
                        <TableCell>34.2</TableCell>
                        <TableCell className="text-green-600">+12.6%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 201-2: Financial implications of climate change (Adaptation costs in INR crore)</TableCell>
                        <TableCell>48.6</TableCell>
                        <TableCell>22.3</TableCell>
                        <TableCell className="text-red-600">+117.9%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">GRI 204: Procurement Practices</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Disclosure</TableHead>
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 204-1: Proportion of spending on local suppliers (%)</TableCell>
                        <TableCell>68%</TableCell>
                        <TableCell>63%</TableCell>
                        <TableCell className="text-green-600">+7.9%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 204-1: Number of MSME suppliers onboarded</TableCell>
                        <TableCell>342</TableCell>
                        <TableCell>285</TableCell>
                        <TableCell className="text-green-600">+20%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">GRI 205: Anti-corruption</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Disclosure</TableHead>
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 205-1: Operations assessed for corruption risks</TableCell>
                        <TableCell>100% (42 operations)</TableCell>
                        <TableCell>95% (38 operations)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 205-2: Communication and training on anti-corruption policies</TableCell>
                        <TableCell>98% employees, 84% business partners</TableCell>
                        <TableCell>92% employees, 75% business partners</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 205-3: Confirmed incidents of corruption</TableCell>
                        <TableCell>2 (both resulting in termination)</TableCell>
                        <TableCell>3 (2 terminations, 1 warning)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="environmental" className="space-y-8">
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
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 302-1: Total energy consumption (MWh)</TableCell>
                        <TableCell>118,650</TableCell>
                        <TableCell>125,200</TableCell>
                        <TableCell className="text-green-600">-5.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 302-1: Fuel consumption - Diesel (kiloliters)</TableCell>
                        <TableCell>9,845</TableCell>
                        <TableCell>10,650</TableCell>
                        <TableCell className="text-green-600">-7.6%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 302-1: Fuel consumption - CNG (kg)</TableCell>
                        <TableCell>1,250,000</TableCell>
                        <TableCell>980,000</TableCell>
                        <TableCell className="text-red-600">+27.6%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 302-1: Electricity consumption (MWh)</TableCell>
                        <TableCell>32,450</TableCell>
                        <TableCell>35,200</TableCell>
                        <TableCell className="text-green-600">-7.8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 302-1: Renewable energy consumption (MWh)</TableCell>
                        <TableCell>8,650</TableCell>
                        <TableCell>5,200</TableCell>
                        <TableCell className="text-green-600">+66.3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 302-3: Energy intensity (MWh/INR crore revenue)</TableCell>
                        <TableCell>15.8</TableCell>
                        <TableCell>18.2</TableCell>
                        <TableCell className="text-green-600">-13.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 302-4: Energy reductions achieved (MWh)</TableCell>
                        <TableCell>6,550</TableCell>
                        <TableCell>4,800</TableCell>
                        <TableCell className="text-green-600">+36.5%</TableCell>
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
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 305-1: Direct (Scope 1) GHG emissions (tCO2e)</TableCell>
                        <TableCell>28,450</TableCell>
                        <TableCell>30,650</TableCell>
                        <TableCell className="text-green-600">-7.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 305-2: Indirect (Scope 2) GHG emissions (tCO2e)</TableCell>
                        <TableCell>19,540</TableCell>
                        <TableCell>22,800</TableCell>
                        <TableCell className="text-green-600">-14.3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 305-3: Other indirect (Scope 3) GHG emissions (tCO2e)</TableCell>
                        <TableCell>76,850</TableCell>
                        <TableCell>82,400</TableCell>
                        <TableCell className="text-green-600">-6.7%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 305-4: GHG emissions intensity (tCO2e/INR crore revenue)</TableCell>
                        <TableCell>16.6</TableCell>
                        <TableCell>19.7</TableCell>
                        <TableCell className="text-green-600">-15.7%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 305-5: GHG emissions reduction (tCO2e)</TableCell>
                        <TableCell>11,010</TableCell>
                        <TableCell>7,850</TableCell>
                        <TableCell className="text-green-600">+40.3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 305-7: NOx emissions (tonnes)</TableCell>
                        <TableCell>86.5</TableCell>
                        <TableCell>94.2</TableCell>
                        <TableCell className="text-green-600">-8.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 305-7: SOx emissions (tonnes)</TableCell>
                        <TableCell>12.3</TableCell>
                        <TableCell>14.5</TableCell>
                        <TableCell className="text-green-600">-15.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 305-7: Particulate matter (PM10) emissions (tonnes)</TableCell>
                        <TableCell>7.8</TableCell>
                        <TableCell>8.6</TableCell>
                        <TableCell className="text-green-600">-9.3%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">GRI 306: Waste</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Disclosure</TableHead>
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 306-3: Total waste generated (tonnes)</TableCell>
                        <TableCell>4,850</TableCell>
                        <TableCell>5,240</TableCell>
                        <TableCell className="text-green-600">-7.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 306-4: Waste diverted from disposal (tonnes)</TableCell>
                        <TableCell>3,256</TableCell>
                        <TableCell>2,890</TableCell>
                        <TableCell className="text-green-600">+12.7%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 306-4: Packaging materials recovered (tonnes)</TableCell>
                        <TableCell>1,850</TableCell>
                        <TableCell>1,650</TableCell>
                        <TableCell className="text-green-600">+12.1%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 306-5: Waste directed to disposal (tonnes)</TableCell>
                        <TableCell>1,594</TableCell>
                        <TableCell>2,350</TableCell>
                        <TableCell className="text-green-600">-32.2%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">GRI 307: Environmental Compliance</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 307-1: Non-compliance with environmental laws and regulations</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <p>Monetary value of significant fines: INR 2.8 lakhs (1 incident)</p>
                            <p>Total number of non-monetary sanctions: 2</p>
                            <p>Incidents resolved through dispute resolution mechanisms: 1</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">GRI 400: Social Standards</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">GRI 401: Employment</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Disclosure</TableHead>
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 401-1: New employee hires</TableCell>
                        <TableCell>685</TableCell>
                        <TableCell>542</TableCell>
                        <TableCell className="text-green-600">+26.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 401-1: Employee turnover rate</TableCell>
                        <TableCell>12.4%</TableCell>
                        <TableCell>14.8%</TableCell>
                        <TableCell className="text-green-600">-16.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 401-2: Benefits provided to full-time employees</TableCell>
                        <TableCell colSpan={3}>
                          <ul className="list-disc pl-5">
                            <li>Health insurance for employees and dependents</li>
                            <li>Parental leave beyond statutory requirements</li>
                            <li>Education assistance program</li>
                            <li>Employee stock ownership plan (for eligible employees)</li>
                            <li>Retirement provisions beyond statutory requirements</li>
                          </ul>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 401-3: Parental leave return rate</TableCell>
                        <TableCell>96% (women), 98% (men)</TableCell>
                        <TableCell>92% (women), 97% (men)</TableCell>
                        <TableCell className="text-green-600">+4.3% (women)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">GRI 403: Occupational Health and Safety</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Disclosure</TableHead>
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 403-8: Workers covered by OHS management system</TableCell>
                        <TableCell>100%</TableCell>
                        <TableCell>100%</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 403-9: Work-related injuries - LTIFR (Lost Time Injury Frequency Rate)</TableCell>
                        <TableCell>0.25</TableCell>
                        <TableCell>0.38</TableCell>
                        <TableCell className="text-green-600">-34.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 403-9: Work-related fatalities</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell className="text-green-600">-100%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 403-10: Work-related ill health cases</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell className="text-green-600">-37.5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 403-5: OHS training hours per employee (average)</TableCell>
                        <TableCell>12.5</TableCell>
                        <TableCell>9.2</TableCell>
                        <TableCell className="text-green-600">+35.9%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">GRI 404: Training and Education</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Disclosure</TableHead>
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 404-1: Average hours of training per employee</TableCell>
                        <TableCell>38.5</TableCell>
                        <TableCell>32.8</TableCell>
                        <TableCell className="text-green-600">+17.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 404-2: Programs for upgrading employee skills</TableCell>
                        <TableCell colSpan={3}>
                          <ul className="list-disc pl-5">
                            <li>Digital upskilling program (1,250 employees)</li>
                            <li>Leadership development program (380 managers)</li>
                            <li>Technical certification assistance (525 employees)</li>
                            <li>Supply chain analytics training (650 employees)</li>
                            <li>Safety leadership program (320 supervisors)</li>
                          </ul>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 404-3: Percentage of employees receiving regular performance reviews</TableCell>
                        <TableCell>100%</TableCell>
                        <TableCell>100%</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">GRI 405: Diversity and Equal Opportunity</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Disclosure</TableHead>
                        <TableHead>2023-24</TableHead>
                        <TableHead>2022-23</TableHead>
                        <TableHead>% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 405-1: Women in workforce</TableCell>
                        <TableCell>24%</TableCell>
                        <TableCell>20%</TableCell>
                        <TableCell className="text-green-600">+20%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 405-1: Women in management positions</TableCell>
                        <TableCell>22%</TableCell>
                        <TableCell>18%</TableCell>
                        <TableCell className="text-green-600">+22.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 405-1: Women on the Board of Directors</TableCell>
                        <TableCell>27% (3 out of 11)</TableCell>
                        <TableCell>18% (2 out of 11)</TableCell>
                        <TableCell className="text-green-600">+50%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 405-1: Employees with disabilities</TableCell>
                        <TableCell>2.2%</TableCell>
                        <TableCell>1.8%</TableCell>
                        <TableCell className="text-green-600">+22.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 405-2: Women's compensation ratio to men (same level)</TableCell>
                        <TableCell>0.96:1</TableCell>
                        <TableCell>0.94:1</TableCell>
                        <TableCell className="text-green-600">+2.1%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">GRI 413: Local Communities</h3>
                  <Separator className="my-2" />
                  
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GRI 413-1: Operations with local community engagement programs</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <p>36 out of 42 operations (85.7%) implemented structured community engagement programs.</p>
                            <p className="font-semibold mt-2">Key initiatives:</p>
                            <ul className="list-disc pl-5">
                              <li>Road safety awareness campaigns in 28 locations</li>
                              <li>Skill development for local youth (1,250 beneficiaries)</li>
                              <li>Village infrastructure development near 12 major facilities</li>
                              <li>Health camps serving 8,500+ beneficiaries in underserved communities</li>
                              <li>Disaster relief operations in 3 flood-affected regions</li>
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GRI 413-2: Operations with significant actual and potential negative impacts on local communities</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <p>5 operations identified with potential community impacts:</p>
                            <ul className="list-disc pl-5">
                              <li>Noise pollution from 3 container freight stations (mitigation: noise barriers installed, operating hours adjusted)</li>
                              <li>Traffic congestion near 2 major logistics hubs (mitigation: staggered dispatch timing, bypass road development)</li>
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </ReportViewer>
    </UnifiedSidebarLayout>
  );
};

export default GRIReport;
