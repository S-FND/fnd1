
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { CarbonGoal, GoalFormValues } from './types';
import GoalForm from './GoalForm';

interface EditGoalDialogProps {
  goal: CarbonGoal | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  onGoalUpdated: (updatedGoal: CarbonGoal) => void;
}

const EditGoalDialog: React.FC<EditGoalDialogProps> = ({ 
  goal, 
  open, 
  setOpen, 
  onGoalUpdated 
}) => {
  if (!goal) return null;

  const handleSubmit = (values: GoalFormValues) => {
    const updatedGoal: CarbonGoal = {
      ...goal,
      name: values.name,
      description: values.description,
      targetReduction: values.targetReduction,
      deadline: values.deadline,
      category: values.category,
    };
    
    onGoalUpdated(updatedGoal);
    setOpen(false);
    toast({
      title: "Goal updated",
      description: "Your carbon reduction goal has been updated",
    });
  };

  const defaultValues: GoalFormValues = {
    name: goal.name,
    description: goal.description || "",
    targetReduction: goal.targetReduction,
    deadline: goal.deadline,
    category: goal.category,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Carbon Goal</DialogTitle>
          <DialogDescription>
            Update your personal carbon reduction goal details.
          </DialogDescription>
        </DialogHeader>
        <GoalForm 
          onSubmit={handleSubmit} 
          defaultValues={defaultValues}
          submitButtonText="Update Goal"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalDialog;
