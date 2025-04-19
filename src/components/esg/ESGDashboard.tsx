
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { esgKPIs, sdgGoals } from '@/data/mockData';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const COLORS = ['#22c55e', '#60a5fa', '#f59e0b', '#ec4899', '#8b5cf6'];
const SDG_COLORS = ['#e11d3f', '#dda63a', '#4c9f38', '#c5192d', '#ff3a21', '#26bde2', '#fcc30b', '#a21942', '#fd6925', '#dd1367', '#fd9d24', '#bf8b2e', '#3f7e44', '#0a97d9', '#56c02b', '#00689d', '#19486a'];

const ESGDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const filteredKPIs = selectedCategory === "All" 
    ? esgKPIs 
    : esgKPIs.filter(kpi => kpi.category === selectedCategory);
  
  const categoryData = [
    { name: 'Environment', value: esgKPIs.filter(kpi => kpi.category === 'Environment').length },
    { name: 'Social', value: esgKPIs.filter(kpi => kpi.category === 'Social').length },
    { name: 'Governance', value: esgKPIs.filter(kpi => kpi.category === 'Governance').length },
  ];
  
  const averageProgressByCategory = categoryData.map(category => {
    const kpis = esgKPIs.filter(kpi => kpi.category === category.name);
    const avgProgress = kpis.reduce((sum, kpi) => sum + kpi.progress, 0) / kpis.length;
    return { name: category.name, progress: Math.round(avgProgress) };
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-bold">ESG Management</h2>
        <p className="text-muted-foreground">
          Track, manage, and report on your environmental, social, and governance metrics
        </p>
      </div>

      <Tabs defaultValue="kpis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kpis">ESG KPIs</TabsTrigger>
          <TabsTrigger value="sdgs">SDG Goals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kpis">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    selectedCategory === "All" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  All Categories
                </button>
                {categoryData.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      selectedCategory === category.name 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                  >
                    {category.name} ({category.value})
                  </button>
                ))}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>ESG Key Performance Indicators</CardTitle>
                <CardDescription>
                  {selectedCategory === "All" 
                    ? "All metrics across environmental, social, and governance" 
                    : `${selectedCategory} metrics and their current status`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredKPIs.map((kpi) => (
                    <div key={kpi.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            kpi.category === 'Environment' ? 'bg-green-500' : 
                            kpi.category === 'Social' ? 'bg-blue-500' : 
                            'bg-amber-500'
                          }`} />
                          <span className="font-medium">{kpi.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {kpi.current}/{kpi.target} {kpi.unit}
                        </span>
                      </div>
                      <Progress value={kpi.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground pt-1">
                        <span>Target: {kpi.target} {kpi.unit}</span>
                        <span>{kpi.progress}% of target</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ESG Category Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Average Progress by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={averageProgressByCategory}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      domain={[0, 100]}
                      label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Bar dataKey="progress" fill="hsl(var(--primary))">
                      {averageProgressByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sdgs">
          <Card>
            <CardHeader>
              <CardTitle>Sustainable Development Goals (SDGs)</CardTitle>
              <CardDescription>
                Track your organization's contribution to the UN Sustainable Development Goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sdgGoals.map((goal) => (
                  <div 
                    key={goal.id} 
                    className="border rounded-lg p-4 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-10 h-10 flex items-center justify-center rounded text-white font-bold"
                        style={{ backgroundColor: SDG_COLORS[(goal.number - 1) % SDG_COLORS.length] }}
                      >
                        {goal.number}
                      </div>
                      <div className="font-medium text-sm">{goal.name}</div>
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between text-sm mb-1">
                        <div>Progress</div>
                        <div>{goal.progress}%</div>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Reports</CardTitle>
              <CardDescription>Generate and manage compliance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "BRSR Report",
                    description: "Business Responsibility and Sustainability Report",
                    lastGenerated: "Mar 15, 2024",
                    nextDue: "Jun 30, 2024",
                    status: "In Progress"
                  },
                  {
                    title: "GRI Report",
                    description: "Global Reporting Initiative Standards",
                    lastGenerated: "Dec 10, 2023",
                    nextDue: "Dec 31, 2024",
                    status: "Scheduled"
                  },
                  {
                    title: "TCFD Report",
                    description: "Task Force on Climate-related Financial Disclosures",
                    lastGenerated: "Feb 28, 2024",
                    nextDue: "Feb 28, 2025",
                    status: "Completed"
                  },
                  {
                    title: "CDP Climate Disclosure",
                    description: "Carbon Disclosure Project",
                    lastGenerated: "May 21, 2023",
                    nextDue: "May 21, 2024",
                    status: "Upcoming"
                  },
                ].map((report, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="font-medium">{report.title}</div>
                    <div className="text-sm text-muted-foreground mb-4">{report.description}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Last Generated:</div>
                        <div>{report.lastGenerated}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Next Due:</div>
                        <div>{report.nextDue}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-muted-foreground">Status:</div>
                        <div 
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            report.status === "Completed" ? "bg-green-100 text-green-800" :
                            report.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                            report.status === "Upcoming" ? "bg-amber-100 text-amber-800" :
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {report.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 border-t pt-4">
                <h3 className="font-medium mb-4">Generate New Report</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {["BRSR", "GRI", "TCFD", "CDP", "CSR", "EHS"].map((type) => (
                    <div key={type} className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                      <div className="font-medium">{type}</div>
                      <div className="text-sm text-muted-foreground">Generate {type} report</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGDashboard;
