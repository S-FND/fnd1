
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ManagementDisclosures: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section B: Management and Process Disclosures</h2>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">Policy and Management Processes</h3>
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
                  <TableCell>Yes</TableCell>
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
                <TableRow>
                  <TableCell>Stakeholder engagement in policy formation</TableCell>
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
                  <TableCell>Policy implementation monitoring</TableCell>
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
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">Logistics Sector-Specific Policies</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Key Elements</TableHead>
                  <TableHead>Coverage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Fleet Safety & Emissions Policy</TableCell>
                  <TableCell>Regular maintenance, driver training, eco-driving, fuel efficiency standards</TableCell>
                  <TableCell>All owned and leased vehicles</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sustainable Warehouse Operations</TableCell>
                  <TableCell>Energy efficiency, waste management, water conservation, renewable energy usage</TableCell>
                  <TableCell>All CFS/ICD facilities</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Multimodal Transport Policy</TableCell>
                  <TableCell>Modal shift guidelines, emission reduction targets, optimization protocols</TableCell>
                  <TableCell>All transport operations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Digital Logistics Transformation</TableCell>
                  <TableCell>Paperless operations, IoT implementation, route optimization, ML-based forecasting</TableCell>
                  <TableCell>All business operations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Driver Welfare Policy</TableCell>
                  <TableCell>Working hours, rest periods, health benefits, skill development</TableCell>
                  <TableCell>All drivers (employed and contracted)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Port Operations Safety Protocol</TableCell>
                  <TableCell>Container handling safety, equipment standards, inspection procedures</TableCell>
                  <TableCell>All port-based operations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Green Supply Chain Partnership</TableCell>
                  <TableCell>Supplier code of conduct, emissions disclosure requirements, joint innovation</TableCell>
                  <TableCell>All major suppliers and partners</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Governance, Leadership and Oversight</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-md font-semibold mb-3">Board Committee Structure for ESG:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Committee</TableHead>
                  <TableHead>Composition</TableHead>
                  <TableHead>Key Responsibilities</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Sustainability & CSR Committee</TableCell>
                  <TableCell>2 Independent Directors, 1 Executive Director</TableCell>
                  <TableCell>Overall ESG strategy, ESG performance review, policy approval</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Environmental Performance Committee</TableCell>
                  <TableCell>COO, Head of Operations, Head of Sustainability</TableCell>
                  <TableCell>GHG reduction, resource efficiency, environmental compliance</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Social Responsibility Committee</TableCell>
                  <TableCell>CHRO, Head of CSR, Regional Heads</TableCell>
                  <TableCell>Community engagement, employee welfare, human rights</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Governance & Ethics Committee</TableCell>
                  <TableCell>Company Secretary, CFO, General Counsel</TableCell>
                  <TableCell>Compliance, business conduct, anti-corruption measures</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Logistics Innovation Council</TableCell>
                  <TableCell>CTO, Head of Business Development, Head of Sustainability</TableCell>
                  <TableCell>Green logistics solutions, digital transformation, sustainable technologies</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Separator className="my-6" />

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Statement by Director Responsible for BRSR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  "At Translog India Ltd., we recognize that Environmental, Social, and Governance (ESG) factors are integral to our long-term business strategy in the logistics sector. Our Board is committed to maintaining high standards of sustainability performance across our multimodal transport operations, container freight stations, inland container depots, and 3PL services. We have integrated ESG considerations into our risk management framework and regularly review our progress against established sustainability goals."
                </p>
                <p className="text-sm mt-3">
                  "As India's leading integrated logistics solutions provider, we understand our responsibility to operate sustainably while delivering value to all stakeholders. This Business Responsibility and Sustainability Report (BRSR) has been prepared in accordance with the SEBI guidelines and represents our commitment to transparent disclosure of our sustainability journey."
                </p>
                <p className="text-sm mt-3">
                  "We are particularly proud of our initiatives to reduce GHG emissions through fleet modernization, modal shift to rail, and energy efficiency improvements across our operations. Our driver welfare programs and community skill development initiatives represent our commitment to inclusive growth within the logistics ecosystem."
                </p>
                <p className="text-sm mt-3">
                  "Moving forward, we are committed to playing a leadership role in the sustainable transformation of India's logistics sector through innovation, collaboration, and responsible business practices."
                </p>
                <p className="text-sm font-medium mt-4">Sunita Sharma</p>
                <p className="text-sm">Chairperson, Sustainability & CSR Committee</p>
                <p className="text-sm">DIN: 00284485</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ManagementDisclosures;
