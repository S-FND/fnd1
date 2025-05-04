
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, PenLine, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CarbonGoal } from './types';

interface GoalCardProps {
  goal: CarbonGoal;
  onEdit: (goal: CarbonGoal) => void;
  onDelete: (goal: CarbonGoal) => void;
}

export const getCategoryColor = (category: CarbonGoal['category']) => {
  switch (category) {
    case 'transport': return 'bg-blue-500';
    case 'home': return 'bg-purple-500';
    case 'food': return 'bg-green-500';
    case 'shopping': return 'bg-amber-500';
    default: return 'bg-primary';
  }
};

export const getCategoryLabel = (category: CarbonGoal['category']) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const getDaysRemaining = (deadline: string) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  return (
    <div 
      key={goal.id} 
      className="border p-4 rounded-md shadow-sm hover:shadow transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium">{goal.name}</h4>
          {goal.description && (
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getCategoryColor(goal.category)} hover:${getCategoryColor(goal.category)}`}>
            {getCategoryLabel(goal.category)}
          </Badge>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(goal)}
              className="h-8 w-8"
              title="Edit goal"
            >
              <PenLine className="h-4 w-4" />
              <span className="sr-only">Edit goal</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(goal)}
              className="h-8 w-8 text-destructive hover:text-destructive"
              title="Delete goal"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete goal</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>{goal.currentProgress}%</span>
          <span className="text-primary">{goal.targetReduction}% goal</span>
        </div>
        <Progress 
          value={(goal.currentProgress / goal.targetReduction) * 100} 
          className="h-2" 
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground mt-3">
        <div className="flex items-center">
          <Target className="h-3 w-3 mr-1" />
          <span>{goal.targetReduction}% reduction target</span>
        </div>
        <div className="flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>{goal.currentProgress}% progress so far</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{getDaysRemaining(goal.deadline)} days remaining</span>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
