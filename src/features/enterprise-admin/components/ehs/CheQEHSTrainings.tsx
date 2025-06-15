
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Download, FileText, Users, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cheqEHSTrainings } from '../../data/cheq-mock-data';

const CheQEHSTrainings: React.FC = () => {
  // Group trainings by category
  const trainingsByCategory: Record<string, typeof cheqEHSTrainings> = {};
  
  cheqEHSTrainings.forEach(training => {
    if (!trainingsByCategory[training.category]) {
      trainingsByCategory[training.category] = [];
    }
    trainingsByCategory[training.category].push(training);
  });
  
  // Calculate overall completion rate
  const totalAssigned = cheqEHSTrainings.reduce((sum, training) => sum + training.assignedEmployees, 0);
  const completedCount = cheqEHSTrainings.reduce((sum, training) => 
    sum + Math.round(training.assignedEmployees * (training.completionRate / 100)), 0
  );
  const overallCompletionRate = Math.round((completedCount / totalAssigned) * 100);
  
  // Calculate expiring soon count
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const expiringSoonCount = cheqEHSTrainings.filter(training => {
    const dueDate = new Date(training.nextDueDate);
    return dueDate > today && dueDate <= thirtyDaysFromNow;
  }).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CheQ.one EHS Trainings</h1>
        <p className="text-muted-foreground">
          Manage environment, health, and safety trainings for financial services personnel
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search trainings..." className="pl-8" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="flex-1 md:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            New Training
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total EHS Trainings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cheqEHSTrainings.length}</div>
            <p className="text-xs text-muted-foreground">
              Active training modules
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{overallCompletionRate}%</div>
              {overallCompletionRate >= 80 ? (
                <Badge className="bg-green-500">Good</Badge>
              ) : overallCompletionRate >= 60 ? (
                <Badge className="bg-amber-500">Moderate</Badge>
              ) : (
                <Badge variant="destructive">Needs Attention</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalAssigned} employees completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Employees Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssigned}</div>
            <p className="text-xs text-muted-foreground">
              Across all training programs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringSoonCount}</div>
            <p className="text-xs text-muted-foreground">
              Trainings due in next 30 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
              <CardTitle>EHS Training Programs</CardTitle>
              <CardDescription>Status of environment, health, and safety training modules</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Training Policy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Categories</TabsTrigger>
              {Object.keys(trainingsByCategory).map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <TrainingsList trainings={cheqEHSTrainings} />
            </TabsContent>
            
            {Object.entries(trainingsByCategory).map(([category, trainings]) => (
              <TabsContent key={category} value={category} className="mt-4">
                <TrainingsList trainings={trainings} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Services Specific EHS Requirements</CardTitle>
          <CardDescription>Key regulatory requirements for the banking sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Data Center Safety",
                  description: "Ensuring proper safety protocols in data centers and server rooms",
                  authority: "IT Infrastructure Safety Act",
                  dueDate: "Annual"
                },
                {
                  title: "Physical Branch Security",
                  description: "Security measures for customer-facing banking locations",
                  authority: "Banking & Financial Security Regulations",
                  dueDate: "Bi-annual"
                },
                {
                  title: "Digital Banking Accessibility",
                  description: "Ensuring digital services are accessible to all customers",
                  authority: "Digital Accessibility Standards",
                  dueDate: "Continuous"
                }
              ].map((requirement, i) => (
                <Card key={i} className="bg-muted/40">
                  <CardContent className="pt-4">
                    <h3 className="font-medium">{requirement.title}</h3>
                    <p className="text-sm text-muted-foreground my-2">{requirement.description}</p>
                    <div className="flex justify-between text-xs">
                      <span>{requirement.authority}</span>
                      <span>Due: {requirement.dueDate}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                CheQ.one follows all regulatory EHS requirements specific to the financial services industry, 
                with particular focus on data security, physical security, and accessibility standards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface TrainingsListProps {
  trainings: typeof cheqEHSTrainings;
}

const TrainingsList: React.FC<TrainingsListProps> = ({ trainings }) => {
  return (
    <div className="space-y-4">
      {trainings.map((training, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{training.name}</h3>
                <Badge variant={training.type === 'Mandatory' ? "destructive" : training.type === 'Required' ? "default" : "outline"}>
                  {training.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{training.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{training.assignedEmployees} employees</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium">Completion Rate</div>
              <div className="text-sm font-medium">{training.completionRate}%</div>
            </div>
            <Progress value={training.completionRate} className="h-2" />
          </div>
          
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              Next due date: <span className="font-medium">{training.nextDueDate}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm">View Details</Button>
              <Button size="sm" variant="outline">Send Reminder</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheQEHSTrainings;
