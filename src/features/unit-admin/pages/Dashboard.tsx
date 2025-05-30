
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const UnitAdminDashboardPage = () => {
  const { isLoading } = useRouteProtection(['unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const currentUnit = user?.units?.find(unit => unit.id === user.unitId);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'unit_admin') {
    return <Navigate to="/login" />;
  }

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Unit Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's the sustainability snapshot for {currentUnit?.name || 'your unit'}.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Unit Summary</CardTitle>
              <CardDescription>Key metrics for {currentUnit?.name || 'your unit'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm ml-2">{currentUnit?.location || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-sm font-medium">City:</span>
                <span className="text-sm ml-2">{currentUnit?.city || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Emissions Target:</span>
                <span className="text-sm ml-2 text-green-600">-12% YoY</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Unit Compliance</CardTitle>
              <CardDescription>Current compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Environmental Permits</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Compliant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Waste Management</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Compliant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Water Usage Reporting</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Due in 7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>EHS Training Completion</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Overdue</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default UnitAdminDashboardPage;
