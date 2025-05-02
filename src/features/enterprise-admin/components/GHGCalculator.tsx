
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'];

// Scope 1 Emissions Data by Source
const scope1Data = [
  { name: 'Stationary Combustion', value: 560, percentage: 28 },
  { name: 'Mobile Combustion', value: 480, percentage: 24 },
  { name: 'Process Emissions', value: 320, percentage: 16 },
  { name: 'Fugitive Emissions', value: 640, percentage: 32 },
];

// Scope 2 Emissions Data by Source
const scope2Data = [
  { name: 'Purchased Electricity', value: 1200, percentage: 60 },
  { name: 'Purchased Heat', value: 400, percentage: 20 },
  { name: 'Purchased Steam', value: 200, percentage: 10 },
  { name: 'Purchased Cooling', value: 200, percentage: 10 },
];

// Scope 3 Emissions Data by Source
const scope3Data = [
  { name: 'Purchased Goods & Services', value: 3200, percentage: 40 },
  { name: 'Capital Goods', value: 800, percentage: 10 },
  { name: 'Fuel & Energy Related', value: 640, percentage: 8 },
  { name: 'Transportation & Distribution', value: 1600, percentage: 20 },
  { name: 'Waste Generated', value: 240, percentage: 3 },
  { name: 'Business Travel', value: 400, percentage: 5 },
  { name: 'Employee Commuting', value: 720, percentage: 9 },
  { name: 'Leased Assets', value: 400, percentage: 5 },
];

// Detailed subcategory emissions
const detailedEmissionsData = {
  stationaryCombustion: [
    { name: 'Natural Gas', value: 320, unit: 'tCO2e' },
    { name: 'Diesel Generators', value: 180, unit: 'tCO2e' },
    { name: 'LPG', value: 60, unit: 'tCO2e' },
  ],
  mobileCombustion: [
    { name: 'Company Vehicles', value: 280, unit: 'tCO2e' },
    { name: 'Aircraft', value: 200, unit: 'tCO2e' },
  ],
  purchasedElectricity: [
    { name: 'Office Buildings', value: 450, unit: 'tCO2e' },
    { name: 'Manufacturing', value: 600, unit: 'tCO2e' },
    { name: 'Data Centers', value: 150, unit: 'tCO2e' },
  ],
  businessTravel: [
    { name: 'Air Travel', value: 250, unit: 'tCO2e' },
    { name: 'Train Travel', value: 50, unit: 'tCO2e' },
    { name: 'Hotel Stays', value: 70, unit: 'tCO2e' },
    { name: 'Car Rentals', value: 30, unit: 'tCO2e' },
  ],
};

// Monthly emissions data
const monthlyEmissionsData = [
  { month: 'Jan', scope1: 200, scope2: 350, scope3: 800 },
  { month: 'Feb', scope1: 180, scope2: 320, scope3: 780 },
  { month: 'Mar', scope1: 190, scope2: 330, scope3: 820 },
  { month: 'Apr', scope1: 210, scope2: 310, scope3: 790 },
  { month: 'May', scope1: 220, scope2: 300, scope3: 810 },
  { month: 'Jun', scope1: 230, scope2: 330, scope3: 850 },
  { month: 'Jul', scope1: 250, scope2: 350, scope3: 900 },
  { month: 'Aug', scope1: 260, scope2: 380, scope3: 920 },
  { month: 'Sep', scope1: 240, scope2: 360, scope3: 880 },
  { month: 'Oct', scope1: 230, scope2: 350, scope3: 860 },
  { month: 'Nov', scope1: 220, scope2: 330, scope3: 830 },
  { month: 'Dec', scope1: 210, scope2: 340, scope3: 810 },
];

// Energy consumption data
const energyData = [
  { name: 'Electricity', value: 5800, unit: 'MWh', percentage: 65 },
  { name: 'Natural Gas', value: 2200, unit: 'MWh', percentage: 25 },
  { name: 'Diesel', value: 450, unit: 'MWh', percentage: 5 },
  { name: 'Other Fuels', value: 450, unit: 'MWh', percentage: 5 },
];

