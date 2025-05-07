
import React from 'react';
import ReportViewer from '../components/reports/ReportViewer';
import GeneralDisclosures from '../components/reports/brsr/GeneralDisclosures';
import ManagementDisclosures from '../components/reports/brsr/ManagementDisclosures';
import PrincipleWisePerformance from '../components/reports/brsr/PrincipleWisePerformance';
import ESGAssurance from '../components/reports/brsr/ESGAssurance';

const BRSRReport: React.FC = () => {
  return (
    <ReportViewer title="BRSR Report" reportType="BRSR">
      <div className="space-y-8">
        <GeneralDisclosures />
        <ManagementDisclosures />
        <PrincipleWisePerformance />
        <ESGAssurance />
      </div>
    </ReportViewer>
  );
};

export default BRSRReport;
