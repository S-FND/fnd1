
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ReportViewer from '../components/reports/ReportViewer';
import GeneralRequirements from '../components/reports/esrs/GeneralRequirements';
import GeneralDisclosures from '../components/reports/esrs/GeneralDisclosures';
import ThematicStandards from '../components/reports/esrs/ThematicStandards';

const ESRSReport: React.FC = () => {
  return (
    <UnifiedSidebarLayout>
      <ReportViewer title="ESRS Report: Translog India Ltd." reportType="ESRS">
        <div className="space-y-8">
          <GeneralRequirements />
          <GeneralDisclosures />
          <ThematicStandards />
        </div>
      </ReportViewer>
    </UnifiedSidebarLayout>
  );
};

export default ESRSReport;
