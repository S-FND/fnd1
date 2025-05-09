
import React from 'react';
import { EmissionsSummaryPanelProps } from './types';

const EmissionsSummaryPanel: React.FC<EmissionsSummaryPanelProps> = ({
  monthlyTotal,
  yearlyTotal,
  selectedMonth,
  selectedYear
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Emissions</h3>
        <p className="text-2xl font-bold">{monthlyTotal.toFixed(2)} tCO₂e</p>
        <p className="text-xs text-muted-foreground">For {selectedMonth} {selectedYear}</p>
      </div>
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Yearly Emissions</h3>
        <p className="text-2xl font-bold">{yearlyTotal.toFixed(2)} tCO₂e</p>
        <p className="text-xs text-muted-foreground">Total for {selectedYear}</p>
      </div>
    </div>
  );
};

export default EmissionsSummaryPanel;
