
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Import refactored components
import EmissionsSummaryCards from './ghg/EmissionsSummaryCards';
import ScopeOverviewCharts from './ghg/ScopeOverviewCharts';
import TopEmissionSources from './ghg/TopEmissionSources';
import EnergyConsumption from './ghg/EnergyConsumption';
import ScopeEmissionsChart from './ghg/ScopeEmissionsChart';
import ScopeDetailCards from './ghg/ScopeDetailCards';

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

  // Create scope emission summaries for the cards
  const scopeEmissionSummaries = [
    {
      scope: 'scope1',
      value: totalEmissions.scope1,
      description: 'Direct emissions',
      percentage: scopePercentages[0].percentage
    },
    {
      scope: 'scope2',
      value: totalEmissions.scope2,
      description: 'Indirect emissions from energy',
      percentage: scopePercentages[1].percentage
    },
    {
      scope: 'scope3',
      value: totalEmissions.scope3,
      description: 'Other indirect emissions',
      percentage: scopePercentages[2].percentage
    }
  ];
  
  // Scope 1 Details
  const scope1Details = (
    <div>
      <p>Scope 1 emissions are direct greenhouse gas emissions from sources owned or controlled by your organization, including:</p>
      <ul className="list-disc pl-6 pt-2 space-y-1">
        <li>Stationary combustion: Burning of fuels in boilers, furnaces, etc.</li>
        <li>Mobile combustion: Company-owned vehicles</li>
        <li>Process emissions: Manufacturing processes</li>
        <li>Fugitive emissions: Leaks from refrigeration, air conditioning, etc.</li>
      </ul>
    </div>
  );
  
  // Scope 2 Details
  const scope2Details = (
    <div>
      <p>Scope 2 emissions are indirect greenhouse gas emissions from the consumption of purchased electricity, heat, steam, or cooling. These are generated at sources owned or controlled by another organization.</p>
      <div className="mt-4">
        <h4 className="font-medium">Calculation Methods:</h4>
        <ul className="list-disc pl-6 pt-2 space-y-1">
          <li><span className="font-medium">Location-based:</span> Reflects the average emissions intensity of grids where energy consumption occurs</li>
          <li><span className="font-medium">Market-based:</span> Reflects emissions from electricity that companies have purposefully chosen (or not)</li>
        </ul>
      </div>
    </div>
  );
  
  // Scope 3 Details
  const scope3Details = (
    <div>
      <p>Scope 3 emissions are all indirect emissions (not included in scope 2) that occur in the value chain of the reporting company, including both upstream and downstream emissions.</p>
      <div className="mt-4">
        <h4 className="font-medium">Categories:</h4>
        <p>The GHG Protocol divides Scope 3 emissions into 15 distinct categories, of which 8 are most material to our operations and shown in the chart.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Emissions Summary Cards */}
      <EmissionsSummaryCards 
        totalEmissions={totalAllScopes} 
        scopeEmissions={scopeEmissionSummaries} 
      />
      
      {/* Main Analysis Card */}
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
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <ScopeOverviewCharts 
                scopePercentages={scopePercentages} 
                monthlyEmissionsData={monthlyEmissionsData} 
              />
              
              <TopEmissionSources 
                scope1Data={scope1Data} 
                scope2Data={scope2Data} 
                scope3Data={scope3Data} 
              />
              
              <EnergyConsumption energyData={energyData} />
            </TabsContent>
            
            {/* Scope 1 Tab */}
            <TabsContent value="scope1">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <ScopeEmissionsChart 
                    data={scope1Data} 
                    title="Scope 1: Direct Emissions" 
                    color={SCOPE_COLORS.scope1} 
                  />
                </div>
                
                <ScopeDetailCards 
                  scopeNumber={1}
                  description="Direct emissions" 
                  details={scope1Details}
                  detailedData={[
                    detailedEmissionsData.stationaryCombustion,
                    detailedEmissionsData.mobileCombustion
                  ]}
                  detailedLabels={[
                    'Stationary Combustion',
                    'Mobile Combustion'
                  ]}
                />
              </div>
            </TabsContent>
            
            {/* Scope 2 Tab */}
            <TabsContent value="scope2">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <ScopeEmissionsChart 
                    data={scope2Data} 
                    title="Scope 2: Indirect Emissions from Energy" 
                    color={SCOPE_COLORS.scope2} 
                  />
                </div>
                
                <ScopeDetailCards 
                  scopeNumber={2}
                  description="Indirect emissions from energy" 
                  details={scope2Details}
                  detailedData={[
                    detailedEmissionsData.purchasedElectricity
                  ]}
                  detailedLabels={[
                    'Purchased Electricity'
                  ]}
                  additionalMetrics={[
                    { label: 'Location-based Emissions', value: '2,100 tCO2e' },
                    { label: 'Market-based Emissions', value: '2,000 tCO2e' }
                  ]}
                />
              </div>
            </TabsContent>
            
            {/* Scope 3 Tab */}
            <TabsContent value="scope3">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <ScopeEmissionsChart 
                    data={scope3Data} 
                    title="Scope 3: Other Indirect Emissions" 
                    color={SCOPE_COLORS.scope3} 
                  />
                </div>
                
                <ScopeDetailCards 
                  scopeNumber={3}
                  description="Other indirect emissions" 
                  details={scope3Details}
                  detailedData={[
                    detailedEmissionsData.businessTravel
                  ]}
                  detailedLabels={[
                    'Business Travel'
                  ]}
                  chartData={monthlyEmissionsData}
                  chartDataKey="scope3"
                  chartColor={SCOPE_COLORS.scope3}
                />
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
