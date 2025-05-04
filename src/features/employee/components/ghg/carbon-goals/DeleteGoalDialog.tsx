
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

  const handleDelete = () => {
    onGoalDeleted(goal.id);
    setOpen(false);
    toast({
      title: "Goal deleted",
      description: "Your carbon reduction goal has been deleted",
      variant: "destructive",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Carbon Goal</AlertDialogTitle>
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
