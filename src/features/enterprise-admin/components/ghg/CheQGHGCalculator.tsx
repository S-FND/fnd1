
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { cheqEmissionsData } from '../../data/cheq-mock-data';
import { Download, FileText, Info, Share2 } from 'lucide-react';

// Scope colors for charts
const SCOPE_COLORS = {
  scope1: "#22c55e", // Green
  scope2: "#60a5fa", // Blue
  scope3: "#f59e0b"  // Amber
};

// Color array for pie chart segments
const COLORS = [SCOPE_COLORS.scope1, SCOPE_COLORS.scope2, SCOPE_COLORS.scope3, "#8b5cf6", "#ec4899"];

const CheQGHGCalculator = () => {
  const [selectedScope, setSelectedScope] = useState('overview');

  const { 
    totalEmissions, 
    totalAllScopes, 
    scopePercentages, 
    scope1Data, 
    scope2Data, 
    scope3Data, 
    monthlyEmissionsData 
  } = cheqEmissionsData;

  // Create scope emission summaries for the cards
  const scopeEmissionSummaries = [
    {
      scope: 'scope1',
      value: totalEmissions.scope1,
      description: 'Direct emissions (facilities, vehicles)',
      percentage: scopePercentages[0].percentage
    },
    {
      scope: 'scope2',
      value: totalEmissions.scope2,
      description: 'Indirect from purchased energy',
      percentage: scopePercentages[1].percentage
    },
    {
      scope: 'scope3',
      value: totalEmissions.scope3,
      description: 'Value chain emissions',
      percentage: scopePercentages[2].percentage
    }
  ];

  // Custom tooltip for the emissions charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} tCO2e`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Emissions Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Carbon Footprint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllScopes.toLocaleString()} tCO2e</div>
            <p className="text-xs text-muted-foreground mt-1">
              Fiscal Year 2024
            </p>
            <p className="text-xs text-green-500 mt-2">
              -8% from previous year
            </p>
          </CardContent>
        </Card>
        
        {scopeEmissionSummaries.map((item) => (
          <Card key={item.scope}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {item.scope.charAt(0).toUpperCase() + item.scope.slice(1)} Emissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value.toLocaleString()} tCO2e</div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
                <p className="text-xs font-medium" style={{ color: SCOPE_COLORS[item.scope as keyof typeof SCOPE_COLORS] }}>
                  {item.percentage}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Analysis Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>CheQ.one GHG Emissions Analysis</CardTitle>
              <CardDescription>Detailed breakdown of emissions across all scopes for financial year 2024</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-1" />
                Methodology
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedScope} onValueChange={setSelectedScope}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="scope1">Scope 1</TabsTrigger>
              <TabsTrigger value="scope2">Scope 2</TabsTrigger>
              <TabsTrigger value="scope3">Scope 3</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Emissions by Scope</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={scopePercentages}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {scopePercentages.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          formatter={(value, entry, index) => (
                            <span style={{ color: COLORS[index % COLORS.length], fontWeight: 500 }}>
                              {value}: {scopePercentages[index].percentage}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Monthly Emissions Trend</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyEmissionsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="scope1" stroke={SCOPE_COLORS.scope1} strokeWidth={2} />
                        <Line type="monotone" dataKey="scope2" stroke={SCOPE_COLORS.scope2} strokeWidth={2} />
                        <Line type="monotone" dataKey="scope3" stroke={SCOPE_COLORS.scope3} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Emissions Breakdown by Source</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Scope 1 Emissions</CardTitle>
                      <CardDescription>Direct emissions from owned sources</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={scope1Data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />
                            <Bar dataKey="value" fill={SCOPE_COLORS.scope1} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Scope 2 Emissions</CardTitle>
                      <CardDescription>Indirect emissions from purchased energy</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={scope2Data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />
                            <Bar dataKey="value" fill={SCOPE_COLORS.scope2} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Scope 3 Emissions</CardTitle>
                      <CardDescription>Indirect emissions from value chain</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={scope3Data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />
                            <Bar dataKey="value" fill={SCOPE_COLORS.scope3} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Scope 1 Tab */}
            <TabsContent value="scope1">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Scope 1 Emissions Breakdown</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={scope1Data}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill={SCOPE_COLORS.scope1}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {scope1Data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`${SCOPE_COLORS.scope1}${90 - index * 20}`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Scope 1 Details</h3>
                  <div className="space-y-4">
                    <p>
                      Scope 1 emissions are direct greenhouse gas emissions that occur from sources that are controlled or owned by CheQ.one, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Company vehicles used for business travel</li>
                      <li>Backup generators at data centers and facilities</li>
                      <li>Refrigerants used in air conditioning systems</li>
                    </ul>
                    <p>
                      These emissions account for <strong>{scopePercentages[0].percentage}</strong> of our total carbon footprint, with company vehicles being the largest contributor.
                    </p>
                    <div className="pt-4">
                      <h4 className="font-medium">Reduction Strategies:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Transitioning to electric vehicles for company fleet</li>
                        <li>Optimizing generator usage and maintenance</li>
                        <li>Upgrading to low-GWP refrigerants</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Scope 2 Tab */}
            <TabsContent value="scope2">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Scope 2 Emissions Breakdown</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={scope2Data}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill={SCOPE_COLORS.scope2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {scope2Data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`${SCOPE_COLORS.scope2}${90 - index * 20}`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Scope 2 Details</h3>
                  <div className="space-y-4">
                    <p>
                      Scope 2 emissions are indirect GHG emissions associated with the purchase of electricity, steam, heat, or cooling for CheQ.one's operations. For financial institutions, these primarily come from:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Data center electricity consumption</li>
                      <li>Office buildings and branches</li>
                      <li>ATMs and other banking infrastructure</li>
                    </ul>
                    <p>
                      Scope 2 represents <strong>{scopePercentages[1].percentage}</strong> of our total emissions and is a key focus area for reduction efforts.
                    </p>
                    <div className="pt-4">
                      <h4 className="font-medium">Reduction Strategies:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Renewable energy purchase agreements (65% complete)</li>
                        <li>Energy efficiency improvements in buildings</li>
                        <li>Server optimization and virtualization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Scope 3 Tab */}
            <TabsContent value="scope3">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Scope 3 Emissions Breakdown</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={scope3Data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={SCOPE_COLORS.scope3} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Scope 3 Details</h3>
                  <div className="space-y-4">
                    <p>
                      Scope 3 emissions are all indirect emissions (not included in scope 2) that occur in the value chain of CheQ.one, including both upstream and downstream emissions. For financial institutions, these include:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Investments:</strong> Emissions from companies and projects financed</li>
                      <li><strong>Purchased goods and services:</strong> From technology providers and consultants</li>
                      <li><strong>Business travel:</strong> Employee travel by air, rail and other transport</li>
                      <li><strong>Employee commuting:</strong> Daily commute of all employees</li>
                    </ul>
                    <p>
                      At <strong>{scopePercentages[2].percentage}</strong> of our total emissions, scope 3 represents our largest emissions category, with financed emissions being the most significant challenge.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Financed Emissions: Portfolio Analysis</h3>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <p className="font-medium">Financed Emissions Report Available</p>
                  </div>
                  <p className="mb-4">
                    Our detailed financed emissions analysis follows the PCAF methodology and covers 82% of our investment portfolio. The analysis breakdowns emissions by sector, intensity metrics, and alignment with climate scenarios.
                  </p>
                  <div className="flex gap-2">
                    <Button>
                      <Download className="h-4 w-4 mr-1" />
                      Download Full Report
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default CheQGHGCalculator;
