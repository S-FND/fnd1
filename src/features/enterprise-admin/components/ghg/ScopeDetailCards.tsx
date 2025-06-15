
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DetailItem {
  name: string;
  value: number;
  unit: string;
}

interface ScopeDetailCardsProps {
  scopeNumber: number;
  description: string;
  details: React.ReactNode;
  detailedData?: DetailItem[][];
  detailedLabels?: string[];
  chartData?: any[];
  chartDataKey?: string;
  chartColor?: string;
  additionalMetrics?: {
    label: string;
    value: string;
  }[];
}

const ScopeDetailCards: React.FC<ScopeDetailCardsProps> = ({
  scopeNumber,
  description,
  details,
  detailedData = [],
  detailedLabels = [],
  chartData,
  chartDataKey,
  chartColor,
  additionalMetrics = []
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About Scope {scopeNumber}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {details}
        </CardContent>
      </Card>
      
      {detailedData.map((dataGroup, i) => (
        <div key={i}>
          <h3 className="font-medium mb-3">{detailedLabels[i]} Breakdown</h3>
          <div className="space-y-2">
            {dataGroup.map((item, j) => (
              <div key={j} className="flex justify-between text-sm border-b pb-1">
                <span>{item.name}</span>
                <span>{item.value} {item.unit}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {chartData && chartDataKey && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Scope {scopeNumber} Emissions Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={chartDataKey} 
                  name={`Scope ${scopeNumber}`} 
                  stroke={chartColor || '#8884d8'} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      
      {additionalMetrics.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-2">
          {additionalMetrics.map((metric, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{metric.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScopeDetailCards;
