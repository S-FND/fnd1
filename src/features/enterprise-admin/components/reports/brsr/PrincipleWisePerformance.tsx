
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const PrincipleWisePerformance: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section C: Principle-wise Performance</h2>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Principle 1: Ethics, Transparency and Accountability</h3>
            <Separator className="my-2" />
            
            <p className="mt-2">
              Translog India Ltd. has established robust governance mechanisms that ensure ethical conduct across all logistics operations. Our Code of Conduct covers 100% of our employees and extends to our supply chain partners. During the reporting period:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Zero confirmed incidents of corruption across all logistics operations</li>
              <li>100% of employees received ethics and anti-bribery training</li>
              <li>32 stakeholder complaints received, 31 resolved (97% resolution rate)</li>
              <li>Four independent directors serving on the Board's Ethics Committee</li>
              <li>Implemented real-time GPS tracking for 100% of fleet for route compliance monitoring</li>
              <li>Whistleblower policy extended to all 3PL partners and subcontractors</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Principle 2: Safety and Sustainability of Products & Services</h3>
            <Separator className="my-2" />
            
            <p className="mt-2">
              Our logistics service development process incorporates life-cycle sustainability assessments for all new service offerings. We've implemented integrated multimodal transportation solutions to reduce emissions.
            </p>
            
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Current Usage</TableHead>
                  <TableHead>Reduction during operations</TableHead>
                  <TableHead>Customer benefits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Fuel</TableCell>
                  <TableCell>28.5 million liters</TableCell>
                  <TableCell>12% reduction</TableCell>
                  <TableCell>18% reduction in carbon footprint</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Water</TableCell>
                  <TableCell>185,000 m³</TableCell>
                  <TableCell>10% reduction</TableCell>
                  <TableCell>Improved water management in CFS/ICD operations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Packaging Materials</TableCell>
                  <TableCell>18,200 tons</TableCell>
                  <TableCell>25% reduction</TableCell>
                  <TableCell>Reusable packaging solutions for clients</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Electricity</TableCell>
                  <TableCell>15.8 million kWh</TableCell>
                  <TableCell>15% reduction</TableCell>
                  <TableCell>Energy-efficient warehousing services</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-md font-medium mt-6 mb-2">Sustainable Fleet & Operations Initiatives:</h4>
            <ul className="list-disc pl-6 mt-2">
              <li>Converted 35% of short-haul fleet to CNG/LNG fuels</li>
              <li>Implemented advanced route optimization reducing fuel consumption by 18%</li>
              <li>Installed solar panels across 8 warehouse facilities (3.2 MW capacity)</li>
              <li>Reduced packaging waste through returnable container systems for 65% of regular routes</li>
              <li>Achieved 40% modal shift from road to rail for long-haul routes</li>
              <li>Pioneered electric vehicle deployment for last-mile deliveries in 6 major cities</li>
              <li>Implemented RFID-based container tracking reducing idle time at ports by 32%</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
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
                  <TableCell>90% facilities fully accessible</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Return to work and retention rates after parental leave</TableCell>
                  <TableCell>95% return rate, 88% retention (one year)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Grievance redressal mechanism</TableCell>
                  <TableCell>Online portal, 24/7 helpline, and mobile app</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Safety incidents</TableCell>
                  <TableCell>LTIFR: 0.25 (industry avg: 0.4), Zero fatalities</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Driver welfare programs</TableCell>
                  <TableCell>Health insurance, rest facilities at 28 locations, wellness checks</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Training hours per employee</TableCell>
                  <TableCell>32.5 hours (technical), 12.4 hours (soft skills)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Employee engagement score</TableCell>
                  <TableCell>78% (up 5% from previous year)</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-md font-medium mt-6 mb-2">Workforce Diversity:</h4>
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Permanent</TableHead>
                  <TableHead>Contractual</TableHead>
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
                  <TableCell>Persons with disabilities</TableCell>
                  <TableCell>85</TableCell>
                  <TableCell>22</TableCell>
                  <TableCell>107</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Principle 4: Stakeholder Engagement</h3>
            <Separator className="my-2" />
            
            <p className="mt-2">
              Translog India Ltd. has mapped internal and external stakeholders and has implemented structured engagement programs with vulnerable and marginalized stakeholder groups.
            </p>

            <h4 className="text-md font-medium mt-4 mb-2">Key Stakeholder Initiatives:</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stakeholder Group</TableHead>
                  <TableHead>Engagement Mechanisms</TableHead>
                  <TableHead>Key Concerns Addressed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Local communities near logistics hubs</TableCell>
                  <TableCell>Community advisory panels, grievance mechanism, CSR initiatives</TableCell>
                  <TableCell>Noise pollution, air quality, employment opportunities</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>MSMEs in supply chain</TableCell>
                  <TableCell>Capacity building programs, preferential payment terms</TableCell>
                  <TableCell>Payment cycles, technical capabilities, digital integration</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Contract drivers and loaders</TableCell>
                  <TableCell>Welfare programs, skills development, safety training</TableCell>
                  <TableCell>Working conditions, income security, health benefits</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Port authorities</TableCell>
                  <TableCell>Regular meetings, joint planning sessions, technology integration</TableCell>
                  <TableCell>Efficiency improvements, congestion reduction, paperless processes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Indigenous communities affected by logistics operations</TableCell>
                  <TableCell>Free, prior and informed consent protocols, customized engagement programs</TableCell>
                  <TableCell>Land use, cultural heritage preservation, benefit sharing</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Principle 5: Human Rights</h3>
            <Separator className="my-2" />
            
            <p className="mt-2">
              Our commitment to human rights extends across our value chain, covering employees, contract workers, drivers, and communities impacted by our operations.
            </p>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Focus Area</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Human rights policy coverage</TableCell>
                  <TableCell>100% of employees and contractors</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Human rights assessments</TableCell>
                  <TableCell>Completed for 85% of operations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Supplier compliance</TableCell>
                  <TableCell>92% of suppliers signed human rights code</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Human rights training</TableCell>
                  <TableCell>16,450 hours delivered (employees and key suppliers)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Human rights complaints</TableCell>
                  <TableCell>8 received, 8 resolved with remediation measures</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Driver rest hours compliance</TableCell>
                  <TableCell>98.5% compliance with mandatory rest periods</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Worker representation</TableCell>
                  <TableCell>100% workers covered by collective bargaining agreements</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Principle 6: Environment</h3>
            <Separator className="my-2" />
            
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Current Year</TableHead>
                  <TableHead>Previous Year</TableHead>
                  <TableHead>% Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>GHG Emissions (Scope 1+2)</TableCell>
                  <TableCell>128,500 tCO₂e</TableCell>
                  <TableCell>142,800 tCO₂e</TableCell>
                  <TableCell>-10.0%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>GHG Emissions (Scope 3)</TableCell>
                  <TableCell>385,200 tCO₂e</TableCell>
                  <TableCell>412,600 tCO₂e</TableCell>
                  <TableCell>-6.6%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Energy Intensity</TableCell>
                  <TableCell>0.42 GJ/ton-km</TableCell>
                  <TableCell>0.48 GJ/ton-km</TableCell>
                  <TableCell>-12.5%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Renewable Energy</TableCell>
                  <TableCell>32% of total energy</TableCell>
                  <TableCell>24% of total energy</TableCell>
                  <TableCell>+33.3%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Water Recycled</TableCell>
                  <TableCell>68,000 m³</TableCell>
                  <TableCell>52,000 m³</TableCell>
                  <TableCell>+30.8%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Waste Diverted from Landfill</TableCell>
                  <TableCell>78%</TableCell>
                  <TableCell>65%</TableCell>
                  <TableCell>+20.0%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Plastic Waste Reduction</TableCell>
                  <TableCell>42 tons</TableCell>
                  <TableCell>65 tons</TableCell>
                  <TableCell>-35.4%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Container Utilization Rate</TableCell>
                  <TableCell>91%</TableCell>
                  <TableCell>85%</TableCell>
                  <TableCell>+7.1%</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="text-md font-medium mt-6 mb-2">Key Environmental Initiatives:</h4>
            <ul className="list-disc pl-6 mt-2">
              <li>Achieved ISO 14001:2015 certification for all major facilities</li>
              <li>Implemented electric forklifts across 65% of warehouse operations</li>
              <li>Expanded modal shift from road to rail, reducing emissions by 12,800 tCO₂e</li>
              <li>Rainwater harvesting implemented at 12 major facilities</li>
              <li>Achieved zero liquid discharge at 8 Container Freight Stations</li>
              <li>Implemented route optimization software reducing empty miles by 28%</li>
              <li>Set science-based targets aligned with 1.5°C pathway</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Principle 7: Policy Advocacy</h3>
            <Separator className="my-2" />
            
            <p className="mt-2">
              Translog India Ltd. engages in policy advocacy to promote sustainability in the logistics sector through industry associations and direct engagement with policymakers.
            </p>

            <h4 className="text-md font-medium mt-4 mb-2">Key Policy Advocacy Initiatives:</h4>
            <ul className="list-disc pl-6 mt-2">
              <li>Active member of the National Association of Logistics Companies (NALC)</li>
              <li>Contributed to the development of the National Logistics Policy framework</li>
              <li>Advocating for incentives to accelerate modal shift from road to rail</li>
              <li>Supporting standardization of container dimensions for intermodal compatibility</li>
              <li>Promoting customs process harmonization for EXIM trade facilitation</li>
              <li>Collaborating with policy think-tanks on sustainable transport corridor development</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Principle 8: Inclusive Growth</h3>
            <Separator className="my-2" />
            
            <p className="mt-2">
              Our CSR programs focus on creating sustainable livelihoods and addressing the specific needs of communities in our operational areas.
            </p>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>CSR Initiative</TableHead>
                  <TableHead>Focus Area</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Skill Development for Logistics Sector</TableCell>
                  <TableCell>Training youth from underprivileged communities</TableCell>
                  <TableCell>3,850 trainees placed in jobs, 68% from marginalized communities</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Driver Welfare Program</TableCell>
                  <TableCell>Health, financial literacy, family support</TableCell>
                  <TableCell>12,500 drivers and families benefited, health insurance for all</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Digital Inclusion</TableCell>
                  <TableCell>Technology access for small-scale transporters</TableCell>
                  <TableCell>1,200 small transporters onboarded to digital platform</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Community Infrastructure</TableCell>
                  <TableCell>Development near logistics hubs</TableCell>
                  <TableCell>12 villages provided with water, sanitation, power facilities</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Women Empowerment in Logistics</TableCell>
                  <TableCell>Training for women in warehouse management</TableCell>
                  <TableCell>485 women trained, 82% employed in logistics roles</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Principle 9: Customer Value</h3>
            <Separator className="my-2" />
            
            <p className="mt-2">
              Translog India Ltd. is committed to providing sustainable logistics solutions that create value for customers while minimizing environmental impacts.
            </p>

            <h4 className="text-md font-medium mt-4 mb-2">Customer-facing Sustainability Initiatives:</h4>
            <ul className="list-disc pl-6 mt-2">
              <li>Carbon footprint calculator provided to 100% of clients</li>
              <li>Green logistics options available for all service offerings</li>
              <li>Sustainable packaging solutions implemented for 68% of 3PL customers</li>
              <li>Real-time emissions tracking dashboard available to all enterprise clients</li>
              <li>Developed industry-first carbon-neutral freight forwarding service</li>
            </ul>

            <h4 className="text-md font-medium mt-6 mb-2">Customer Satisfaction:</h4>
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Customer satisfaction score</TableCell>
                  <TableCell>4.6/5 (industry avg: 4.2/5)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>On-time delivery</TableCell>
                  <TableCell>96.8% (up from 93.5% previous year)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Customer complaint resolution</TableCell>
                  <TableCell>98.2% resolved within SLA timeframe</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Net Promoter Score</TableCell>
                  <TableCell>+62 (improved from +54 previous year)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Customer retention rate</TableCell>
                  <TableCell>94.5% for enterprise clients</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PrincipleWisePerformance;
