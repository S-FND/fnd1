import React from 'react';
import { MakerDashboard } from '@/components/maker-checker/MakerDashboard';

const MakerDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Submissions</h1>
        <p className="text-muted-foreground mt-2">
          Track the status of your submitted changes and approval requests
        </p>
      </div>
      <MakerDashboard />
    </div>
  );
};

export default MakerDashboardPage;
