
import React, { useState, useEffect } from 'react';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();
  const [prioritizedTopics, setPrioritizedTopics] = useState<MaterialTopic[]>([]);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Simulate loading prioritized topics after stakeholder engagement
    const highPriorityTopics = defaultMaterialTopics.filter(
      topic => topic.businessImpact >= 7.0 && topic.sustainabilityImpact >= 7.0
    );
    
    setPrioritizedTopics(highPriorityTopics);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  // Mock completion data
  const esmsCompletion = 15; // out of 21 sections
  const configuredMetrics = 8;
  const totalMetrics = prioritizedTopics.length * 2; // Average 2 metrics per topic

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ESG Management</h1>
        <p className="text-muted-foreground">
          Comprehensive ESG management system overview and navigation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Environmental & Social Management System (ESMS)</CardTitle>
            </div>
            <CardDescription>
              Complete your ESMS documentation and upload supporting documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <Badge variant={esmsCompletion >= 21 ? "default" : "secondary"}>
                {esmsCompletion}/21 sections
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(esmsCompletion / 21) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              {esmsCompletion >= 21 ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Complete</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-600">In Progress</span>
                </>
              )}
            </div>
            <Button asChild className="w-full">
              <Link to="/esg/esms">
                Continue ESMS
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>ESG Metrics Management</CardTitle>
            </div>
            <CardDescription>
              Configure metrics based on your materiality assessment and manage data collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Configured Metrics</span>
              <Badge variant={configuredMetrics >= totalMetrics ? "default" : "secondary"}>
                {configuredMetrics}/{totalMetrics}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(configuredMetrics / totalMetrics) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              {configuredMetrics >= totalMetrics ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Complete</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-600">Setup Required</span>
                </>
              )}
            </div>
            <Button asChild className="w-full">
              <Link to="/esg/metrics">
                Configure Metrics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material Topics Overview</CardTitle>
          <CardDescription>
            {prioritizedTopics.length} high-priority topics from your materiality assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {prioritizedTopics.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {prioritizedTopics.slice(0, 6).map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center p-3 border rounded-lg border-l-4"
                  style={{ borderLeftColor: topic.color }}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{topic.name}</h4>
                    <p className="text-xs text-muted-foreground">{topic.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Complete your materiality assessment to see prioritized topics
              </p>
              <Button asChild className="mt-4">
                <Link to="/materiality">
                  Go to Materiality Assessment
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ESGManagementPage;
