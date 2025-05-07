
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    
    // In a real implementation, this would call an API to generate the PDF
    setTimeout(() => {
      // Create a file name for the download
      const fileName = `${reportId}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Create a dummy PDF blob
      const pdfContent = `%PDF-1.7
1 0 obj
<</Type/Catalog/Pages 2 0 R>>
endobj
2 0 obj
<</Type/Pages/Count 1/Kids[3 0 R]>>
endobj
3 0 obj
<</Type/Page/Parent 2 0 R/Resources<<>>/MediaBox[0 0 595 842]>>
endobj
xref
0 4
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000102 00000 n
trailer
<</Size 4/Root 1 0 R>>
startxref
178
%%EOF
      `;
      
      // Create a Blob object representing the PDF file
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      // Create an object URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloadingReport(null);
      toast.success(`${reportTitle} downloaded successfully`);
    }, 1500);
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
