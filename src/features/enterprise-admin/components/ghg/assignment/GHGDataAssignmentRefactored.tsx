
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AssignmentForm from './AssignmentForm';
import AssignmentTable from './AssignmentTable';

export const GHGDataAssignmentRefactored = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // This function will be called when an assignment is successfully added
  const handleAssignmentSuccess = () => {
    // In a real app, we might refetch assignments data here
    // For now, just clear the search term to show all assignments again
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign GHG Data Collection Tasks</CardTitle>
          <CardDescription>
            Assign emission data collection tasks to personnel across your logistics facilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentForm onAssignSuccess={handleAssignmentSuccess} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Current Assignments</CardTitle>
            <CardDescription>Track ongoing data collection tasks across your facilities</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <AssignmentTable 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GHGDataAssignmentRefactored;
