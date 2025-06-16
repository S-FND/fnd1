
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ReportViewer from '../components/reports/ReportViewer';
import GeneralDisclosures from '../components/reports/brsr/general-disclosures';
import ManagementDisclosures from '../components/reports/brsr/ManagementDisclosures';
import PrincipleWisePerformance from '../components/reports/brsr/PrincipleWisePerformance';
import ESGAssurance from '../components/reports/brsr/ESGAssurance';

const BRSRReport: React.FC = () => {
  return (
    <UnifiedSidebarLayout>
      <ReportViewer title="BRSR Report: Translog India Ltd." reportType="BRSR">
        <div className="space-y-8">
          <GeneralDisclosures />
          <ManagementDisclosures />
          <PrincipleWisePerformance />
          <ESGAssurance />
        </div>
      </ReportViewer>
    </UnifiedSidebarLayout>
  );
};

export default BRSRReport;
