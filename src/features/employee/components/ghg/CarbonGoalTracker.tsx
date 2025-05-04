
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CarbonGoal } from './carbon-goals/types';
import { sampleGoals } from './data/goals';
import AddGoalDialog from './carbon-goals/AddGoalDialog';
import GoalsList from './carbon-goals/GoalsList';

const CarbonGoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<CarbonGoal[]>(sampleGoals);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleGoalCreated = (newGoal: CarbonGoal) => {
    setGoals([...goals, newGoal]);
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
            open={dialogOpen}
            setOpen={setDialogOpen}
          />
        </CardHeader>
        <CardContent>
          <GoalsList 
            goals={goals} 
            onCreateGoal={() => setDialogOpen(true)} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonGoalTracker;
