import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { ArrowUp, ArrowDown, LineChart, Award, Activity } from 'lucide-react';

const EnhancedEmployeeDashboard = () => {
  const { isLoading } = useRouteProtection(['employee']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus() || user?.role !== 'employee') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <UnifiedSidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Personal Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Here's your personal sustainability snapshot.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
                <div className="h-4 w-4 text-green-500">
                  <ArrowDown className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-8%</div>
                <p className="text-xs text-muted-foreground">Month-over-month reduction</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
                <div className="h-4 w-4 text-green-500">
                  <ArrowUp className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65%</div>
                <p className="text-xs text-muted-foreground">3 courses completed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sustainability Score</CardTitle>
                <div className="h-4 w-4 text-amber-500">
                  <Activity className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72/100</div>
                <p className="text-xs text-muted-foreground">+5 from previous month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <div className="h-4 w-4 text-blue-500">
                  <Award className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Earned this quarter</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-6">
            <div className="col-span-6 md:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Carbon Footprint</CardTitle>
                  <CardDescription>Last 12 months</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="h-full border-2 border-dashed border-muted rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <LineChart className="h-10 w-10" />
                      <p>Carbon footprint visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-6 md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        title: "Sustainable Office Practices",
                        dueDate: "May 15, 2025",
                        progress: 0 
                      },
                      {
                        title: "Carbon Reduction Strategies",
                        dueDate: "May 30, 2025",
                        progress: 25 
                      },
                      { 
                        title: "ESG Fundamentals",
                        dueDate: "June 5, 2025",
                        progress: 60
                      }
                    ].map((course, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.progress}%</p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">Due: {course.dueDate}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Eco Tips</CardTitle>
                  <CardDescription>Daily sustainability ideas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">Reduce standby power</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Unplug electronics when not in use to save 5-10% on energy bills.
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">Go paperless</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Switch to digital notes and documents to reduce paper waste.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </UnifiedSidebarLayout>
    </div>
  );
};

export default EnhancedEmployeeDashboard;
