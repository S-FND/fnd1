
import React, { useState } from 'react';
import { EnhancedSidebarLayout } from '@/components/layout/EnhancedSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import ESGCapTable from '../components/esg-dd/ESGCapTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Users, Building2 } from 'lucide-react';

const ESGCapPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unit' | 'assigned'>('all');
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
    return <Navigate to="/login" />;
  }

  const isUnitAdmin = user?.role === 'unit_admin';
  const unitName = isUnitAdmin && user?.units?.find(unit => unit.id === user?.unitId)?.name;

  return (
    <div className="min-h-screen">
      <Navbar />
      <EnhancedSidebarLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ESG Corrective Action Plans</h1>
              <p className="text-muted-foreground">
                {isUnitAdmin 
                  ? `Manage ESG corrective actions for ${unitName || 'your unit'}.` 
                  : 'Track and manage ESG corrective actions across your enterprise.'}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>CAP Overview</CardTitle>
                  <CardDescription>
                    Summary of ESG corrective action items
                  </CardDescription>
                </div>
                {!isUnitAdmin && (
                  <div className="flex space-x-4">
                    <Button 
                      variant={activeFilter === 'all' ? 'secondary' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveFilter('all')}
                    >
                      <Filter className="mr-1 h-4 w-4" />
                      All CAPs
                    </Button>
                    <Button 
                      variant={activeFilter === 'unit' ? 'secondary' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveFilter('unit')}
                    >
                      <Building2 className="mr-1 h-4 w-4" />
                      By Unit
                    </Button>
                    <Button 
                      variant={activeFilter === 'assigned' ? 'secondary' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveFilter('assigned')}
                    >
                      <Users className="mr-1 h-4 w-4" />
                      By Assignee
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total CAP Items</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">Across all workflows</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold text-amber-600">8</div>
                    <p className="text-xs text-muted-foreground">Awaiting action</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold text-blue-600">10</div>
                    <p className="text-xs text-muted-foreground">Currently being addressed</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold text-green-600">6</div>
                    <p className="text-xs text-muted-foreground">Successfully implemented</p>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="environmental">Environmental</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="governance">Governance</TabsTrigger>
                  <TabsTrigger value="data_privacy">Data Privacy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ESGCapTable />
                </TabsContent>
                
                <TabsContent value="environmental">
                  <ESGCapTable items={[]} />
                </TabsContent>
                
                <TabsContent value="social">
                  <ESGCapTable items={[]} />
                </TabsContent>
                
                <TabsContent value="governance">
                  <ESGCapTable items={[]} />
                </TabsContent>
                
                <TabsContent value="data_privacy">
                  <ESGCapTable items={[]} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </EnhancedSidebarLayout>
    </div>
  );
};

export default ESGCapPage;
