
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart3, ArrowUpRight, TrendingUp, TrendingDown, BarChart, Users, AlertTriangle } from "lucide-react";

const OverviewDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ESG Score</CardTitle>
            <div className="h-4 w-4 text-green-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78/100</div>
            <p className="text-xs text-muted-foreground">+5 from previous quarter</p>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '78%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <div className="h-4 w-4 text-green-500">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-12%</div>
            <p className="text-xs text-muted-foreground">Year-over-year reduction</p>
            <div className="mt-3 flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">On track to meet 2025 goals</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <div className="h-4 w-4 text-amber-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">3 open issues</p>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-amber-500" style={{ width: '94%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Engagement</CardTitle>
            <div className="h-4 w-4 text-blue-500">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+12% from last survey</p>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: '78%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Main Content - 4 cols wide */}
        <div className="col-span-6 md:col-span-4 space-y-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>ESG Performance Overview</CardTitle>
              <CardDescription>Metrics across Environmental, Social, and Governance</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="environmental" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="environmental">Environmental</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="governance">Governance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="environmental" className="space-y-4">
                  <div className="h-72 border-2 border-dashed border-muted rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <LineChart className="h-10 w-10" />
                      <p>Environmental metrics visualization</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="social" className="space-y-4">
                  <div className="h-72 border-2 border-dashed border-muted rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-10 w-10" />
                      <p>Social metrics visualization</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="governance" className="space-y-4">
                  <div className="h-72 border-2 border-dashed border-muted rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <BarChart className="h-10 w-10" />
                      <p>Governance metrics visualization</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Emission Trends</CardTitle>
                <CardDescription>Last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 border-2 border-dashed border-muted rounded-md flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <LineChart className="h-8 w-8" />
                    <p>Emissions chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Waste Reduction</CardTitle>
                <CardDescription>Progress toward yearly goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 border-2 border-dashed border-muted rounded-md flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BarChart3 className="h-8 w-8" />
                    <p>Waste reduction chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Sidebar - 2 cols wide */}
        <div className="col-span-6 md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Due this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: "Environmental Audit",
                    dueDate: "May 15, 2025",
                    priority: "high",
                    status: "pending"
                  },
                  {
                    title: "ESG Report Submission",
                    dueDate: "May 30, 2025",
                    priority: "medium",
                    status: "in-progress" 
                  },
                  { 
                    title: "Water Conservation Plan",
                    dueDate: "June 5, 2025",
                    priority: "low",
                    status: "pending"
                  }
                ].map((task, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full ${
                      task.priority === "high" ? "bg-red-500" :
                      task.priority === "medium" ? "bg-amber-500" : "bg-green-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          task.status === "in-progress" ? "bg-blue-100 text-blue-800" : "bg-muted text-muted-foreground"
                        }`}>
                          {task.status === "in-progress" ? "In Progress" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>System notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: "ESG Rating Updated",
                    message: "Your company ESG rating has improved by 3 points.",
                    time: "2 hours ago" 
                  },
                  { 
                    title: "Compliance Alert",
                    message: "New environmental regulation applicable to your sector.",
                    time: "Yesterday"
                  },
                  { 
                    title: "Report Generated",
                    message: "Monthly sustainability report is ready for review.",
                    time: "3 days ago"
                  }
                ].map((update, i) => (
                  <div key={i} className="border-l-2 border-primary pl-3 space-y-1">
                    <p className="text-sm font-medium">{update.title}</p>
                    <p className="text-xs text-muted-foreground">{update.message}</p>
                    <p className="text-xs text-muted-foreground">{update.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
