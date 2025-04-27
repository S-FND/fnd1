import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { esgKPIs } from '@/data';
import SDGPerformance from '@/components/dashboard/SDGPerformance';
import SustainabilityInitiatives from '@/components/dashboard/SustainabilityInitiatives';
import EmissionsTrends from '@/components/dashboard/EmissionsTrends';
import CompletionRates from '@/components/dashboard/CompletionRates';
import DeadlinesList from '@/components/dashboard/DeadlinesList';
import EmissionsByLocation from '@/components/dashboard/EmissionsByLocation';
import MaterialKPIs from '@/components/dashboard/MaterialKPIs';
import EnterpriseNonCompliances from './compliance/EnterpriseNonCompliances';
import EnterpriseESGRisks from './risks/EnterpriseESGRisks';

const analyticsCards = [
  {
    title: "Carbon Emissions",
    value: "-12%",
    description: "Year-over-year reduction",
    change: 8,
    icon: () => <span className="h-4 w-4 text-green-500">📉</span>,
    color: "text-green-500",
  },
  {
    title: "Energy Efficiency",
    value: "+8%",
    description: "Improvement from baseline",
    change: 12,
    icon: () => <span className="h-4 w-4 text-blue-500">⚡</span>,
    color: "text-blue-500",
  },
  {
    title: "Compliance Score",
    value: "92%",
    description: "Regulatory compliance",
    change: -2,
    icon: () => <span className="h-4 w-4 text-amber-500">📋</span>,
    color: "text-amber-500",
  },
];

const AdminDashboard: React.FC = () => {
  const [selectedKPIs] = useState<string[]>([
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
              <card.icon />
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
        <EnterpriseNonCompliances />
        <EnterpriseESGRisks />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material ESG KPIs</CardTitle>
          <CardDescription>Key ESG metrics shared with investors</CardDescription>
        </CardHeader>
        <CardContent>
          <MaterialKPIs kpis={materialKPIs} />
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
            <EmissionsTrends />
            <CompletionRates />
          </div>
          <DeadlinesList />
        </TabsContent>
        
        <TabsContent value="emissions" className="space-y-4">
          <EmissionsByLocation />
        </TabsContent>
        
        <TabsContent value="kpis" className="space-y-4">
          <MaterialKPIs kpis={esgKPIs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
