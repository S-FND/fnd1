
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScopeEmissionsChart from '../ScopeEmissionsChart';
import TopEmissionSources from '../TopEmissionSources';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface ChartDataItem {
  month: string;
  scope1?: number;
  scope2?: number;
  scope3?: number;
  [key: string]: number | string | undefined;
}

interface DetailItem {
  name: string;
  value: number;
  unit: string;
}

export interface ScopeTabContentProps {
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
  detailedData: DetailItem[];
  detailedLabels: string[];
  chartData?: ChartDataItem[];
  chartDataKey?: string;
  additionalMetrics?: Array<{ label: string; value: string }>;
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
  chartData,
  chartDataKey,
  additionalMetrics,
}) => {
  const totalEmissions = data.reduce((sum, item) => sum + item.value, 0);

  const renderDetailedBarChart = () => {
    if (!detailedData || detailedData.length === 0) return null;
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={detailedData} layout="vertical" margin={{ left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip formatter={(value) => [`${value} tCO₂e`, '']} />
          <Bar dataKey="value" fill={color} name="tCO₂e" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderMonthlyTrend = () => {
    if (!chartData || !chartDataKey) return null;
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} tCO₂e`, '']} />
          <Legend />
          <Bar dataKey={chartDataKey} fill={color} name={`Scope ${scopeNumber}`} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{totalEmissions} tCO₂e</div>
            <p className="text-sm text-muted-foreground mb-6">{description}</p>
            
            {additionalMetrics && additionalMetrics.length > 0 && (
              <div className="space-y-4 border-t pt-4">
                {additionalMetrics.map((metric, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <span className="text-sm font-medium">{metric.value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Emissions Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ScopeEmissionsChart data={data} color={color} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sources">
            <TabsList className="mb-4">
              <TabsTrigger value="sources">Top Sources</TabsTrigger>
              <TabsTrigger value="details">Detailed Data</TabsTrigger>
              {chartData && chartDataKey && (
                <TabsTrigger value="trend">Monthly Trend</TabsTrigger>
              )}
              <TabsTrigger value="guidance">Reduction Guidance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources">
              <TopEmissionSources data={data} color={color} />
            </TabsContent>
            
            <TabsContent value="details">
              <div className="space-y-4">
                {detailedLabels.map((label, index) => (
                  <div key={index}>
                    <h4 className="font-medium mb-2">{label}</h4>
                    {renderDetailedBarChart()}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {chartData && chartDataKey && (
              <TabsContent value="trend">
                <h4 className="font-medium mb-4">Monthly Emissions Trend</h4>
                {renderMonthlyTrend()}
              </TabsContent>
            )}
            
            <TabsContent value="guidance">
              {details}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScopeTabContent;
