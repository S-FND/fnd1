
import React, { useState, useRef } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { logger } from '@/hooks/logger';

interface ReportViewerProps {
  title: string;
  reportType: 'BRSR' | 'GRI' | 'TCFD' | 'ESRS' | 'Impact';
  children: React.ReactNode;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ title, reportType, children }) => {
  const [currentView, setCurrentView] = useState<'preview' | 'pdf'>('preview');
  const [isDownloading, setIsDownloading] = useState(false);
  const reportContentRef = useRef<HTMLDivElement>(null);
  const allTabsContentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    toast.info(`Preparing ${reportType} report for download...`);
    
    try {
      // For GRI reports, we need to capture all tabs
      const isGRIReport = reportType === 'GRI';
      const contentRef = isGRIReport ? allTabsContentRef : reportContentRef;
      
      if (!contentRef.current) {
        throw new Error('Report content not found');
      }
      
      // Create a PDF document with the appropriate orientation
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate the width of the PDF
      const pdfWidth = doc.internal.pageSize.getWidth();
      
      // Create a canvas from the report content
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight,
        windowWidth: contentRef.current.scrollWidth,
        windowHeight: contentRef.current.scrollHeight,
      });
      
      // Get the canvas as an image
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate height based on aspect ratio
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 30; // Start position after the header
      
      // Add the title to the first page
      doc.setFontSize(16);
      doc.text(`${reportType} Report`, 14, 15);
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);
      
      // Add the image to the PDF, creating new pages as needed for long content
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - position);
      
      // Create additional pages if the content doesn't fit on one page
      while (heightLeft > 0) {
        position = 10; // Reset position for the new page
        doc.addPage();
        doc.addImage(
          imgData, 
          'PNG', 
          10, 
          position - (imgHeight - heightLeft), // Adjust the position to show the next portion of the image
          imgWidth, 
          imgHeight
        );
        heightLeft -= (pageHeight - position);
      }
      
      // Save the PDF
      const fileName = `${reportType.toLowerCase()}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setIsDownloading(false);
      toast.success(`${reportType} report downloaded successfully`);
    } catch (error) {
      logger.error('Error generating PDF:', error);
      setIsDownloading(false);
      toast.error(`Failed to download report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">
            This report is auto-populated based on your company's data.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="preview" onClick={() => setCurrentView('preview')}>Preview</TabsTrigger>
          <TabsTrigger value="pdf" onClick={() => setCurrentView('pdf')}>PDF View</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-4">
          <Card className="p-6 border print:border-none">
            <div ref={currentView === 'preview' ? reportContentRef : null} className="report-content">
              {children}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="pdf" className="mt-4">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center min-h-[600px]">
            <div className="bg-white shadow-lg w-full max-w-4xl p-8 mx-auto">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-center">{reportType} Report</h2>
                <p className="text-center text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <div ref={currentView === 'pdf' ? reportContentRef : null} className="report-content">
                {children}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Hidden div to store all content for GRI reports */}
      {reportType === 'GRI' && (
        <div className="hidden">
          <div ref={allTabsContentRef} className="p-8 bg-white">
            <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
            <p className="text-center text-muted-foreground mb-8">Generated on {new Date().toLocaleDateString()}</p>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
