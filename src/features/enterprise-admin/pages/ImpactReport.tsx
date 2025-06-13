import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ReportViewer from '../components/reports/ReportViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

const ImpactReport: React.FC = () => {
  return (
    <UnifiedSidebarLayout>
      <ReportViewer title="Impact Assessment Report" reportType="Impact">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
            <p>
              This Impact Assessment Report evaluates the environmental and social effects of Fandoro Enterprises' 
              operations during the fiscal year 2023. The assessment follows the IFC Performance Standards and 
              utilizes data collected through the company's sustainability management system.
            </p>
            <p className="mt-3">
              Overall, the company has made significant progress in reducing negative environmental impacts
              while increasing its positive social contributions. Key achievements include a 15% reduction in GHG
              emissions intensity, 25% increase in renewable energy usage, and implementation of community
              development programs benefiting over 10,000 individuals.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Environmental Impact Assessment</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Climate Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Impact Category</TableHead>
                        <TableHead>Baseline (2020)</TableHead>
                        <TableHead>Current (2023)</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Impact Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>GHG Emissions (tCO2e)</TableCell>
                        <TableCell>38,500</TableCell>
                        <TableCell>32,670</TableCell>
                        <TableCell className="text-green-600">-15.1%</TableCell>
                        <TableCell>Medium Positive</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Carbon Offset Projects (tCO2e)</TableCell>
                        <TableCell>5,000</TableCell>
                        <TableCell>12,000</TableCell>
                        <TableCell className="text-green-600">+140%</TableCell>
                        <TableCell>High Positive</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Climate Adaptation Investments ($)</TableCell>
                        <TableCell>250,000</TableCell>
                        <TableCell>750,000</TableCell>
                        <TableCell className="text-green-600">+200%</TableCell>
                        <TableCell>High Positive</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Consumption</TableHead>
                        <TableHead>YOY Change</TableHead>
                        <TableHead>Impact Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Water (m³)</TableCell>
                        <TableCell>145,000</TableCell>
                        <TableCell className="text-green-600">-8.2%</TableCell>
                        <TableCell>Medium Positive</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Energy (MWh)</TableCell>
                        <TableCell>12,450</TableCell>
                        <TableCell className="text-green-600">-5.7%</TableCell>
                        <TableCell>Medium Positive</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Raw Materials (tons)</TableCell>
                        <TableCell>28,700</TableCell>
                        <TableCell className="text-green-600">-3.1%</TableCell>
                        <TableCell>Low Positive</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Biodiversity Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    The company's operations have been assessed for their impact on local biodiversity using
                    the Biodiversity Impact Assessment Protocol. Key findings include:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>No operations in or adjacent to protected areas or areas of high biodiversity value</li>
                    <li>Implementation of habitat restoration projects covering 45 hectares</li>
                    <li>Zero incidents of non-compliance with environmental regulations related to biodiversity</li>
                  </ul>
                  <p className="mt-3 font-semibold">Overall Biodiversity Impact Rating: Low Positive</p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Social Impact Assessment</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workforce Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold">Employment Creation and Skills Development</h4>
                    <Separator className="my-2" />
                    <ul className="list-disc pl-6">
                      <li>Created 120 new jobs in underserved communities</li>
                      <li>Provided 4,500+ hours of technical and professional development training</li>
                      <li>Implemented apprenticeship program benefiting 35 youth from local communities</li>
                    </ul>
                    <p className="mt-2 font-semibold">Impact Rating: High Positive</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold">Diversity and Inclusion</h4>
                    <Separator className="my-2" />
                    <ul className="list-disc pl-6">
                      <li>48% female representation in workforce (industry average: 32%)</li>
                      <li>35% underrepresented groups in management positions</li>
                      <li>95% equal pay ratio between genders for comparable positions</li>
                    </ul>
                    <p className="mt-2 font-semibold">Impact Rating: Medium Positive</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Community Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Program</TableHead>
                        <TableHead>Beneficiaries</TableHead>
                        <TableHead>Investment</TableHead>
                        <TableHead>Impact Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Clean Water Initiative</TableCell>
                        <TableCell>5,200 people</TableCell>
                        <TableCell>$320,000</TableCell>
                        <TableCell>High Positive</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>STEM Education Support</TableCell>
                        <TableCell>3,500 students</TableCell>
                        <TableCell>$280,000</TableCell>
                        <TableCell>Medium Positive</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Healthcare Access Program</TableCell>
                        <TableCell>1,800 people</TableCell>
                        <TableCell>$175,000</TableCell>
                        <TableCell>Medium Positive</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Environmental Improvements</h3>
                <ol className="list-decimal pl-6 mt-2">
                  <li>Accelerate renewable energy transition at manufacturing facilities</li>
                  <li>Implement water recycling systems at high-consumption sites</li>
                  <li>Expand sustainable sourcing program to cover 85% of raw materials by 2025</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Social Enhancements</h3>
                <ol className="list-decimal pl-6 mt-2">
                  <li>Scale up apprenticeship program to additional locations</li>
                  <li>Develop supplier diversity program to support underrepresented businesses</li>
                  <li>Establish quantifiable targets for community program outcomes</li>
                </ol>
              </div>
            </div>
          </section>
        </div>
      </ReportViewer>
    </UnifiedSidebarLayout>
  );
};

export default ImpactReport;
