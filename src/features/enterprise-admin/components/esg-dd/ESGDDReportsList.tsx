
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ESGDDReport } from '../../types/esgDD';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, ArrowDown, ArrowUp } from 'lucide-react';

interface ESGDDReportsListProps {
  reports: ESGDDReport[];
}

export const ESGDDReportsList: React.FC<ESGDDReportsListProps> = ({ reports }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof ESGDDReport; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  });

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

  // Sort function
  const requestSort = (key: keyof ESGDDReport) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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
            {/* <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('companyName')}
            >
              Company
              {sortConfig.key === 'companyName' && (
                sortConfig.direction === 'asc' ? 
                  <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                  <ArrowDown className="h-4 w-4 inline ml-1" />
              )}
            </TableHead> */}
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
              {/* <TableCell>{report.companyName}</TableCell> */}
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
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {sortedReports.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No reports found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
