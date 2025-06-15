
import React from 'react';
import EmissionsSummaryCards from './EmissionsSummaryCards';

interface EmissionSummaryProps {
  totalAllScopes: number;
  scopeEmissionSummaries: Array<{
    scope: string;
    value: number;
    description: string;
    percentage: string;
  }>;
}

const EmissionsSummary: React.FC<EmissionSummaryProps> = ({ totalAllScopes, scopeEmissionSummaries }) => {
  return (
    <EmissionsSummaryCards 
      totalEmissions={totalAllScopes} 
      scopeEmissions={scopeEmissionSummaries} 
    />
  );
};

export default EmissionsSummary;
