
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ESGMetricsManager from '../components/esg-metrics/ESGMetricsManager';

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
            <h1 className="text-2xl font-bold tracking-tight">ESG Management</h1>
            <p className="text-muted-foreground">
              Manage ESG metrics, goals, and performance based on materiality assessment
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="metrics">ESG Metrics</TabsTrigger>
              <TabsTrigger value="goals">ESG Goals</TabsTrigger>
              <TabsTrigger value="performance">Performance Tracking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics" className="space-y-6 mt-4">
              <ESGMetricsManager materialTopics={prioritizedTopics} />
            </TabsContent>
            
            <TabsContent value="goals" className="space-y-6 mt-4">
              <div className="p-8 text-center text-muted-foreground">
                <p>ESG Goals management module will be implemented in the next phase.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6 mt-4">
              <div className="p-8 text-center text-muted-foreground">
                <p>Performance tracking module will be implemented in the next phase.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default ESGManagementPage;
