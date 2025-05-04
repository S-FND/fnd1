
import React from 'react';
import { CarbonGoal } from './types';
import GoalCard from './GoalCard';
import EmptyGoalsState from './EmptyGoalsState';

interface GoalsListProps {
  goals: CarbonGoal[];
  onCreateGoal: () => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, onCreateGoal }) => {
  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
      
      {goals.length === 0 && (
        <EmptyGoalsState onCreateGoal={onCreateGoal} />
      )}
    </div>
  );
};

export default GoalsList;
