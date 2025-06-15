
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from 'recharts';

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
  detailedLabels?: string[];
  additionalMetrics?: Array<{
    label: string;
    value: string;
  }>;
  chartData?: Array<{
    month: string;
    scope1: number;
    scope2: number;
    scope3: number;
  }>;
  chartDataKey?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ScopeTabContent: React.FC<ScopeTabContentProps> = ({
  scopeNumber,
  data,
  title,
  color,
  description,
  details,
  detailedData,
  detailedLabels = [],
  additionalMetrics = [],
  chartData = [],
  chartDataKey = '',
}) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} tCO₂e`, 'Emissions']} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
            <CardDescription>
              Breakdown of Scope {scopeNumber} emission sources for IMR Resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart
                  data={data}
                  barSize={20}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} tCO₂e`, 'Emissions']} />
                  <Bar dataKey="value" fill={color} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {additionalMetrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {additionalMetrics.map((metric, i) => (
                  <div key={i} className="bg-muted p-2 rounded text-sm">
                    <span className="font-medium">{metric.label}:</span> {metric.value}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="data">Emission Data</TabsTrigger>
          {chartData.length > 0 && (
            <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {details}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Emissions Data</CardTitle>
              <CardDescription>
                Activity data and resulting emissions for IMR Resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {detailedLabels.map((label, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{label}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left py-2 px-2 border-b">Source</th>
                            <th className="text-right py-2 px-2 border-b">Amount</th>
                            <th className="text-right py-2 px-2 border-b">Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailedData.map((item, i) => (
                            <tr key={i} className="border-b border-b-muted">
                              <td className="py-2 px-2">{item.name}</td>
                              <td className="text-right py-2 px-2">{item.value.toLocaleString()}</td>
                              <td className="text-right py-2 px-2">{item.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {chartData.length > 0 && chartDataKey && (
          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emissions Trend</CardTitle>
                <CardDescription>Monthly trend for Scope {scopeNumber} emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`${value} tCO₂e`, 'Emissions']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={chartDataKey}
                        stroke={color}
                        activeDot={{ r: 8 }}
                        name={`Scope ${scopeNumber}`}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ScopeTabContent;
