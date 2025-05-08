
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import refactored components
import EmissionsSummary from './ghg/EmissionsSummary';
import { Scope1Details, Scope2Details, Scope3Details } from './ghg/GHGScopeDetails';
import OverviewTabContent from './ghg/calculator-tabs/OverviewTabContent';
import Scope1TabContent from './ghg/calculator-tabs/Scope1TabContent';
import Scope2TabContent from './ghg/calculator-tabs/Scope2TabContent';
import Scope3TabContent from './ghg/calculator-tabs/Scope3TabContent';
import ActionButtons from './ghg/calculator-tabs/ActionButtons';

// Import data
import {
  scope1Data,
  scope2Data,
  scope3Data,
  detailedEmissionsData,
  monthlyEmissionsData,
  energyData,
  totalEmissions,
  totalAllScopes,
  scopePercentages,
  SCOPE_COLORS
} from './ghg/data';

const GHGCalculator = () => {
  const [selectedScope, setSelectedScope] = useState('overview');

  // Create scope emission summaries for the cards with more meaningful descriptions
  const scopeEmissionSummaries = [
    {
      scope: 'scope1',
      value: totalEmissions.scope1,
      description: 'From IMR Resources operations',
      percentage: scopePercentages[0].percentage
    },
    {
      scope: 'scope2',
      value: totalEmissions.scope2,
      description: 'From purchased energy',
      percentage: scopePercentages[1].percentage
    },
    {
      scope: 'scope3',
      value: totalEmissions.scope3,
      description: 'Throughout value chain',
      percentage: scopePercentages[2].percentage
    }
  ];

  return (
    <>
      {/* Emissions Summary Cards */}
      <EmissionsSummary 
        totalAllScopes={totalAllScopes} 
        scopeEmissionSummaries={scopeEmissionSummaries} 
      />
      
      {/* Main Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle>IMR Resources GHG Emissions Analysis</CardTitle>
          <CardDescription>Detailed breakdown of emissions across all scopes for 2025</CardDescription>
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
              <OverviewTabContent 
                scopePercentages={scopePercentages}
                monthlyEmissionsData={monthlyEmissionsData}
                scope1Data={scope1Data}
                scope2Data={scope2Data}
                scope3Data={scope3Data}
                energyData={energyData}
              />
            </TabsContent>
            
            {/* Scope 1 Tab */}
            <TabsContent value="scope1">
              <Scope1TabContent
                scope1Data={scope1Data}
                detailedEmissionsData={detailedEmissionsData}
                scope1Details={<Scope1Details />}
                scopeColor={SCOPE_COLORS.scope1}
              />
            </TabsContent>
            
            {/* Scope 2 Tab */}
            <TabsContent value="scope2">
              <Scope2TabContent
                scope2Data={scope2Data}
                detailedEmissionsData={detailedEmissionsData}
                scope2Details={<Scope2Details />}
                scopeColor={SCOPE_COLORS.scope2}
              />
            </TabsContent>
            
            {/* Scope 3 Tab */}
            <TabsContent value="scope3">
              <Scope3TabContent
                scope3Data={scope3Data}
                detailedEmissionsData={detailedEmissionsData}
                scope3Details={<Scope3Details />}
                scopeColor={SCOPE_COLORS.scope3}
                monthlyEmissionsData={monthlyEmissionsData}
              />
            </TabsContent>
          </Tabs>
          
          <ActionButtons />
        </CardContent>
      </Card>
    </>
  );
};

export default GHGCalculator;
