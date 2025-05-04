
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { CarbonGoal } from './types';

interface DeleteGoalDialogProps {
  goal: CarbonGoal | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  onGoalDeleted: (goalId: string) => void;
}

const DeleteGoalDialog: React.FC<DeleteGoalDialogProps> = ({
  goal,
  open,
  setOpen,
  onGoalDeleted
}) => {
  if (!goal) return null;

  const getScopeLabel = (scope: string | undefined) => {
    switch(scope) {
      case 'scope1': return 'Scope 1 (Direct Emissions)';
      case 'scope2': return 'Scope 2 (Indirect Emissions from Energy)';
      case 'scope3': return 'Scope 3 (Other Indirect Emissions)';
      case 'scope4': return 'Scope 4 (Avoided Emissions)';
      default: return 'Carbon';
    }
  };

  const handleDelete = () => {
    onGoalDeleted(goal.id);
    setOpen(false);
    toast({
      title: "Goal deleted",
      description: `Your ${getScopeLabel(goal.emissionScope)} reduction goal has been deleted`,
      variant: "destructive",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {getScopeLabel(goal.emissionScope)} Goal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your "{goal.name}" goal? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGoalDialog;
