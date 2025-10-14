
import React from 'react';
import ReportViewer from '../components/reports/ReportViewer';
import GeneralRequirements from '../components/reports/esrs/GeneralRequirements';
import GeneralDisclosures from '../components/reports/esrs/GeneralDisclosures';
import ThematicStandards from '../components/reports/esrs/ThematicStandards';

const ESRSReport: React.FC = () => {
  return (
    <ReportViewer title="ESRS Report: Translog India Ltd." reportType="ESRS">
      <div className="space-y-8">
        <GeneralRequirements />
        <GeneralDisclosures />
        <ThematicStandards />
      </div>
    </ReportViewer>
  );
};

export default ESRSReport;
