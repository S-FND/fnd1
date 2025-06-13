import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ReportViewer from '../components/reports/ReportViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const TCFDReport: React.FC = () => {
  return (
    <UnifiedSidebarLayout>
      <ReportViewer title="TCFD Report" reportType="TCFD">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Governance</h2>
            <p className="text-muted-foreground mb-4">Disclose the organization's governance around climate-related risks and opportunities.</p>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Board Oversight</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>The Board of Directors maintains oversight of climate-related risks through the Sustainability Committee, which meets quarterly. This committee is chaired by an independent director with expertise in environmental management.</p>
                  <p className="mt-2">Key responsibilities include:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Review and approval of climate strategy</li>
                    <li>Monitoring of climate targets and goals</li>
                    <li>Assessment of climate-related financial impacts</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Management's Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>A dedicated Climate Risk Management team led by the Chief Sustainability Officer (CSO) is responsible for day-to-day management of climate-related issues. The CSO reports directly to the CEO and provides quarterly updates to the Sustainability Committee.</p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Strategy</h2>
            <p className="text-muted-foreground mb-4">Disclose the actual and potential impacts of climate-related risks and opportunities on the organization's businesses, strategy, and financial planning.</p>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Climate-Related Risks and Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold">Short-term (0-3 years)</h4>
                    <Separator className="my-2" />
                    <p>Increased frequency of extreme weather events impacting supply chain reliability. Opportunities in energy efficiency technologies and carbon offset markets.</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold">Medium-term (3-10 years)</h4>
                    <Separator className="my-2" />
                    <p>Policy changes including carbon pricing mechanisms affecting operational costs. Market shifts toward low-carbon products creating new revenue streams.</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold">Long-term (10+ years)</h4>
                    <Separator className="my-2" />
                    <p>Chronic physical risks including water scarcity and rising temperatures. Strategic repositioning as a climate solutions provider enhances brand value.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Risk Management</h2>
            <p className="text-muted-foreground mb-4">Disclose how the organization identifies, assesses, and manages climate-related risks.</p>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Identification and Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Climate-related risks are integrated into the company's enterprise risk management (ERM) framework. The risk assessment process includes:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Annual climate scenario analysis using IPCC RCP 2.6, 4.5, and 8.5 scenarios</li>
                    <li>Quarterly review of emerging regulatory developments</li>
                    <li>Value chain vulnerability assessments</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Management Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>The company employs a tiered approach to risk management:</p>
                  <ol className="list-decimal pl-6 mt-2">
                    <li>Risk prioritization based on financial impact and probability</li>
                    <li>Development of mitigation strategies for high-priority risks</li>
                    <li>Implementation of adaptation measures for unavoidable risks</li>
                    <li>Continuous monitoring and reporting</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Metrics and Targets</h2>
            <p className="text-muted-foreground mb-4">Disclose the metrics and targets used to assess and manage relevant climate-related risks and opportunities.</p>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6">
                    <li>Scope 1 GHG Emissions: 4,820 tCO2e (2023)</li>
                    <li>Scope 2 GHG Emissions: 9,350 tCO2e (2023)</li>
                    <li>Scope 3 GHG Emissions: 18,500 tCO2e (2023)</li>
                    <li>Carbon intensity: 0.35 tCO2e per million revenue</li>
                    <li>Renewable energy usage: 45% of total energy consumption</li>
                    <li>Water intensity: 0.82 m³ per unit of production</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Climate Targets</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6">
                    <li>50% reduction in absolute Scope 1 and 2 emissions by 2030 (baseline: 2020)</li>
                    <li>30% reduction in Scope 3 emissions by 2030 (baseline: 2020)</li>
                    <li>Net-zero emissions across all scopes by 2050</li>
                    <li>100% renewable electricity by 2035</li>
                    <li>Zero waste to landfill by 2025</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </ReportViewer>
    </UnifiedSidebarLayout>
  );
};

export default TCFDReport;
