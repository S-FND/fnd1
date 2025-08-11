
import React, { useState } from 'react';
import { FileText } from 'lucide-react';

import { reportsData } from '../components/reports/ReportsData';
import ReportCard from '../components/reports/ReportCard';
import BRSRPreview from '../components/reports/previews/BRSRPreview';
import GRIPreview from '../components/reports/previews/GRIPreview';
import TCFDPreview from '../components/reports/previews/TCFDPreview';
import ESRSPreview from '../components/reports/previews/ESRSPreview';
import ImpactPreview from '../components/reports/previews/ImpactPreview';

const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const handleViewReport = (reportId: string) => {
    setActiveReport(reportId === activeReport ? null : reportId);
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
        {reportsData.map((report) => (
          <ReportCard
            key={report.id}
            id={report.id}
            title={report.title}
            description={report.description}
            path={report.path}
            onViewReport={handleViewReport}
            isActive={activeReport === report.id}
            previewComponent={renderReportPreview(report.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
