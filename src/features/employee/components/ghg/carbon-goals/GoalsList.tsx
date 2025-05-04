
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

  // Add scope descriptions for better understanding
  const scopeDescriptions = {
    scope1: "Direct emissions from owned or controlled sources",
    scope2: "Indirect emissions from purchased electricity, heat, or steam",
    scope3: "All other indirect emissions in a company's value chain",
    scope4: "Avoided emissions through products, services, or initiatives",
    other: "Goals without a specific emission scope"
  };

  const renderScopeSection = (title: string, description: string, scopeGoals: CarbonGoal[]) => {
    if (scopeGoals.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
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
      {renderScopeSection(
        "Scope 1 - Direct Emissions", 
        scopeDescriptions.scope1,
        scopeGoals.scope1
      )}
      {renderScopeSection(
        "Scope 2 - Indirect Emissions from Energy", 
        scopeDescriptions.scope2,
        scopeGoals.scope2
      )}
      {renderScopeSection(
        "Scope 3 - Other Indirect Emissions", 
        scopeDescriptions.scope3,
        scopeGoals.scope3
      )}
      {renderScopeSection(
        "Scope 4 - Avoided Emissions", 
        scopeDescriptions.scope4,
        scopeGoals.scope4
      )}
      {renderScopeSection(
        "Other Goals", 
        scopeDescriptions.other,
        scopeGoals.other
      )}
      
      {goals.length === 0 && (
        <EmptyGoalsState onCreateGoal={onCreateGoal} />
      )}
    </div>
  );
};

export default GoalsList;
