
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ReportsPage: React.FC = () => {
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
              <Button variant="secondary" disabled>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
