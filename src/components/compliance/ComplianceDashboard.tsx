import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, CircleAlert, ClipboardCheck, FileCheck, FileWarning } from 'lucide-react';
import { complianceItems } from '@/data';

const ComplianceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-bold">Compliance Management</h2>
        <p className="text-muted-foreground">
          Track regulatory compliance, audits, and reporting requirements
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Compliance Calendar</CardTitle>
                <CardDescription>Upcoming deadlines and requirements</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>View Calendar</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceItems.map((item) => {
                const deadline = new Date(item.deadline);
                const today = new Date();
                const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                let statusBadge;
                if (item.status === "Completed") {
                  statusBadge = <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
                } else if (item.status === "At Risk") {
                  statusBadge = <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">At Risk</Badge>;
                } else {
                  statusBadge = <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">On Track</Badge>;
                }
                
                return (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex gap-3">
                      {item.status === "Completed" ? (
                        <CheckCircle2 className="text-green-500 h-5 w-5" />
                      ) : daysUntil < 15 ? (
                        <CircleAlert className="text-amber-500 h-5 w-5" />
                      ) : (
                        <ClipboardCheck className="text-blue-500 h-5 w-5" />
                      )}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                          {statusBadge}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{deadline.toLocaleDateString()}</div>
                      {item.status !== "Completed" && (
                        <div className={`text-xs ${daysUntil < 15 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {daysUntil > 0 ? `${daysUntil} days remaining` : 'Due today'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle>Compliance Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-500">92%</div>
                <div className="text-sm text-muted-foreground">Overall Compliance</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-amber-500">2</div>
                <div className="text-sm text-muted-foreground">Items At Risk</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-500">12</div>
                <div className="text-sm text-muted-foreground">Upcoming Tasks</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Completed This Month</div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <h3 className="font-medium">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Submit New Compliance
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileWarning className="mr-2 h-4 w-4" />
                  Report Non-Compliance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ehs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ehs">EHS Compliance</TabsTrigger>
          <TabsTrigger value="corporate">Corporate Compliance</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ehs">
          <Card>
            <CardHeader>
              <CardTitle>Environment, Health & Safety Compliance</CardTitle>
              <CardDescription>
                Track regulatory requirements and safety standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Workplace Safety Assessment",
                      dueDate: "Apr 15, 2024",
                      status: "Scheduled",
                      location: "Mumbai HQ"
                    },
                    {
                      title: "Environmental Emissions Report",
                      dueDate: "May 30, 2024",
                      status: "In Progress",
                      location: "All Sites"
                    },
                    {
                      title: "Chemical Safety Audit",
                      dueDate: "Jun 12, 2024",
                      status: "Not Started",
                      location: "Delhi Branch"
                    },
                    {
                      title: "Fire Safety Drill",
                      dueDate: "Mar 28, 2024",
                      status: "Completed",
                      location: "All Sites"
                    },
                    {
                      title: "Health Risk Assessment",
                      dueDate: "Jul 10, 2024",
                      status: "Not Started",
                      location: "Bangalore Tech"
                    },
                    {
                      title: "Waste Management Verification",
                      dueDate: "May 15, 2024",
                      status: "Scheduled",
                      location: "Chennai Ops"
                    },
                  ].map((item, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="font-medium">{item.title}</div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-muted-foreground">Due:</span>
                        <span>{item.dueDate}</span>
                      </div>
                      <div className="flex justify-between mt-1 text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{item.location}</span>
                      </div>
                      <div className="mt-3">
                        <Badge 
                          variant="outline" 
                          className={`${
                            item.status === "Completed" ? "bg-green-100 text-green-800" :
                            item.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                            item.status === "Scheduled" ? "bg-amber-100 text-amber-800" :
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="corporate">
          <Card>
            <CardHeader>
              <CardTitle>Corporate Compliance</CardTitle>
              <CardDescription>
                Legal and regulatory requirements under Companies Act and other laws
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3">Regulation</th>
                        <th className="text-left p-3">Deadline</th>
                        <th className="text-left p-3">Responsibility</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          regulation: "Annual Financial Statements",
                          deadline: "Jun 30, 2024",
                          responsibility: "Finance Team",
                          status: "In Progress"
                        },
                        {
                          regulation: "Board Meeting (Q2)",
                          deadline: "Apr 25, 2024",
                          responsibility: "Company Secretary",
                          status: "Scheduled"
                        },
                        {
                          regulation: "GST Returns (Monthly)",
                          deadline: "Apr 20, 2024",
                          responsibility: "Tax Department",
                          status: "Not Started"
                        },
                        {
                          regulation: "AGM Preparation",
                          deadline: "Aug 15, 2024",
                          responsibility: "Legal Team",
                          status: "Not Started"
                        },
                        {
                          regulation: "ESG Disclosure (SEBI)",
                          deadline: "Sep 30, 2024",
                          responsibility: "Sustainability Team",
                          status: "Not Started"
                        },
                      ].map((item, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3">{item.regulation}</td>
                          <td className="p-3">{item.deadline}</td>
                          <td className="p-3">{item.responsibility}</td>
                          <td className="p-3">
                            <Badge 
                              variant="outline" 
                              className={`${
                                item.status === "Completed" ? "bg-green-100 text-green-800" :
                                item.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                                item.status === "Scheduled" ? "bg-amber-100 text-amber-800" :
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle>Audit Management</CardTitle>
              <CardDescription>Schedule and track internal and external audits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button>Schedule New Audit</Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3">Audit Type</th>
                        <th className="text-left p-3">Scheduled Date</th>
                        <th className="text-left p-3">Location</th>
                        <th className="text-left p-3">Auditor</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          type: "ISO 14001 Environmental",
                          date: "May 18-20, 2024",
                          location: "Mumbai HQ",
                          auditor: "Bureau Veritas",
                          status: "Scheduled"
                        },
                        {
                          type: "Internal Safety Audit",
                          date: "Apr 10, 2024",
                          location: "Delhi Branch",
                          auditor: "Internal EHS Team",
                          status: "Completed"
                        },
                        {
                          type: "ISO 45001 Health & Safety",
                          date: "Jun 5-7, 2024",
                          location: "All Sites",
                          auditor: "TUV SUD",
                          status: "Scheduled"
                        },
                        {
                          type: "ESG Performance Review",
                          date: "Jul 12, 2024",
                          location: "Corporate Office",
                          auditor: "KPMG",
                          status: "Not Started"
                        },
                      ].map((item, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3">{item.type}</td>
                          <td className="p-3">{item.date}</td>
                          <td className="p-3">{item.location}</td>
                          <td className="p-3">{item.auditor}</td>
                          <td className="p-3">
                            <Badge 
                              variant="outline" 
                              className={`${
                                item.status === "Completed" ? "bg-green-100 text-green-800" :
                                item.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                                item.status === "Scheduled" ? "bg-amber-100 text-amber-800" :
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceDashboard;
