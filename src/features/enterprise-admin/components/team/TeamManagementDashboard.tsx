
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Building2, MapPin } from 'lucide-react';
import EmployeeManagement from './EmployeeManagement';
import LocationManagement from './LocationManagement';
import RoleAssignment from './RoleAssignment';
import UnitHeadsManagement from './UnitHeadsManagement';

const TeamManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');

  const stats = [
    {
      title: 'Total Employees',
      value: '124',
      icon: Users,
      description: 'Across all locations'
    },
    {
      title: 'Locations',
      value: '8',
      icon: MapPin,
      description: 'Cities and units'
    },
    {
      title: 'Unit Heads',
      value: '12',
      icon: Building2,
      description: 'Department leaders'
    },
    {
      title: 'Pending Assignments',
      value: '5',
      icon: UserPlus,
      description: 'Role assignments'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="roles">Role Assignment</TabsTrigger>
          <TabsTrigger value="unit-heads">Unit Heads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees">
          <EmployeeManagement />
        </TabsContent>
        
        <TabsContent value="locations">
          <LocationManagement />
        </TabsContent>
        
        <TabsContent value="roles">
          <RoleAssignment />
        </TabsContent>
        
        <TabsContent value="unit-heads">
          <UnitHeadsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagementDashboard;
