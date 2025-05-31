
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ESGMetricsManager from '../components/esg-metrics/ESGMetricsManager';
import MetricsAssignment from '../components/esg-metrics/MetricsAssignment';

// Import sample material topics for development
import { defaultMaterialTopics } from '../data/materiality';

interface MaterialTopic {
  id: string;
  name: string;
  category: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
}

const ESGManagementPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('metrics');
  const [prioritizedTopics, setPrioritizedTopics] = useState<MaterialTopic[]>([]);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Simulate loading prioritized topics after stakeholder engagement
    // In a real app, this would come from your backend
    const highPriorityTopics = defaultMaterialTopics.filter(
      topic => topic.businessImpact >= 7.0 && topic.sustainabilityImpact >= 7.0
    );
    
    setPrioritizedTopics(highPriorityTopics);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ESG Metrics Management</h1>
            <p className="text-muted-foreground">
              Select and configure ESG metrics based on your materiality assessment, then assign them to team members for data collection
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="metrics">Metrics Configuration</TabsTrigger>
              <TabsTrigger value="assignment">Metrics Assignment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics" className="space-y-6 mt-4">
              <ESGMetricsManager materialTopics={prioritizedTopics} />
            </TabsContent>
            
            <TabsContent value="assignment" className="space-y-6 mt-4">
              <MetricsAssignment materialTopics={prioritizedTopics} />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default ESGManagementPage;
