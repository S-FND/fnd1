import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const MaterialityPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !['admin', 'manager', 'unit_admin'].includes(user?.role || '')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materiality Assessment</h1>
          <p className="text-muted-foreground mt-2">
            Identify and prioritize material sustainability topics for your organization
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Materiality Assessment Tool
          </CardTitle>
          <CardDescription>
            Comprehensive materiality assessment to identify and prioritize ESG topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Start Your Materiality Assessment</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our comprehensive materiality assessment tool helps you identify and prioritize 
              the most important ESG topics for your organization based on stakeholder input 
              and business impact.
            </p>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <Button className="w-full" size="lg">
                Start Assessment
              </Button>
              <p className="text-xs text-muted-foreground">
                Begin your materiality assessment process
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Industry Analysis</CardTitle>
            <CardDescription>Analyze material topics by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Select your industry to get relevant materiality topics and benchmarks.
            </p>
            <Button variant="outline" className="w-full">
              Select Industry
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Stakeholder Engagement</CardTitle>
            <CardDescription>Collect stakeholder input</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Engage stakeholders to understand their priorities and concerns.
            </p>
            <Button variant="outline" className="w-full">
              Start Engagement
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Impact Matrix</CardTitle>
            <CardDescription>Visualize material topics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate impact vs. influence matrix for your material topics.
            </p>
            <Button variant="outline" className="w-full">
              View Matrix
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialityPage;