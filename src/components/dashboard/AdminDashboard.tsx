import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { esgKPIs } from '@/data/mockData';
import SDGPerformance from './SDGPerformance';
import SustainabilityInitiatives from './SustainabilityInitiatives';
import NonCompliances from './NonCompliances';
import ESGRisks from './ESGRisks';
import EmissionsTrends from './EmissionsTrends';
import CompletionRates from './CompletionRates';
import DeadlinesList from './DeadlinesList';
import EmissionsByLocation from './EmissionsByLocation';
import MaterialKPIs from './MaterialKPIs';

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
