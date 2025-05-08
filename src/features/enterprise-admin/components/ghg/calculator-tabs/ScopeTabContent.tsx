
import React from 'react';
import ScopeEmissionsChart from '../ScopeEmissionsChart';
import ScopeDetailCards from '../ScopeDetailCards';

interface ScopeTabContentProps {
  scopeNumber: 1 | 2 | 3;
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  title: string;
  color: string;
  description: string;
  details: React.ReactNode;
  detailedData: Array<{
    name: string;
    value: number;
    unit: string;
  }>; 
  detailedLabels: string[];
  additionalMetrics?: Array<{
    label: string;
    value: string;
  }>;
  chartData?: any;
  chartDataKey?: string;
}

const ScopeTabContent: React.FC<ScopeTabContentProps> = ({
  scopeNumber,
  data,
  title,
  color,
  description,
  details,
  detailedData,
  detailedLabels,
  additionalMetrics,
  chartData,
  chartDataKey,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <ScopeEmissionsChart 
          data={data} 
          title={title} 
          color={color} 
        />
      </div>
      
      <ScopeDetailCards 
        scopeNumber={scopeNumber}
        description={description} 
        details={details}
        detailedData={detailedData}
        detailedLabels={detailedLabels}
        additionalMetrics={additionalMetrics}
        chartData={chartData}
        chartDataKey={chartDataKey}
      />
    </div>
  );
};

export default ScopeTabContent;
