
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, FileCheck, AlertTriangle, Shield } from 'lucide-react';
import NonCompliances from '@/components/dashboard/NonCompliances';
import ESGRisks from '@/components/dashboard/ESGRisks';

const analyticsCards = [
  {
    title: "Total Enterprises",
    value: "28",
    description: "Registered enterprise clients",
    change: 12,
    icon: Building,
    color: "text-blue-500",
  },
  {
    title: "Total Users",
    value: "4,320",
    description: "Active users across enterprises",
    change: 8,
    icon: Users,
    color: "text-green-500",
  },
  {
    title: "Compliance Rate",
    value: "74%",
    description: "Average compliance rate",
    change: -3,
    icon: FileCheck,
    color: "text-amber-500",
  },
];

const FandoroAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {analyticsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
              <div className="mt-2 flex items-center gap-1">
                {card.change > 0 ? (
                  <span className="text-xs text-green-500">+{card.change}%</span>
                ) : (
                  <span className="text-xs text-red-500">{card.change}%</span>
                )}
                <span className="text-xs text-muted-foreground">from previous quarter</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Top Non-Compliances</CardTitle>
              <CardDescription>Critical non-compliances across enterprises</CardDescription>
            </div>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <NonCompliances />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Top ESG Risks</CardTitle>
              <CardDescription>Critical ESG risks across enterprises</CardDescription>
            </div>
            <Shield className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <ESGRisks />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="enterprises" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enterprises">Enterprises</TabsTrigger>
          <TabsTrigger value="non-compliances">Non-Compliances</TabsTrigger>
          <TabsTrigger value="esg-risks">ESG Risks</TabsTrigger>
          <TabsTrigger value="esg-cap">ESG CAP</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enterprises" className="space-y-4">
          <EnterprisesList />
        </TabsContent>
        
        <TabsContent value="non-compliances" className="space-y-4">
          <NonCompliancesList />
        </TabsContent>
        
        <TabsContent value="esg-risks" className="space-y-4">
          <ESGRisksList />
        </TabsContent>
        
        <TabsContent value="esg-cap" className="space-y-4">
          <ESGCapList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Mock enterprise list component
const EnterprisesList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Enterprises</CardTitle>
        <CardDescription>All registered enterprise clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Enterprise {i+1}</p>
                <p className="text-sm text-muted-foreground">
                  {['Technology', 'Manufacturing', 'Retail', 'Healthcare', 'Finance'][i]} Sector • {['200', '450', '120', '380', '275'][i]} Users
                </p>
              </div>
              <button className="text-sm text-primary hover:underline">View Details</button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Mock non-compliances list component
const NonCompliancesList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Non-Compliances</CardTitle>
        <CardDescription>Manage non-compliances across enterprises</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Non-Compliance {i+1}</p>
                <p className="text-sm text-muted-foreground">
                  Enterprise {Math.floor(Math.random() * 5) + 1} • {['High', 'Medium', 'High', 'Critical', 'Medium'][i]} Severity
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-blue-600 hover:underline">Edit</button>
                <button className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Mock ESG risks list component
const ESGRisksList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All ESG Risks</CardTitle>
        <CardDescription>Manage ESG risks across enterprises</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">ESG Risk {i+1}</p>
                <p className="text-sm text-muted-foreground">
                  Enterprise {Math.floor(Math.random() * 5) + 1} • {['Environmental', 'Social', 'Governance', 'Environmental', 'Social'][i]} Category
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-blue-600 hover:underline">Edit</button>
                <button className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Mock ESG CAP list component
const ESGCapList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ESG Corrective Action Plans</CardTitle>
        <CardDescription>Manage ESG CAP items for enterprises</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">CAP Item {i+1}</p>
                <p className="text-sm text-muted-foreground">
                  Enterprise {Math.floor(Math.random() * 5) + 1} • Due: {['2024-06-15', '2024-07-20', '2024-06-30', '2024-08-15', '2024-07-10'][i]}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-blue-600 hover:underline">Edit</button>
                <button className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FandoroAdminDashboard;
