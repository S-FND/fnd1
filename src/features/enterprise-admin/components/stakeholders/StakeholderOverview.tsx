
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Network, Users } from "lucide-react";
import { sampleStakeholders, defaultStakeholderSubcategories } from '../../data/stakeholders';

const StakeholderOverview: React.FC = () => {
  const internalCount = sampleStakeholders.filter(
    s => defaultStakeholderSubcategories.find(sc => sc.id === s.subcategoryId)?.category === 'internal'
  ).length;
  
  const externalCount = sampleStakeholders.filter(
    s => defaultStakeholderSubcategories.find(sc => sc.id === s.subcategoryId)?.category === 'external'
  ).length;
  
  const categoryCount = new Set(sampleStakeholders.map(s => s.subcategoryId)).size;
  
  const analyticsCards = [
    {
      title: "Total Stakeholders",
      value: sampleStakeholders.length.toString(),
      description: "Registered in the system",
      icon: () => <Network className="h-4 w-4 text-blue-500" />,
      color: "text-blue-500",
    },
    {
      title: "Internal",
      value: internalCount.toString(),
      description: "Internal stakeholders",
      icon: () => <Users className="h-4 w-4 text-green-500" />,
      color: "text-green-500",
    },
    {
      title: "External",
      value: externalCount.toString(),
      description: "External stakeholders",
      icon: () => <Network className="h-4 w-4 text-amber-500" />,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {analyticsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stakeholder Management</CardTitle>
          <CardDescription>Manage and categorize your stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="internal">Internal</TabsTrigger>
              <TabsTrigger value="external">External</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <p>Manage all {sampleStakeholders.length} stakeholders across {categoryCount} categories.</p>
              <div className="rounded-md border">
                <div className="p-4">
                  Navigate to the "Manage Stakeholders" page to add, edit, or remove stakeholders.
                </div>
              </div>
            </TabsContent>
            <TabsContent value="internal" className="space-y-4">
              <p>Manage {internalCount} internal stakeholders.</p>
              <div className="rounded-md border">
                <div className="p-4">
                  Internal stakeholders include employees, managers, board members, and shareholders.
                </div>
              </div>
            </TabsContent>
            <TabsContent value="external" className="space-y-4">
              <p>Manage {externalCount} external stakeholders.</p>
              <div className="rounded-md border">
                <div className="p-4">
                  External stakeholders include customers, suppliers, regulators, and community organizations.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakeholderOverview;
