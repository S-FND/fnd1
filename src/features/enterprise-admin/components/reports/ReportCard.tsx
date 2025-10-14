
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { logger } from '@/hooks/logger';

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  path: string;
  onViewReport: (reportId: string) => void;
  isActive: boolean;
  previewComponent: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  id, 
  title, 
  description, 
  path, 
  onViewReport, 
  isActive, 
  previewComponent 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    toast.info(`Preparing ${title} for download...`);
    
    try {
      // Create a PDF document with detailed report template
      const doc = new jsPDF();
      
      // Add report title and date
      doc.setFontSize(22);
      doc.text(title, 105, 20, { align: 'center' });
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
      
      if (id === 'brsr') {
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
      } else if (id === 'gri') {
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
      } else if (id === 'tcfd') {
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
      } else if (id === 'esrs') {
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
      const fileName = `${id}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setIsDownloading(false);
      toast.success(`${title} downloaded successfully`);
    } catch (error) {
      logger.error('Error generating PDF:', error);
      setIsDownloading(false);
      toast.error(`Failed to download report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-4">
        <div className="text-sm text-muted-foreground">
          Auto-populated with your company's sustainability data
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => onViewReport(id)}
        >
          <Eye className="mr-2 h-4 w-4" />
          {isActive ? 'Hide Preview' : 'Preview'}
        </Button>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link to={path}>View Full Report</Link>
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>
      </CardFooter>
      {isActive && (
        <CardContent className="pt-0 border-t">
          <div className="p-4 bg-muted/30 rounded-md max-h-96 overflow-auto">
            {previewComponent}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ReportCard;
