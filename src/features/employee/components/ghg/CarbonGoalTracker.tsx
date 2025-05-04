
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CarbonGoal } from './carbon-goals/types';
import { sampleGoals } from './data/goals';
import AddGoalDialog from './carbon-goals/AddGoalDialog';
import EditGoalDialog from './carbon-goals/EditGoalDialog';
import DeleteGoalDialog from './carbon-goals/DeleteGoalDialog';
import GoalsList from './carbon-goals/GoalsList';

const CarbonGoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<CarbonGoal[]>(sampleGoals);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<CarbonGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<CarbonGoal | null>(null);
  
  const handleGoalCreated = (newGoal: CarbonGoal) => {
    setGoals([...goals, newGoal]);
  };

  const handleEditGoal = (goal: CarbonGoal) => {
    setGoalToEdit(goal);
    setEditDialogOpen(true);
  };

  const handleDeleteGoal = (goal: CarbonGoal) => {
    setGoalToDelete(goal);
    setDeleteDialogOpen(true);
  };

  const handleGoalUpdated = (updatedGoal: CarbonGoal) => {
    setGoals(goals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ));
  };

  const handleGoalDeleted = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Carbon Reduction Goals</CardTitle>
            <CardDescription>
              Track progress toward your personal emission reduction targets
            </CardDescription>
          </div>
          <AddGoalDialog 
            onGoalCreated={handleGoalCreated} 
            open={addDialogOpen}
            setOpen={setAddDialogOpen}
          />
        </CardHeader>
        <CardContent>
          <GoalsList 
            goals={goals} 
            onCreateGoal={() => setAddDialogOpen(true)} 
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        </CardContent>
      </Card>
      
      <EditGoalDialog 
        goal={goalToEdit} 
        open={editDialogOpen} 
        setOpen={setEditDialogOpen} 
        onGoalUpdated={handleGoalUpdated}
      />

      <DeleteGoalDialog
        goal={goalToDelete}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onGoalDeleted={handleGoalDeleted}
      />
    </div>
  );
};

export default CarbonGoalTracker;
