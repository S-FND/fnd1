
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SDGPerformance from '@/components/dashboard/SDGPerformance';
import EmissionsTrends from '@/components/dashboard/EmissionsTrends';
import CompletionRates from '@/components/dashboard/CompletionRates';
import DeadlinesList from '@/components/dashboard/DeadlinesList';
import EmissionsByLocation from '@/components/dashboard/EmissionsByLocation';
import MaterialKPIs from '@/components/dashboard/MaterialKPIs';
import EnterpriseNonCompliances from './compliance/EnterpriseNonCompliances';
import EnterpriseESGRisks from './risks/EnterpriseESGRisks';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { esgKPIs } from '@/data';
import { analyticsCardsData, cheqInitiatives, cheqESGKPIs, cheqMonthlyTrendData, cheqRisks } from '../data/cheq-mock-data';

// Filter KPIs for CheQ's financial services focus
const financialKPIs = cheqESGKPIs.filter(kpi => 
  ["green-finance", "carbon-footprint", "renewable-energy", "diversity-management", "financial-inclusion", "data-security"].includes(kpi.id)
);

// Chart colors
const COLORS = ['#22c55e', '#60a5fa', '#f59e0b', '#ec4899', '#8b5cf6'];

// ESG performance by category
const esgCategoryData = [
  { name: 'Environmental', score: 76 },
  { name: 'Social', score: 82 },
  { name: 'Governance', score: 89 }
];

const CheQDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {analyticsCardsData.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <span className={`h-4 w-4 ${card.color}`}>
                {card.color.includes('green') ? '📉' : card.color.includes('blue') ? '📊' : '📋'}
              </span>
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
        <Card>
          <CardHeader>
            <CardTitle>ESG Performance by Category</CardTitle>
            <CardDescription>Current scores across environmental, social and governance</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={esgCategoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Score (out of 100)">
                  {esgCategoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#22c55e' : index === 1 ? '#60a5fa' : '#f59e0b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Initiatives</CardTitle>
            <CardDescription>Key sustainability projects at CheQ.one</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cheqInitiatives.map((initiative, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{initiative.title}</div>
                    <Badge variant={
                      initiative.status === 'Completed' ? "outline" : 
                      initiative.status === 'In Progress' ? "secondary" : 
                      "destructive"
                    }>
                      {initiative.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{initiative.description}</div>
                  <div className="flex items-center justify-between text-xs">
                    <div>Progress: {initiative.progress}%</div>
                    <div>Due: {new Date(initiative.dueDate).toLocaleDateString()}</div>
                  </div>
                  <Progress value={initiative.progress} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <EnterpriseNonCompliances />
        <Card>
          <CardHeader>
            <CardTitle>ESG Risks</CardTitle>
            <CardDescription>Key sustainability risks for CheQ.one</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cheqRisks.slice(0, 4).map((risk, index) => (
                <div key={index} className="flex justify-between border-b pb-2 last:border-0">
                  <div>
                    <div className="font-medium">{risk.title}</div>
                    <div className="text-sm text-muted-foreground">{risk.description}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant={
                      risk.impact === 'High' ? "destructive" : 
                      risk.impact === 'Medium' ? "default" : 
                      "outline"
                    }>
                      {risk.impact} Impact
                    </Badge>
                    <span className="text-sm text-muted-foreground mt-1">{risk.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material ESG KPIs</CardTitle>
          <CardDescription>Key ESG metrics for CheQ.one financial services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {financialKPIs.map((kpi) => (
              <div key={kpi.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      kpi.category === 'Environment' ? 'bg-green-500' : 
                      kpi.category === 'Social' ? 'bg-blue-500' : 
                      'bg-amber-500'
                    }`} />
                    <span className="font-medium">{kpi.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {kpi.current}/{kpi.target} {kpi.unit}
                  </span>
                </div>
                <Progress value={kpi.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Baseline: {kpi.baseline} {kpi.unit}</span>
                  <span>Target: {kpi.target} {kpi.unit}</span>
                  <span>{kpi.progress}% of target</span>
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
          <TabsTrigger value="trends">ESG Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <EmissionsTrends />
            <CompletionRates />
          </div>
          <DeadlinesList />
        </TabsContent>
        
        <TabsContent value="emissions" className="space-y-4">
          <EmissionsByLocation />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly ESG Performance</CardTitle>
              <CardDescription>Trends across E, S, G dimensions</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cheqMonthlyTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="environmental" name="Environmental" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="social" name="Social" stroke="#60a5fa" strokeWidth={2} />
                  <Line type="monotone" dataKey="governance" name="Governance" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheQDashboard;
