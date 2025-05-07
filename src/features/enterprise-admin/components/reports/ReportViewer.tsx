
import React, { useState } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface ReportViewerProps {
  title: string;
  reportType: 'BRSR' | 'GRI' | 'TCFD' | 'Impact';
  children: React.ReactNode;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ title, reportType, children }) => {
  const [currentView, setCurrentView] = useState<'preview' | 'pdf'>('preview');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    toast.info(`Preparing ${reportType} report for download...`);
    
    // In a real implementation, this would call an API to generate the PDF
    // For this demo, we'll simulate a PDF download after a short delay
    setTimeout(() => {
      // Create a file name for the download
      const fileName = `${reportType.toLowerCase()}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // In a real app, we would get a blob from the API
      // For now, we'll create a dummy PDF blob with minimal content
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
      
      setIsDownloading(false);
      toast.success(`${reportType} report downloaded successfully`);
    }, 1500);
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
            {children}
          </Card>
        </TabsContent>
        <TabsContent value="pdf" className="mt-4">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center min-h-[600px]">
            <div className="bg-white shadow-lg w-full max-w-4xl aspect-[1/1.414] p-8 mx-auto">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-center">{reportType} Report</h2>
                <p className="text-center text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              {children}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportViewer;
