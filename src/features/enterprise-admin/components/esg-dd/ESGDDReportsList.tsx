import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ESGDDReport } from '../../types/esgDD';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, ArrowDown, ArrowUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ESGDDReportsListProps {
  reports: ESGDDReport[];
  onViewReport?: (reportId: string) => void;
}

export const ESGDDReportsList: React.FC<ESGDDReportsListProps> = ({ reports, onViewReport }) => {
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{ key: keyof ESGDDReport; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  });
  const [downloading, setDownloading] = useState<string | null>(null);

  // Apply sorting
  const sortedReports = [...reports].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof ESGDDReport) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleView = (reportId: string) => {
    if (onViewReport) {
      onViewReport(reportId);
    } else {
      // Default view behavior if no handler provided
      console.log('Viewing report:', reportId);
      toast({
        title: "Report View",
        description: `Opening report ${reportId}`,
      });
    }
  };

  const handleDownload = async (report: ESGDDReport) => {
    try {
      setDownloading(report.id);
      
      // Simulate download - replace with actual API call
      console.log('Downloading report:', report.id);
      
      // Example of actual download implementation:
      if (report.fileUrl) {
        const response = await fetch(report.fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = report.title || `report-${report.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('No file URL available');
      }

      toast({
        title: "Download Successful",
        description: `${report.title} has been downloaded`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the report",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('title')}
            >
              Title
              {sortConfig.key === 'title' && (
                sortConfig.direction === 'asc' ? 
                  <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                  <ArrowDown className="h-4 w-4 inline ml-1" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('date')}
            >
              Date
              {sortConfig.key === 'date' && (
                sortConfig.direction === 'asc' ? 
                  <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                  <ArrowDown className="h-4 w-4 inline ml-1" />
              )}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <Badge 
                  variant={report.type === 'automated' ? 'default' : 'outline'}
                  className={
                    report.type === 'automated' ? 
                      'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                    report.type === 'manual' ? 
                      'bg-green-100 text-green-800 hover:bg-green-200' :
                      'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }
                >
                  {report.type === 'automated' ? 'Automated' : 
                   report.type === 'manual' ? 'Manual' : 'Uploaded'}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {report.title}
                {report.summary && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {report.summary.length > 60 
                      ? `${report.summary.substring(0, 60)}...` 
                      : report.summary
                    }
                  </div>
                )}
              </TableCell>
              <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={report.status === 'draft' ? 'text-amber-600' : 'text-green-600'}
                >
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleView(report.id)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(report)}
                    disabled={downloading === report.id}
                  >
                    {downloading === report.id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading
                      </span>
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {sortedReports.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No reports found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};