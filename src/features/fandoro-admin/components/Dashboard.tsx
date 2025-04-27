
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield } from 'lucide-react';
import NonCompliances from '@/components/dashboard/NonCompliances';
import ESGRisks from '@/components/dashboard/ESGRisks';
import AnalyticsCards from './analytics/AnalyticsCards';
import EnterprisesList from './lists/EnterprisesList';
import NonCompliancesList from './lists/NonCompliancesList';
import ESGRisksList from './lists/ESGRisksList';
import ESGCapList from './lists/ESGCapList';

const FandoroAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <AnalyticsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <NonCompliances />
        <ESGRisks />
      </div>

      <Tabs defaultValue="enterprises" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enterprises">Enterprises</TabsTrigger>
          <TabsTrigger value="non-compliances">Non-Compliances</TabsTrigger>
          <TabsTrigger value="esg-risks">ESG Risks</TabsTrigger>
          <TabsTrigger value="esg-cap">ESG CAP</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enterprises" className="space-y-4">
          <EnterprisesList />
        </TabsContent>
        
        <TabsContent value="non-compliances" className="space-y-4">
          <NonCompliancesList />
        </TabsContent>
        
        <TabsContent value="esg-risks" className="space-y-4">
          <ESGRisksList />
        </TabsContent>
        
        <TabsContent value="esg-cap" className="space-y-4">
          <ESGCapList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FandoroAdminDashboard;
