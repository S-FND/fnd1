import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ManagementDisclosuresData } from './general-disclosures/types/company';

interface ManagementDisclosuresProps {
  data?: ManagementDisclosuresData;
}

const DEFAULT_DATA: ManagementDisclosuresData = {
  policyDisclosures: [
    {
      question: 'Policy formulation approved by Board',
      ethics: 'Yes',
      safety: 'Yes',
      wellbeing: 'Yes',
      stakeholders: 'Yes',
      humanRights: 'Yes',
      environment: 'Yes',
      advocacy: 'Yes',
      inclusiveGrowth: 'Yes',
      customerValue: 'Yes'
    },
    {
      question: 'Policies conforming to national/international standards',
      ethics: 'Yes',
      safety: 'Yes',
      wellbeing: 'Yes',
      stakeholders: 'Yes',
      humanRights: 'Yes',
      environment: 'Yes',
      advocacy: 'Yes',
      inclusiveGrowth: 'Yes',
      customerValue: 'Yes'
    },
    {
      question: 'Policy approved by designated stakeholders',
      ethics: 'Yes',
      safety: 'Yes',
      wellbeing: 'Yes',
      stakeholders: 'Yes',
      humanRights: 'Yes',
      environment: 'Yes',
      advocacy: 'Yes',
      inclusiveGrowth: 'Yes',
      customerValue: 'Yes'
    },
    {
      question: 'Board committee to oversee implementation',
      ethics: 'Yes',
      safety: 'Yes',
      wellbeing: 'Yes',
      stakeholders: 'Yes',
      humanRights: 'Yes',
      environment: 'Yes',
      advocacy: 'Yes',
      inclusiveGrowth: 'Yes',
      customerValue: 'Yes'
    },
    {
      question: 'Stakeholder engagement in policy formation',
      ethics: 'Yes',
      safety: 'Yes',
      wellbeing: 'Yes',
      stakeholders: 'Yes',
      humanRights: 'Yes',
      environment: 'Yes',
      advocacy: 'No',
      inclusiveGrowth: 'Yes',
      customerValue: 'Yes'
    },
    {
      question: 'Policy implementation monitoring',
      ethics: 'Yes',
      safety: 'Yes',
      wellbeing: 'Yes',
      stakeholders: 'Yes',
      humanRights: 'Yes',
      environment: 'Yes',
      advocacy: 'Yes',
      inclusiveGrowth: 'Yes',
      customerValue: 'Yes'
    }
  ],
  sectorPolicies: [
    {
      name: 'Fleet Safety & Emissions Policy',
      keyElements: 'Regular maintenance, driver training, eco-driving, fuel efficiency standards',
      coverage: 'All owned and leased vehicles'
    },
    {
      name: 'Sustainable Warehouse Operations',
      keyElements: 'Energy efficiency, waste management, water conservation, renewable energy usage',
      coverage: 'All CFS/ICD facilities'
    },
    {
      name: 'Multimodal Transport Policy',
      keyElements: 'Modal shift guidelines, emission reduction targets, optimization protocols',
      coverage: 'All transport operations'
    },
    {
      name: 'Digital Logistics Transformation',
      keyElements: 'Paperless operations, IoT implementation, route optimization, ML-based forecasting',
      coverage: 'All business operations'
    },
    {
      name: 'Driver Welfare Policy',
      keyElements: 'Working hours, rest periods, health benefits, skill development',
      coverage: 'All drivers (employed and contracted)'
    },
    {
      name: 'Port Operations Safety Protocol',
      keyElements: 'Container handling safety, equipment standards, inspection procedures',
      coverage: 'All port-based operations'
    },
    {
      name: 'Green Supply Chain Partnership',
      keyElements: 'Supplier code of conduct, emissions disclosure requirements, joint innovation',
      coverage: 'All major suppliers and partners'
    }
  ],
  boardCommittees: [
    {
      name: 'Sustainability & CSR Committee',
      composition: '2 Independent Directors, 1 Executive Director',
      responsibilities: 'Overall ESG strategy, ESG performance review, policy approval'
    },
    {
      name: 'Environmental Performance Committee',
      composition: 'COO, Head of Operations, Head of Sustainability',
      responsibilities: 'GHG reduction, resource efficiency, environmental compliance'
    },
    {
      name: 'Social Responsibility Committee',
      composition: 'CHRO, Head of CSR, Regional Heads',
      responsibilities: 'Community engagement, employee welfare, human rights'
    },
    {
      name: 'Governance & Ethics Committee',
      composition: 'Company Secretary, CFO, General Counsel',
      responsibilities: 'Compliance, business conduct, anti-corruption measures'
    },
    {
      name: 'Logistics Innovation Council',
      composition: 'CTO, Head of Business Development, Head of Sustainability',
      responsibilities: 'Green logistics solutions, digital transformation, sustainable technologies'
    }
  ],
  directorStatement: {
    name: 'Sunita Sharma',
    position: 'Chairperson, Sustainability & CSR Committee',
    din: 'DIN: 00284485',
    paragraphs: [
      "At Translog India Ltd., we recognize that Environmental, Social, and Governance (ESG) factors are integral to our long-term business strategy in the logistics sector. Our Board is committed to maintaining high standards of sustainability performance across our multimodal transport operations, container freight stations, inland container depots, and 3PL services. We have integrated ESG considerations into our risk management framework and regularly review our progress against established sustainability goals.",
      "As India's leading integrated logistics solutions provider, we understand our responsibility to operate sustainably while delivering value to all stakeholders. This Business Responsibility and Sustainability Report (BRSR) has been prepared in accordance with the SEBI guidelines and represents our commitment to transparent disclosure of our sustainability journey.",
      "We are particularly proud of our initiatives to reduce GHG emissions through fleet modernization, modal shift to rail, and energy efficiency improvements across our operations. Our driver welfare programs and community skill development initiatives represent our commitment to inclusive growth within the logistics ecosystem.",
      "Moving forward, we are committed to playing a leadership role in the sustainable transformation of India's logistics sector through innovation, collaboration, and responsible business practices."
    ]
  }
};

