
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, FileCheck } from 'lucide-react';
import FandoroNonCompliances from './compliance/FandoroNonCompliances';
import FandoroESGRisks from './risks/FandoroESGRisks';
import EnterprisesList from './lists/EnterprisesList';
import NonCompliancesList from './lists/NonCompliancesList';
import ESGRisksList from './lists/ESGRisksList';
import ESGCapList from './lists/ESGCapList';
import AnalyticsCards from './analytics/AnalyticsCards';

const FandoroAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <AnalyticsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <FandoroNonCompliances />
        <FandoroESGRisks />
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
