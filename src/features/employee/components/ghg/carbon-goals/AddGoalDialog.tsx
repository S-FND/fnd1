
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CarbonGoal, GoalFormValues } from './types';
import GoalForm from './GoalForm';

interface AddGoalDialogProps {
  onGoalCreated: (goal: CarbonGoal) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddGoalDialog: React.FC<AddGoalDialogProps> = ({ 
  onGoalCreated, 
  open, 
  setOpen
}) => {
  const onSubmit = (values: GoalFormValues) => {
    const newGoal: CarbonGoal = {
      id: Date.now().toString(),
      name: values.name,
      description: values.description,
      targetReduction: values.targetReduction,
      deadline: values.deadline,
      currentProgress: 0,
      category: values.category,
    };
    
    onGoalCreated(newGoal);
    setOpen(false);
    toast({
      title: "Goal created",
      description: "Your carbon reduction goal has been created",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Goal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Carbon Goal</DialogTitle>
          <DialogDescription>
            Set a new personal carbon reduction goal to track your progress.
          </DialogDescription>
        </DialogHeader>
        <GoalForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
