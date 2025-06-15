
import React from 'react';
import WorkforceDevelopment from './WorkforceDevelopment';
import CommunityImpactTable from './CommunityImpactTable';

const SocialImpactAssessment: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Social Impact Assessment</h2>
      <div className="space-y-6">
        <WorkforceDevelopment />
        <CommunityImpactTable />
      </div>
    </section>
  );
};

export default SocialImpactAssessment;
