
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssignmentTable from './AssignmentTable';
import AssignmentForm from './AssignmentForm';
import { mockEmployees, mockAssignments, companyInfo } from '../summary/mockData';

const GHGDataAssignmentRefactored = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getAssignmentById = (id: string) => {
    return mockAssignments.find(a => a.id === id) || null;
  };

  const getEmployeeById = (id: string) => {
    return mockEmployees.find(e => e.id === id) || null;
  };

  const selectedAssignment = selectedAssignmentId 
    ? getAssignmentById(selectedAssignmentId)
    : null;
  
  const selectedEmployee = selectedAssignment 
    ? getEmployeeById(selectedAssignment.employeeId)
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>GHG Data Collection Assignments</CardTitle>
          <CardDescription>
            Manage data collection tasks for {companyInfo.name} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="assignments">Current Assignments</TabsTrigger>
              <TabsTrigger value="create">Create Assignment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assignments" className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium">Active Assignments</h3>
                  <p className="text-sm text-muted-foreground">
                    {mockAssignments.length} assignments across {companyInfo.businessUnits.length} business units
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Export</Button>
                  <Button onClick={() => {
                    setSelectedAssignmentId(null);
                    setActiveTab('create');
                  }}>Create New Assignment</Button>
                </div>
              </div>
              
              <AssignmentTable 
                assignments={mockAssignments}
                employees={mockEmployees}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onViewDetails={(id) => {
                  setSelectedAssignmentId(id);
                  setActiveTab('create');
                }}
              />
            </TabsContent>
            
            <TabsContent value="create">
              <div className="mb-4">
                <h3 className="text-lg font-medium">
                  {selectedAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAssignment 
                    ? `Editing assignment for ${selectedEmployee?.name}`
                    : 'Assign GHG data collection tasks to employees'}
                </p>
              </div>
              
              <AssignmentForm 
                employees={mockEmployees}
                existingAssignment={selectedAssignment}
                onCancel={() => {
                  setSelectedAssignmentId(null);
                  setActiveTab('assignments');
                }}
                onSubmit={() => {
                  setSelectedAssignmentId(null);
                  setActiveTab('assignments');
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GHGDataAssignmentRefactored;
