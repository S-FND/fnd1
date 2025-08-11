import React from 'react';
import { ProtectedRoute } from '@/components/portfolio/ProtectedRoute';
import { PermissionGate } from '@/components/portfolio/PermissionGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export const TeamDashboard: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={['portfolio_team_editor', 'portfolio_team_viewer']}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Work Dashboard</h1>
            <p className="text-muted-foreground">Your assigned tasks and data modules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                2 due today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                +3 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                2 need review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                ESG data entry
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Modules</CardTitle>
              <CardDescription>Access your assigned data collection modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <PermissionGate resource="data" action="read">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">ESG Metrics</p>
                    <p className="text-sm text-muted-foreground">Environmental, Social & Governance data</p>
                  </div>
                  <PermissionGate resource="data" action="write">
                    <Button variant="outline" size="sm">Edit</Button>
                  </PermissionGate>
                </div>
              </PermissionGate>

              <PermissionGate resource="data" action="read">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">GHG Emissions</p>
                    <p className="text-sm text-muted-foreground">Greenhouse gas accounting</p>
                  </div>
                  <PermissionGate resource="data" action="write">
                    <Button variant="outline" size="sm">Edit</Button>
                  </PermissionGate>
                </div>
              </PermissionGate>

              <PermissionGate resource="data" action="read">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Compliance</p>
                    <p className="text-sm text-muted-foreground">Regulatory compliance tracking</p>
                  </div>
                  <PermissionGate resource="data" action="write">
                    <Button variant="outline" size="sm">Edit</Button>
                  </PermissionGate>
                </div>
              </PermissionGate>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Work</CardTitle>
              <CardDescription>Your latest activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Updated carbon footprint data</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Completed safety training module</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">ESG questionnaire in progress</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};