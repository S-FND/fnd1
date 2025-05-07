
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

  const handleDownload = () => {
    toast.info(`Downloading ${reportType} report...`);
    // In a real implementation, this would call an API to generate and download the PDF
    setTimeout(() => {
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
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
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
