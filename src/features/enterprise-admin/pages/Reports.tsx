import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye, FilePlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ReportsPage: React.FC = () => {
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const reports = [
    {
      id: 'brsr',
      title: 'BRSR Report',
      description: 'Business Responsibility and Sustainability Report - Comprehensive ESG disclosure framework for Indian companies.',
      path: '/reports/brsr',
    },
    {
      id: 'gri',
      title: 'GRI Report',
      description: 'Global Reporting Initiative - International standards for sustainability reporting.',
      path: '/reports/gri',
    },
    {
      id: 'tcfd',
      title: 'TCFD Report',
      description: 'Task Force on Climate-related Financial Disclosures - Framework for climate-related financial risk disclosures.',
      path: '/reports/tcfd',
    },
    {
      id: 'esrs',
      title: 'ESRS Report',
      description: 'European Sustainability Reporting Standards - EU framework for comprehensive sustainability disclosures.',
      path: '/reports/esrs',
    },
    {
      id: 'impact',
      title: 'Impact Assessment',
      description: 'Comprehensive analysis of environmental and social impacts of business activities.',
      path: '/reports/impact',
    },
  ];

  const handleViewReport = (reportId: string) => {
    setActiveReport(reportId === activeReport ? null : reportId);
  };

  const handleDownload = (reportId: string, reportTitle: string) => {
    setDownloadingReport(reportId);
    toast.info(`Preparing ${reportTitle} for download...`);
    
    try {
      // Create a PDF document with detailed report template
      const doc = new jsPDF();
      
      // Add report title and date
      doc.setFontSize(22);
      doc.text(reportTitle, 105, 20, { align: 'center' });
      doc.setFontSize(14);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      // Add company information section
      doc.setFontSize(16);
      doc.text('Company Information', 20, 50);
      doc.setFontSize(12);
      doc.text('Company: Translog India Ltd.', 20, 60);
      doc.text('Industry: Logistics & Transportation', 20, 68);
      doc.text('Reporting Period: Apr 2023 - Mar 2024', 20, 76);
      
      // Add report-specific content based on the report type
      doc.setFontSize(16);
      doc.text('Report Summary', 20, 96);
      doc.setFontSize(12);
      
      if (reportId === 'brsr') {
        doc.text('BRSR (Business Responsibility and Sustainability Report)', 20, 106);
        doc.text('Section A: General Disclosures - Completed', 20, 116);
        doc.text('- Corporate Identity: L63030MH1995PLC089758', 25, 124);
        doc.text('- Employees: 6,647 total (5,005 permanent, 1,642 contractual)', 25, 132);
        doc.text('Section B: Management and Process Disclosures - Completed', 20, 140);
        doc.text('- Ethics Policy: Board approved and implemented', 25, 148);
        doc.text('- ESG Governance: Sustainability Committee established', 25, 156);
        doc.text('Section C: Principle-wise Performance - Completed', 20, 164);
        doc.text('- Principle 1: Zero incidents of corruption', 25, 172);
        doc.text('- Principle 2: 15% reduction in energy usage', 25, 180);
      } else if (reportId === 'gri') {
        doc.text('GRI (Global Reporting Initiative) Standards', 20, 106);
        doc.text('GRI 102: General Disclosures - Completed', 20, 116);
        doc.text('- Organizational profile: Translog India Ltd.', 25, 124);
        doc.text('- Strategy and Ethics: Code of Conduct implemented', 25, 132);
        doc.text('GRI 300: Environmental Standards - Completed', 20, 140);
        doc.text('- GRI 302 Energy: 27,450 MWh total consumption', 25, 148);
        doc.text('- GRI 305 Emissions: 22,170 tCO2e (Scope 1 & 2)', 25, 156);
        doc.text('GRI 400: Social Standards - Completed', 20, 164);
        doc.text('- GRI 401 Employment: 6,647 total employees', 25, 172);
        doc.text('- GRI 403 Health & Safety: LTIFR 0.3, zero fatalities', 25, 180);
      } else if (reportId === 'tcfd') {
        doc.text('TCFD (Task Force on Climate-related Financial Disclosures)', 20, 106);
        doc.text('Governance - Completed', 20, 116);
        doc.text('- Board Oversight: Quarterly sustainability committee meetings', 25, 124);
        doc.text('- Management Role: CSO reports directly to CEO', 25, 132);
        doc.text('Strategy - Completed', 20, 140);
        doc.text('- Climate Risks: Physical and transition risks identified', 25, 148);
        doc.text('- Scenario Analysis: 2°C and 4°C scenarios assessed', 25, 156);
        doc.text('Risk Management - Completed', 20, 164);
        doc.text('- Risk Identification: Climate risks in ERM framework', 25, 172);
        doc.text('Metrics and Targets - Completed', 20, 180);
        doc.text('- Emissions: 22,170 tCO2e (Scope 1 & 2)', 25, 188);
        doc.text('- Targets: Net-zero by 2050, 50% reduction by 2030', 25, 196);
      } else if (reportId === 'esrs') {
        doc.text('ESRS (European Sustainability Reporting Standards)', 20, 106);
        doc.text('ESRS 1: General Requirements - Completed', 20, 116);
        doc.text('- Sustainability statement: Board approved and disclosed', 25, 124);
        doc.text('- Value chain assessment: Completed for tier 1 suppliers', 25, 132);
        doc.text('ESRS 2: General Disclosures - Completed', 20, 140);
        doc.text('- Governance & strategy: Integrated into business model', 25, 148);
        doc.text('- Risk management: ESG risks incorporated in ERM', 25, 156);
        doc.text('Thematic Standards (ESRS 3-12) - Completed', 20, 164);
        doc.text('- Climate change: Emissions reduction of 12%', 25, 172);
        doc.text('- Biodiversity: Natural habitat protection program', 25, 180);
        doc.text('- Human rights: Supply chain due diligence implemented', 25, 188);
      } else {
        doc.text('Impact Assessment Report', 20, 106);
        doc.text('Environmental Impact Assessment - Completed', 20, 116);
        doc.text('- Climate Impact: 15.1% reduction in GHG emissions', 25, 124);
        doc.text('- Resource Usage: 8.2% reduction in water consumption', 25, 132);
        doc.text('- Biodiversity: 45 hectares of habitat restoration', 25, 140);
        doc.text('Social Impact Assessment - Completed', 20, 148);
        doc.text('- Workforce: 120 new jobs in underserved communities', 25, 156);
        doc.text('- Community: 10,000+ beneficiaries of community programs', 25, 164);
        doc.text('Recommendations - Completed', 20, 172);
        doc.text('- Environmental: Accelerate renewable energy transition', 25, 180);
        doc.text('- Social: Scale up apprenticeship program', 25, 188);
      }
      
      // Add note to view full report
      doc.setFontSize(10);
      doc.text('This is a summary report. View the full interactive report on the platform.', 105, 270, { align: 'center' });
      
      // Save the PDF
      const fileName = `${reportId}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setDownloadingReport(null);
      toast.success(`${reportTitle} downloaded successfully`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setDownloadingReport(null);
      toast.error(`Failed to download report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Function to render report preview content
  const renderReportPreview = (reportId: string) => {
    switch (reportId) {
      case 'brsr':
        return <BRSRPreview />;
      case 'gri':
        return <GRIPreview />;
      case 'tcfd':
        return <TCFDPreview />;
      case 'esrs':
        return <ESRSPreview />;
      case 'impact':
        return <ImpactPreview />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sustainability Reports</h1>
        <p className="text-muted-foreground mt-2">
          Generate and download standardized sustainability reports based on your company data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <div className="text-sm text-muted-foreground">
                Auto-populated with your company's sustainability data
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => handleViewReport(report.id)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {activeReport === report.id ? 'Hide Preview' : 'Preview'}
              </Button>
              <div className="space-x-2">
                <Button asChild variant="outline">
                  <Link to={report.path}>View Full Report</Link>
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => handleDownload(report.id, report.title)}
                  disabled={downloadingReport === report.id}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadingReport === report.id ? 'Downloading...' : 'Download'}
                </Button>
              </div>
            </CardFooter>
            {activeReport === report.id && (
              <CardContent className="pt-0 border-t">
                <div className="p-4 bg-muted/30 rounded-md max-h-96 overflow-auto">
                  {renderReportPreview(report.id)}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// Report preview components
const BRSRPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">BRSR Report Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Financial Year: 2023-24 | Generated on: {new Date().toLocaleDateString()}
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Section A: General Disclosures</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Corporate Identity Number</TableCell>
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
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Section B: Management and Process Disclosures</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Policy for business ethics</TableCell>
            <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Yes</Badge></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">ESG risks in overall risk management</TableCell>
            <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Yes</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Section C: Principle-wise Performance</h4>
      <p className="text-sm mb-2">Key metrics across the 9 principles of BRSR:</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Principle 1: Ethics & Transparency</p>
          <p className="text-xs text-muted-foreground">0 corruption incidents</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Principle 2: Product Lifecycle</p>
          <p className="text-xs text-muted-foreground">15% reduction in resource use</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Principle 3: Employee Well-being</p>
          <p className="text-xs text-muted-foreground">98.5% health coverage</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Principle 4: Stakeholders</p>
          <p className="text-xs text-muted-foreground">12 engagement programs</p>
        </div>
      </div>
    </div>
  </div>
);

const GRIPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">GRI Report Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Reporting Period: April 2023 - March 2024
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">GRI 102: General Disclosures</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">102-1 Organization name</TableCell>
            <TableCell>Translog India Ltd.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">102-2 Activities, brands, products, services</TableCell>
            <TableCell>Integrated logistics solutions provider</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">102-3 Headquarters location</TableCell>
            <TableCell>Mumbai, India</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">GRI 300: Environmental Standards</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">GRI 302: Energy</p>
          <p className="text-xs text-muted-foreground">Total consumption: 27,450 MWh</p>
          <p className="text-xs text-muted-foreground">Renewable energy: 22%</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">GRI 303: Water</p>
          <p className="text-xs text-muted-foreground">Total withdrawal: 125,000 m³</p>
          <p className="text-xs text-muted-foreground">Recycled: 35%</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">GRI 305: Emissions</p>
          <p className="text-xs text-muted-foreground">Scope 1: 15,280 tCO₂e</p>
          <p className="text-xs text-muted-foreground">Scope 2: 6,890 tCO₂e</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">GRI 306: Waste</p>
          <p className="text-xs text-muted-foreground">Total waste: 4,850 tonnes</p>
          <p className="text-xs text-muted-foreground">Recycled: 62%</p>
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">GRI 400: Social Standards</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">GRI 401: Employment</TableCell>
            <TableCell>6,647 employees, 22% women, 8.5% turnover rate</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">GRI 403: Health & Safety</TableCell>
            <TableCell>0 fatalities, LTIFR 0.3, 16 safety training hours/employee</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
);

const TCFDPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">TCFD Report Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Climate-related Financial Disclosures | FY 2023-24
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Governance</h4>
      <p className="text-sm mb-2">Board oversight and management's role in assessing and managing climate-related risks and opportunities:</p>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Board Oversight</TableCell>
            <TableCell>
              <ul className="list-disc pl-4 text-sm">
                <li>Quarterly Sustainability Committee meetings</li>
                <li>Board-approved Climate Strategy</li>
              </ul>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Management Role</TableCell>
            <TableCell>
              <ul className="list-disc pl-4 text-sm">
                <li>CSO reports directly to CEO</li>
                <li>Climate targets linked to executive compensation</li>
              </ul>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Strategy</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Short-term (0-3 years)</p>
          <ul className="list-disc pl-4 text-xs">
            <li>Fuel efficiency programs</li>
            <li>Route optimization</li>
          </ul>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Medium-term (3-10 years)</p>
          <ul className="list-disc pl-4 text-xs">
            <li>Fleet electrification</li>
            <li>Renewable energy transition</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Risk Management</h4>
      <p className="text-sm mb-2">Climate risks integrated into Enterprise Risk Management:</p>
      <div className="border rounded-md p-2">
        <p className="text-xs font-medium">Physical Risks:</p>
        <ul className="list-disc pl-4 text-xs">
          <li>Disruption to operations from extreme weather</li>
          <li>Damage to infrastructure</li>
        </ul>
      </div>
      <div className="border rounded-md p-2 mt-2">
        <p className="text-xs font-medium">Transition Risks:</p>
        <ul className="list-disc pl-4 text-xs">
          <li>Carbon pricing mechanisms</li>
          <li>Shift to low-carbon technologies</li>
        </ul>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Metrics & Targets</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Total Emissions</TableCell>
            <TableCell>22,170 tCO₂e (Scope 1 & 2)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Emission Intensity</TableCell>
            <TableCell>18.2 tCO₂e per million revenue</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">2030 Target</TableCell>
            <TableCell>50% reduction in absolute emissions</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">2050 Target</TableCell>
            <TableCell>Net-zero emissions</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
);

const ESRSPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">ESRS Report Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        European Sustainability Reporting Standards | FY 2023-24
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">ESRS 1: General Requirements</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Sustainability statement</TableCell>
            <TableCell>Board approved and publicly disclosed</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Double materiality assessment</TableCell>
            <TableCell>Completed and validated by third party</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Value chain assessment</TableCell>
            <TableCell>100% of tier 1 suppliers, 65% of tier 2 suppliers</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">ESRS 2: General Disclosures</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Strategy & Business Model</p>
          <p className="text-xs text-muted-foreground">Sustainability integrated into core operations</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Governance & Organization</p>
          <p className="text-xs text-muted-foreground">Board oversight, ESG committee established</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Policies & Targets</p>
          <p className="text-xs text-muted-foreground">12 sustainability policies, 8 targets set</p>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Stakeholder Engagement</p>
          <p className="text-xs text-muted-foreground">8 key stakeholder groups engaged</p>
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Thematic Standards (ESRS 3-12)</h4>
      <Separator className="my-2" />
      <h5 className="text-sm font-medium mb-1">Climate Change (ESRS E1)</h5>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">GHG emissions</TableCell>
            <TableCell>12% reduction year-over-year</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Energy consumption</TableCell>
            <TableCell>27,450 MWh, 22% renewable sources</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <Separator className="my-2" />
      <h5 className="text-sm font-medium mb-1">Biodiversity & Ecosystems (ESRS E4)</h5>
      <p className="text-xs mb-2">Key initiatives:</p>
      <ul className="list-disc pl-4 text-xs">
        <li>Natural habitat protection around logistics facilities</li>
        <li>Biodiversity impact assessment completed for 85% of operations</li>
      </ul>
      
      <Separator className="my-2" />
      <h5 className="text-sm font-medium mb-1">Human Rights (ESRS S1)</h5>
      <p className="text-xs mb-2">Due diligence process:</p>
      <ul className="list-disc pl-4 text-xs">
        <li>Human rights policy implemented across all operations</li>
        <li>Supply chain due diligence covering 80% of critical suppliers</li>
        <li>Grievance mechanisms accessible to all stakeholders</li>
      </ul>
    </div>
  </div>
);

const ImpactPreview: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold mb-2">Impact Assessment Preview: Translog India Ltd.</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Environmental and Social Impact Analysis | FY 2023-24
      </p>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Environmental Impact</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Impact Category</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Change (YoY)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>GHG Emissions</TableCell>
            <TableCell>22,170 tCO₂e</TableCell>
            <TableCell className="text-green-600">-15.1%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Water Consumption</TableCell>
            <TableCell>125,000 m³</TableCell>
            <TableCell className="text-green-600">-8.2%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Waste Generation</TableCell>
            <TableCell>4,850 tonnes</TableCell>
            <TableCell className="text-green-600">-5.7%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Habitat Restoration</TableCell>
            <TableCell>45 hectares</TableCell>
            <TableCell className="text-green-600">+12 hectares</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Social Impact</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Workforce Development</p>
          <ul className="list-disc pl-4 text-xs">
            <li>120 new jobs in underserved communities</li>
            <li>42 hours of training per employee</li>
          </ul>
        </div>
        <div className="border rounded-md p-2">
          <p className="text-xs font-medium">Community Engagement</p>
          <ul className="list-disc pl-4 text-xs">
            <li>₹18.5 Crore invested in CSR</li>
            <li>10,000+ community program beneficiaries</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">SDG Contributions</h4>
      <div className="grid grid-cols-3 gap-2">
        <Badge variant="outline" className="justify-center py-1">
          SDG 8: Decent Work
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 9: Industry & Innovation
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 11: Sustainable Cities
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 12: Responsible Consumption
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 13: Climate Action
        </Badge>
        <Badge variant="outline" className="justify-center py-1">
          SDG 17: Partnerships
        </Badge>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Impact Recommendations</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Area</TableHead>
            <TableHead>Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Environmental</TableCell>
            <TableCell>Accelerate renewable energy transition for warehouses</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Social</TableCell>
            <TableCell>Scale up driver welfare and apprenticeship programs</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Governance</TableCell>
            <TableCell>Enhance ESG data collection and verification processes</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
);

export default ReportsPage;
