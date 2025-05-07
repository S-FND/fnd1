
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const ReportsPage: React.FC = () => {
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

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
      id: 'impact',
      title: 'Impact Assessment',
      description: 'Comprehensive analysis of environmental and social impacts of business activities.',
      path: '/reports/impact',
    },
  ];

  const handleDownload = (reportId: string, reportTitle: string) => {
    setDownloadingReport(reportId);
    toast.info(`Preparing ${reportTitle} for download...`);
    
    try {
      // Create a PDF document with basic report template
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
      doc.text('Company: Fandoro Enterprises Ltd.', 20, 60);
      doc.text('Industry: Sustainable Manufacturing', 20, 68);
      doc.text('Reporting Period: Jan 2023 - Dec 2023', 20, 76);
      
      // Add report-specific content
      doc.setFontSize(16);
      doc.text('Report Summary', 20, 96);
      doc.setFontSize(12);
      
      if (reportId === 'brsr') {
        doc.text('BRSR (Business Responsibility and Sustainability Report)', 20, 106);
        doc.text('Section A: General Disclosures - Completed', 20, 116);
        doc.text('Section B: Management and Process Disclosures - Completed', 20, 124);
        doc.text('Section C: Principle-wise Performance - Completed', 20, 132);
      } else if (reportId === 'gri') {
        doc.text('GRI (Global Reporting Initiative) Standards', 20, 106);
        doc.text('GRI 102: General Disclosures - Completed', 20, 116);
        doc.text('GRI 300: Environmental Standards - Completed', 20, 124);
        doc.text('GRI 400: Social Standards - In Progress', 20, 132);
      } else if (reportId === 'tcfd') {
        doc.text('TCFD (Task Force on Climate-related Financial Disclosures)', 20, 106);
        doc.text('Governance - Completed', 20, 116);
        doc.text('Strategy - Completed', 20, 124);
        doc.text('Risk Management - Completed', 20, 132);
        doc.text('Metrics and Targets - Completed', 20, 140);
      } else {
        doc.text('Impact Assessment Report', 20, 106);
        doc.text('Environmental Impact Assessment - Completed', 20, 116);
        doc.text('Social Impact Assessment - Completed', 20, 124);
        doc.text('Recommendations - Completed', 20, 132);
      }
      
      // Add note to view full report
      doc.setFontSize(10);
      doc.text('Note: This is a summary. View the full report on the platform.', 105, 200, { align: 'center' });
      
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sustainability Reports</h1>
        <p className="text-muted-foreground mt-2">
          Generate and download standardized sustainability reports based on your company data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
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
              <Button asChild variant="outline">
                <Link to={report.path}>View Report</Link>
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => handleDownload(report.id, report.title)}
                disabled={downloadingReport === report.id}
              >
                <Download className="mr-2 h-4 w-4" />
                {downloadingReport === report.id ? 'Downloading...' : 'Download'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
