
import React from 'react';
import ClimateImpactTable from './ClimateImpactTable';
import ResourceUsageTable from './ResourceUsageTable';
import BiodiversityImpact from './BiodiversityImpact';

const EnvironmentalImpactAssessment: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Environmental Impact Assessment</h2>
      <div className="space-y-6">
        <ClimateImpactTable />
        <ResourceUsageTable />
        <BiodiversityImpact />
      </div>
    </section>
  );
};

export default EnvironmentalImpactAssessment;
