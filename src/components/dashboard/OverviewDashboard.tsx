
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeatures } from '@/context/FeaturesContext';
import { esgKPIs } from '@/data';
import SDGPerformance from './SDGPerformance';
import SustainabilityInitiatives from './SustainabilityInitiatives';
import NonCompliances from './NonCompliances';
import ESGRisks from './ESGRisks';
import EmissionsTrends from './EmissionsTrends';
import CompletionRates from './CompletionRates';
import DeadlinesList from './DeadlinesList';
import EmissionsByLocation from './EmissionsByLocation';
import MaterialKPIs from './MaterialKPIs';

const OverviewDashboard: React.FC = () => {
  const { isFeatureActive } = useFeatures();
  const [selectedKPIs] = useState<string[]>([
    'renewable-energy', 'water-consumption', 'carbon-emissions', 'diversity-score'
  ]);
  
  const materialKPIs = esgKPIs.filter(kpi => selectedKPIs.includes(kpi.id));

  // Analytics cards that depend on features
  const getAnalyticsCards = () => {
    const cards = [];
    
    if (isFeatureActive('ghg-accounting')) {
      cards.push({
        title: "Carbon Emissions",
        value: "-12%",
        description: "Year-over-year reduction",
        change: 8,
        icon: () => <span className="h-4 w-4 text-green-500">📉</span>,
        color: "text-green-500",
      });
    }
    
    if (isFeatureActive('ehs-trainings') || isFeatureActive('lms')) {
      cards.push({
        title: "Training Completion",
        value: "89%",
        description: "Employee completion rate",
        change: 5,
        icon: () => <span className="h-4 w-4 text-blue-500">🎓</span>,
        color: "text-blue-500",
      });
    }
    
    if (isFeatureActive('compliance')) {
      cards.push({
        title: "Compliance Score",
        value: "92%",
        description: "Regulatory compliance",
        change: -2,
        icon: () => <span className="h-4 w-4 text-amber-500">📋</span>,
        color: "text-amber-500",
      });
    }
    
    // Default card for basic company metrics
    cards.push({
      title: "Company Health",
      value: "95%",
      description: "Overall performance",
      change: 3,
      icon: () => <span className="h-4 w-4 text-green-500">📊</span>,
      color: "text-green-500",
    });
    
    return cards;
  };

  const analyticsCards = getAnalyticsCards();
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <span className="text-xs text-muted-foreground">from previous period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show ESG-related sections only if ESG Management is active */}
      {isFeatureActive('esg-management') && (
        <>
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
        </>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isFeatureActive('ghg-accounting') && <TabsTrigger value="emissions">Emissions</TabsTrigger>}
          {isFeatureActive('esg-management') && <TabsTrigger value="kpis">ESG KPIs</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isFeatureActive('ghg-accounting') && <EmissionsTrends />}
            {(isFeatureActive('lms') || isFeatureActive('ehs-trainings')) && <CompletionRates />}
          </div>
          <DeadlinesList />
        </TabsContent>
        
        {isFeatureActive('ghg-accounting') && (
          <TabsContent value="emissions" className="space-y-4">
            <EmissionsByLocation />
          </TabsContent>
        )}
        
        {isFeatureActive('esg-management') && (
          <TabsContent value="kpis" className="space-y-4">
            <MaterialKPIs kpis={esgKPIs} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OverviewDashboard;
