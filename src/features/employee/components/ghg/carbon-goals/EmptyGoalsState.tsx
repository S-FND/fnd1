
import React from 'react';
import { Target } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyGoalsStateProps {
  onCreateGoal: () => void;
}

const EmptyGoalsState: React.FC<EmptyGoalsStateProps> = ({ onCreateGoal }) => {
  return (
    <div className="text-center py-8">
      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
      <h4 className="text-lg font-medium">No goals yet</h4>
      <p className="text-muted-foreground mb-4">
        Set your first carbon reduction goal to start tracking progress
      </p>
      <Button 
        variant="outline" 
        onClick={onCreateGoal}
      >
        Create Your First Goal
      </Button>
    </div>
  );
};

export default EmptyGoalsState;
