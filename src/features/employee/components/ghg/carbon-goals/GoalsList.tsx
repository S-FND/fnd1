
import React from 'react';
import { CarbonGoal } from './types';
import GoalCard from './GoalCard';
import EmptyGoalsState from './EmptyGoalsState';

interface GoalsListProps {
  goals: CarbonGoal[];
  onCreateGoal: () => void;
  onEditGoal: (goal: CarbonGoal) => void;
  onDeleteGoal: (goal: CarbonGoal) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ 
  goals, 
  onCreateGoal, 
  onEditGoal, 
  onDeleteGoal 
}) => {
  // Group goals by emission scope
  const scopeGoals = {
    scope1: goals.filter(goal => goal.emissionScope === 'scope1'),
    scope2: goals.filter(goal => goal.emissionScope === 'scope2'),
    scope3: goals.filter(goal => goal.emissionScope === 'scope3'),
    scope4: goals.filter(goal => goal.emissionScope === 'scope4'),
    other: goals.filter(goal => !goal.emissionScope || !['scope1', 'scope2', 'scope3', 'scope4'].includes(goal.emissionScope))
  };

  const renderScopeSection = (title: string, scopeGoals: CarbonGoal[]) => {
    if (scopeGoals.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="space-y-4">
          {scopeGoals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onEdit={onEditGoal} 
              onDelete={onDeleteGoal}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderScopeSection("Scope 1 - Direct Emissions", scopeGoals.scope1)}
      {renderScopeSection("Scope 2 - Indirect Emissions from Energy", scopeGoals.scope2)}
      {renderScopeSection("Scope 3 - Other Indirect Emissions", scopeGoals.scope3)}
      {renderScopeSection("Scope 4 - Avoided Emissions", scopeGoals.scope4)}
      {renderScopeSection("Other Goals", scopeGoals.other)}
      
      {goals.length === 0 && (
        <EmptyGoalsState onCreateGoal={onCreateGoal} />
      )}
    </div>
  );
};

export default GoalsList;
