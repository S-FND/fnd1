
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

  return (
    <div className="space-y-6">
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
