
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import ScopeOverviewCharts from '../ScopeOverviewCharts';
import TopEmissionSources from '../TopEmissionSources';
import EnergyConsumption from '../EnergyConsumption';

interface OverviewTabContentProps {
  scopePercentages: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  monthlyEmissionsData: Array<{
    month: string;
    scope1: number;
    scope2: number;
    scope3: number;
  }>;
  scope1Data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  scope2Data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  scope3Data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  energyData: Array<{
    name: string;
    value: number;
    unit: string;
    percentage: number;
  }>;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  scopePercentages,
  monthlyEmissionsData,
  scope1Data,
  scope2Data,
  scope3Data,
  energyData,
}) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default OverviewTabContent;
