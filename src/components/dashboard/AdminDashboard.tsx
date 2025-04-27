import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, BarChart, LineChart, PieChart } from 'lucide-react';
import { analyticsCards, emissionsByLocation, esgKPIs } from '@/data/mockData';
import {
  CartesianGrid,
  Line,
  LineChart as RechartLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart as RechartBarChart,
  Legend,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import SDGPerformance from './SDGPerformance';
import SustainabilityInitiatives from './SustainabilityInitiatives';
import NonCompliances from './NonCompliances';
import ESGRisks from './ESGRisks';

const AdminDashboard: React.FC = () => {
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([
    'renewable-energy', 'water-consumption', 'carbon-emissions', 'diversity-score'
  ]);
  
  const materialKPIs = esgKPIs.filter(kpi => selectedKPIs.includes(kpi.id));
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {analyticsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
              <div className="mt-2 flex items-center gap-1">
                {card.change > 0 ? (
                  <span className="text-xs text-green-500">+{card.change}%</span>
                ) : (
                  <span className="text-xs text-red-500">{card.change}%</span>
                )}
                <span className="text-xs text-muted-foreground">from previous year</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SDGPerformance />
        <SustainabilityInitiatives />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <NonCompliances />
        <ESGRisks />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material ESG KPIs</CardTitle>
          <CardDescription>Key ESG metrics shared with investors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {materialKPIs.map((kpi) => (
              <div key={kpi.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.category === 'Environment' ? 'bg-green-500' : 
                      kpi.category === 'Social' ? 'bg-blue-500' : 
                      'bg-amber-500'
                    }`} />
                    <h3 className="font-medium">{kpi.name}</h3>
                  </div>
                  <Badge variant="outline">{kpi.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {kpi.current} {kpi.unit}
                  </span>
                  <span className={`text-sm ${
                    kpi.trend === 'up' ? 'text-green-500' : 
                    kpi.trend === 'down' ? 'text-red-500' : 
                    'text-muted-foreground'
                  }`}>
                    {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '−'} YTD
                  </span>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress to Target</span>
                    <span>{kpi.progress}%</span>
                  </div>
                  <Progress value={kpi.progress} className="h-2" />
                </div>
                
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Baseline: {kpi.baseline} {kpi.unit}</span>
                    <span>Target: {kpi.target} {kpi.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="emissions">Emissions</TabsTrigger>
          <TabsTrigger value="kpis">ESG KPIs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Emissions Trend</CardTitle>
                <CardDescription>Total GHG emissions over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartLineChart
                    data={[
                      { year: '2018', value: 14800 },
                      { year: '2019', value: 15600 },
                      { year: '2020', value: 12400 },
                      { year: '2021', value: 13200 },
                      { year: '2022', value: 12800 },
                      { year: '2023', value: 11200 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      activeDot={{ r: 8 }}
                    />
                  </RechartLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Completion Rates</CardTitle>
                <CardDescription>Compliance and training status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>BRSR Compliance</div>
                    <div className="font-medium">87%</div>
                  </div>
                  <Progress value={87} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>ESG Training</div>
                    <div className="font-medium">62%</div>
                  </div>
                  <Progress value={62} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>GHG Reporting</div>
                    <div className="font-medium">75%</div>
                  </div>
                  <Progress value={75} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Critical compliance and reporting dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'BRSR Annual Report', date: 'June 30, 2024', status: 'Pending' },
                  { title: 'EHS Quarterly Audit', date: 'May 15, 2024', status: 'In Progress' },
                  { title: 'GHG Inventory Verification', date: 'August 12, 2024', status: 'Not Started' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <span className={`text-sm ${
                      item.status === 'Pending' ? 'text-amber-500' : 
                      item.status === 'In Progress' ? 'text-blue-500' : 
                      'text-red-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emissions by Location</CardTitle>
              <CardDescription>GHG emissions breakdown by facility</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartBarChart
                  data={emissionsByLocation}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="scope1" name="Scope 1" stackId="a" fill="#22c55e" />
                  <Bar dataKey="scope2" name="Scope 2" stackId="a" fill="#0ea5e9" />
                  <Bar dataKey="scope3" name="Scope 3" stackId="a" fill="#f59e0b" />
                </RechartBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kpis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {esgKPIs.map((kpi) => (
              <Card key={kpi.id}>
                <CardHeader className="pb-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    {kpi.category}
                  </div>
                  <CardTitle className="text-base">{kpi.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {kpi.current} {kpi.unit}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Target: {kpi.target} {kpi.unit}
                    </span>
                  </div>
                  <Progress value={kpi.progress} className="h-2" />
                  <div className="text-xs text-right text-muted-foreground">
                    {kpi.progress}% of target
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
