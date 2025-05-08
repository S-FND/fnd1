
import React from 'react';
import EmissionsByScope from './summary/EmissionsByScope';
import EmissionsOverTime from './summary/EmissionsOverTime';
import MonthlyEmissionsTrend from './summary/MonthlyEmissionsTrend';
import DataCompleteness from './summary/DataCompleteness';
import { emissionsByScope, emissionsTrend, monthlyEmissionsData } from './summary/mockData';

export const GHGSummary = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmissionsByScope emissionsByScope={emissionsByScope} />
        <EmissionsOverTime emissionsTrend={emissionsTrend} />
      </div>

      <MonthlyEmissionsTrend monthlyData={monthlyEmissionsData} />
      <DataCompleteness completenessData={emissionsByScope} />
    </div>
  );
};