const ManagementDisclosures: React.FC<ManagementDisclosuresProps> = ({ data = DEFAULT_DATA }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section B: Management and Process Disclosures</h2>
      
      <div className="space-y-6">
        {/* Policy and Management Processes Card */}
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
                {data.policyDisclosures.map((disclosure, index) => (
                  <TableRow key={`policy-${index}`}>
                    <TableCell>{disclosure.question}</TableCell>
                    <TableCell>{disclosure.ethics}</TableCell>
                    <TableCell>{disclosure.safety}</TableCell>
                    <TableCell>{disclosure.wellbeing}</TableCell>
                    <TableCell>{disclosure.stakeholders}</TableCell>
                    <TableCell>{disclosure.humanRights}</TableCell>
                    <TableCell>{disclosure.environment}</TableCell>
                    <TableCell>{disclosure.advocacy}</TableCell>
                    <TableCell>{disclosure.inclusiveGrowth}</TableCell>
                    <TableCell>{disclosure.customerValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Logistics Sector-Specific Policies Card */}
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
                {data.sectorPolicies.map((policy, index) => (
                  <TableRow key={`policy-${index}`}>
                    <TableCell>{policy.name}</TableCell>
                    <TableCell>{policy.keyElements}</TableCell>
                    <TableCell>{policy.coverage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Governance, Leadership and Oversight Card */}
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
                {data.boardCommittees.map((committee, index) => (
                  <TableRow key={`committee-${index}`}>
                    <TableCell>{committee.name}</TableCell>
                    <TableCell>{committee.composition}</TableCell>
                    <TableCell>{committee.responsibilities}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator className="my-6" />

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Statement by Director Responsible for BRSR</CardTitle>
              </CardHeader>
              <CardContent>
                {data.directorStatement.paragraphs.map((paragraph, index) => (
                  <p key={`paragraph-${index}`} className="text-sm mt-3 first:mt-0">
                    {paragraph}
                  </p>
                ))}
                <p className="text-sm font-medium mt-4">{data.directorStatement.name}</p>
                <p className="text-sm">{data.directorStatement.position}</p>
                <p className="text-sm">{data.directorStatement.din}</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ManagementDisclosures;