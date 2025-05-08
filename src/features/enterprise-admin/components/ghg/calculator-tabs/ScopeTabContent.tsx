
import React from 'react';
import ScopeEmissionsChart from '../ScopeEmissionsChart';
import ScopeDetailCards from '../ScopeDetailCards';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

interface ScopeTabContentProps {
  scopeNumber: number;
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
  chartData?: Array<any>;
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
  // Split detailedData into separate arrays based on detailedLabels
  let detailedDataArrays: Array<{
    name: string;
    value: number;
    unit: string;
  }>[] = [];
  
  if (detailedLabels.length > 1 && Array.isArray(detailedData)) {
    // Assume detailedData is an array of mixed items that needs to be split
    let currentIndex = 0;
    detailedDataArrays = detailedLabels.map(() => {
      const startIndex = currentIndex;
      const chunkSize = Math.ceil((detailedData.length - startIndex) / (detailedLabels.length - detailedLabels.indexOf(detailedLabels[detailedLabels.indexOf(detailedLabels[startIndex])])));
      currentIndex += chunkSize;
      return detailedData.slice(startIndex, currentIndex);
    });
  } else {
    // Just use the single array
    detailedDataArrays = [detailedData];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <ScopeEmissionsChart
              data={data}
              title={title}
              color={color}
            />
          </CardContent>
        </Card>
        
        {chartData && chartDataKey && (
          <Card>
            <CardContent className="pt-6 h-[300px]">
              <h3 className="font-medium mb-3">Monthly Emissions</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey={chartDataKey} 
                    stroke={color} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
      
      <ScopeDetailCards
        scopeNumber={scopeNumber}
        description={description}
        details={details}
        detailedData={detailedDataArrays}
        detailedLabels={detailedLabels}
        additionalMetrics={additionalMetrics}
        chartData={chartData}
        chartDataKey={chartDataKey}
        chartColor={color}
      />
    </div>
  );
};

export default ScopeTabContent;
