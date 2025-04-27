
import React from 'react';
import FandoroNonCompliances from './compliance/FandoroNonCompliances';
import FandoroESGRisks from './risks/FandoroESGRisks';
import AnalyticsCards from './analytics/AnalyticsCards';
import DataTabs from './data-tables/DataTabs';

const FandoroAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <AnalyticsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <FandoroNonCompliances />
        <FandoroESGRisks />
      </div>

      <DataTabs />
    </div>
  );
};

export default FandoroAdminDashboard;
