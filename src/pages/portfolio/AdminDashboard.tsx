import React from 'react';
import { ProtectedRoute } from '@/components/portfolio/ProtectedRoute';
import { PermissionGate } from '@/components/portfolio/PermissionGate';
import { AccessControlSettings } from '@/components/admin/AccessControlSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Settings, BarChart3, FileText, Plus, Shield } from 'lucide-react';
import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';

export const AdminDashboard: React.FC = () => {
  const { profile } = usePortfolioAuth();
  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <ProtectedRoute requiredRoles={['portfolio_company_admin', 'super_admin']}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company Overview</h1>
            <p className="text-muted-foreground">Manage your portfolio company operations</p>
          </div>
          <PermissionGate resource="users" action="write">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Invite Team Member
            </Button>
          </PermissionGate>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger value="access-control">
                <Shield className="w-4 h-4 mr-2" />
                Access Control
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PermissionGate resource="users" action="read">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      +2 from last month
                    </p>
                  </CardContent>
                </Card>
              </PermissionGate>

              <PermissionGate resource="data" action="read">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">
                      3 pending review
                    </p>
                  </CardContent>
                </Card>
              </PermissionGate>

              <PermissionGate resource="reports" action="read">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reports</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">
                      5 due this week
                    </p>
                  </CardContent>
                </Card>
              </PermissionGate>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PermissionGate resource="users" action="read">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Manage team members and permissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Portfolio Team Editors</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Portfolio Team Viewers</span>
                      <span className="text-sm font-medium">4</span>
                    </div>
                    <PermissionGate resource="users" action="write">
                      <Button variant="outline" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Permissions
                      </Button>
                    </PermissionGate>
                  </CardContent>
                </Card>
              </PermissionGate>

              <PermissionGate resource="data" action="read">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">ESG report updated</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">New team member added</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">Compliance review pending</p>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </PermissionGate>
            </div>
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="access-control">
              <AccessControlSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};