const totalEmissions = {
  scope1: scope1Data.reduce((sum, item) => sum + item.value, 0),
  scope2: scope2Data.reduce((sum, item) => sum + item.value, 0),
  scope3: scope3Data.reduce((sum, item) => sum + item.value, 0),
};

const totalAllScopes = totalEmissions.scope1 + totalEmissions.scope2 + totalEmissions.scope3;

const scopePercentages = [
  { name: 'Scope 1', value: totalEmissions.scope1, percentage: ((totalEmissions.scope1 / totalAllScopes) * 100).toFixed(1) },
  { name: 'Scope 2', value: totalEmissions.scope2, percentage: ((totalEmissions.scope2 / totalAllScopes) * 100).toFixed(1) },
  { name: 'Scope 3', value: totalEmissions.scope3, percentage: ((totalEmissions.scope3 / totalAllScopes) * 100).toFixed(1) },
];

const SCOPE_COLORS = {
  scope1: '#22c55e',
  scope2: '#3b82f6',
  scope3: '#f97316'
};

const GHGCalculator = () => {
  const [selectedScope, setSelectedScope] = useState('overview');

  const renderScopeData = (data: any[], title: string, color: string) => {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{title}</h3>
          <Badge style={{ backgroundColor: color }}>
            {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()} tCO2e
          </Badge>
        </div>
        <div className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="grid grid-cols-4 text-sm">
                <div className="col-span-2 flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{item.name}</span>
                </div>
                <div className="text-right">{item.value.toLocaleString()} tCO2e</div>
                <div className="text-right">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Emissions</CardTitle>
            <CardDescription>All scopes combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllScopes.toLocaleString()} tCO2e</div>
            <p className="text-sm text-muted-foreground">-12% from previous year</p>
          </CardContent>
        </Card>
        
        {Object.entries(totalEmissions).map(([scope, value], i) => (
          <Card key={scope}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{`Scope ${scope.slice(-1)}`}</CardTitle>
              <CardDescription>
                {scope === 'scope1' ? 'Direct emissions' : 
                 scope === 'scope2' ? 'Indirect emissions from energy' : 
                 'Other indirect emissions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {value.toLocaleString()} tCO2e
              </div>
              <p className="text-sm text-muted-foreground">
                {scopePercentages[i].percentage}% of total emissions
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>GHG Emissions Analysis</CardTitle>
          <CardDescription>Detailed breakdown of emissions across all scopes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedScope} onValueChange={setSelectedScope}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="scope1">Scope 1</TabsTrigger>
              <TabsTrigger value="scope2">Scope 2</TabsTrigger>
              <TabsTrigger value="scope3">Scope 3</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Emissions by Scope</h3>
                  <p className="text-sm text-muted-foreground">
                    Distribution of CO2e emissions across Scope 1, 2, and 3
                  </p>
                  <div className="h-[300px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={scopePercentages}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill={SCOPE_COLORS.scope1} />
                          <Cell fill={SCOPE_COLORS.scope2} />
                          <Cell fill={SCOPE_COLORS.scope3} />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Monthly Emissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Emissions trend over the last 12 months
                  </p>
                  <div className="h-[300px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyEmissionsData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="scope1" name="Scope 1" stackId="1" stroke={SCOPE_COLORS.scope1} fill={SCOPE_COLORS.scope1} />
                        <Area type="monotone" dataKey="scope2" name="Scope 2" stackId="1" stroke={SCOPE_COLORS.scope2} fill={SCOPE_COLORS.scope2} />
                        <Area type="monotone" dataKey="scope3" name="Scope 3" stackId="1" stroke={SCOPE_COLORS.scope3} fill={SCOPE_COLORS.scope3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Top Emission Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Scope 1 Top Sources</h4>
                      <div className="space-y-1">
                        {scope1Data.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>{item.value} tCO2e</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Scope 2 Top Sources</h4>
                      <div className="space-y-1">
                        {scope2Data.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>{item.value} tCO2e</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Scope 3 Top Sources</h4>
                      <div className="space-y-1">
                        {scope3Data.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>{item.value} tCO2e</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <h3 className="font-medium">Energy Consumption</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={energyData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {energyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Energy Sources</h4>
                    <div className="space-y-3">
                      {energyData.map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                              <span>{item.name}</span>
                            </div>
                            <span>{item.value.toLocaleString()} {item.unit}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: COLORS[i % COLORS.length]
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex justify-between font-medium">
                        <span>Total Energy Consumption:</span>
                        <span>
                          {energyData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} MWh
                        </span>
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>Renewable Energy:</span>
                        <span>22%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scope1">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  {renderScopeData(scope1Data, 'Scope 1: Direct Emissions', SCOPE_COLORS.scope1)}
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">About Scope 1</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Scope 1 emissions are direct greenhouse gas emissions from sources owned or controlled by your organization, including:</p>
                      <ul className="list-disc pl-6 pt-2 space-y-1">
                        <li>Stationary combustion: Burning of fuels in boilers, furnaces, etc.</li>
                        <li>Mobile combustion: Company-owned vehicles</li>
                        <li>Process emissions: Manufacturing processes</li>
                        <li>Fugitive emissions: Leaks from refrigeration, air conditioning, etc.</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <div>
                    <h3 className="font-medium mb-3">Stationary Combustion Breakdown</h3>
                    <div className="space-y-2">
                      {detailedEmissionsData.stationaryCombustion.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm border-b pb-1">
                          <span>{item.name}</span>
                          <span>{item.value} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Mobile Combustion Breakdown</h3>
                    <div className="space-y-2">
                      {detailedEmissionsData.mobileCombustion.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm border-b pb-1">
                          <span>{item.name}</span>
                          <span>{item.value} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scope2">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  {renderScopeData(scope2Data, 'Scope 2: Indirect Emissions from Energy', SCOPE_COLORS.scope2)}
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">About Scope 2</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Scope 2 emissions are indirect greenhouse gas emissions from the consumption of purchased electricity, heat, steam, or cooling. These are generated at sources owned or controlled by another organization.</p>
                      <div className="mt-4">
                        <h4 className="font-medium">Calculation Methods:</h4>
                        <ul className="list-disc pl-6 pt-2 space-y-1">
                          <li><span className="font-medium">Location-based:</span> Reflects the average emissions intensity of grids where energy consumption occurs</li>
                          <li><span className="font-medium">Market-based:</span> Reflects emissions from electricity that companies have purposefully chosen (or not)</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div>
                    <h3 className="font-medium mb-3">Purchased Electricity Breakdown</h3>
                    <div className="space-y-2">
                      {detailedEmissionsData.purchasedElectricity.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm border-b pb-1">
                          <span>{item.name}</span>
                          <span>{item.value} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Location-based Emissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold">2,100 tCO2e</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Market-based Emissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl font-bold">2,000 tCO2e</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scope3">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  {renderScopeData(scope3Data, 'Scope 3: Other Indirect Emissions', SCOPE_COLORS.scope3)}
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">About Scope 3</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Scope 3 emissions are all indirect emissions (not included in scope 2) that occur in the value chain of the reporting company, including both upstream and downstream emissions.</p>
                      <div className="mt-4">
                        <h4 className="font-medium">Categories:</h4>
                        <p>The GHG Protocol divides Scope 3 emissions into 15 distinct categories, of which 8 are most material to our operations and shown in the chart.</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div>
                    <h3 className="font-medium mb-3">Business Travel Breakdown</h3>
                    <div className="space-y-2">
                      {detailedEmissionsData.businessTravel.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm border-b pb-1">
                          <span>{item.name}</span>
                          <span>{item.value} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Scope 3 Emissions Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyEmissionsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="scope3" name="Scope 3" stroke={SCOPE_COLORS.scope3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-6 flex justify-center md:justify-end">
            <Button variant="outline" className="mr-2">Download GHG Report</Button>
            <Button>Calculate New Period</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default GHGCalculator;
