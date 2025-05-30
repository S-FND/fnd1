
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Users, MapPin, Building } from 'lucide-react';
import { AddEmployeeDialog } from './AddEmployeeDialog';
import { EmployeeTable } from './EmployeeTable';
import { LocationsManager } from './LocationsManager';
import { Employee, Location } from '../../types/team';

const TeamManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Unit Head',
      department: 'Operations',
      location: {
        type: 'Office',
        city: 'Bangalore',
        name: 'Bangalore Head Office'
      },
      isActive: true,
      joinDate: '2023-01-15',
      permissions: {
        dataCollection: true,
        dataReview: true,
        teamManagement: true
      },
      createdAt: '2023-01-15',
      updatedAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Maker',
      department: 'Finance',
      location: {
        type: 'Office',
        city: 'Mumbai',
        name: 'Mumbai Branch Office'
      },
      unitHeadId: '1',
      isActive: true,
      joinDate: '2023-03-10',
      permissions: {
        dataCollection: true,
        dataReview: false,
        teamManagement: false
      },
      createdAt: '2023-03-10',
      updatedAt: '2023-03-10'
    }
  ]);

  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Bangalore Head Office',
      type: 'Office',
      city: 'Bangalore',
      address: '123 Tech Park, Electronic City',
      isActive: true
    },
    {
      id: '2',
      name: 'Mumbai Branch Office',
      type: 'Office',
      city: 'Mumbai',
      address: '456 Business Hub, Andheri East',
      isActive: true
    },
    {
      id: '3',
      name: 'Delhi Warehouse',
      type: 'Warehouse',
      city: 'Delhi',
      address: '789 Industrial Area, Gurgaon',
      isActive: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEmployees([...employees, employee]);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map(emp => 
      emp.id === updatedEmployee.id 
        ? { ...updatedEmployee, updatedAt: new Date().toISOString() }
        : emp
    ));
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTeamStats = () => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.isActive).length;
    const unitHeads = employees.filter(emp => emp.role === 'Unit Head').length;
    const makers = employees.filter(emp => emp.role === 'Maker').length;
    const checkers = employees.filter(emp => emp.role === 'Checker').length;

    return {
      total: totalEmployees,
      active: activeEmployees,
      unitHeads,
      makers,
      checkers
    };
  };

  const stats = getTeamStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unit Heads</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.unitHeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Makers</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.makers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checkers</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.checkers}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Team Members</CardTitle>
                <Button onClick={() => setIsAddEmployeeOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <EmployeeTable
                employees={filteredEmployees}
                onUpdateEmployee={handleUpdateEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                unitHeads={employees.filter(emp => emp.role === 'Unit Head')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <LocationsManager 
            locations={locations}
            setLocations={setLocations}
          />
        </TabsContent>
      </Tabs>

      <AddEmployeeDialog
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onAddEmployee={handleAddEmployee}
        locations={locations}
        unitHeads={employees.filter(emp => emp.role === 'Unit Head')}
      />
    </div>
  );
};

export default TeamManagement;
