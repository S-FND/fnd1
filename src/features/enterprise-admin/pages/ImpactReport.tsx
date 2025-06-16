
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ReportViewer from '../components/reports/ReportViewer';
import ExecutiveSummary from '../components/reports/impact/ExecutiveSummary';
import EnvironmentalImpactAssessment from '../components/reports/impact/EnvironmentalImpactAssessment';
import SocialImpactAssessment from '../components/reports/impact/SocialImpactAssessment';
import ImpactRecommendations from '../components/reports/impact/ImpactRecommendations';

const ImpactReport: React.FC = () => {
  return (
    <UnifiedSidebarLayout>
      <ReportViewer title="Impact Assessment Report" reportType="Impact">
        <div className="space-y-8">
          <ExecutiveSummary />
          <EnvironmentalImpactAssessment />
          <SocialImpactAssessment />
          <ImpactRecommendations />
        </div>
      </ReportViewer>
    </UnifiedSidebarLayout>
  );
};

export default ImpactReport;
