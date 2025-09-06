import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ESGCapItem } from '../../types/esgDD';

interface ESGCapScoringProps {
  items: ESGCapItem[];
}

export const ESGCapScoring: React.FC<ESGCapScoringProps> = ({ items }) => {

  // Priority weightages - adjusted for actual priority values (capitalized)
  const priorityWeights = {
    High: 2,
    Medium: 1,
    Low: 0.5
  };

  // Calculate total weightage
  const totalItems = items.length;
  const baseWeight = totalItems > 0 ? 100 / totalItems : 0;
  
  const totalWeightage = items.reduce((sum, item) => {
    // Handle case sensitivity - convert to proper case
    const priority = item.priority || 'Medium'; // Default to Medium if undefined
    const weight = priorityWeights[priority] || priorityWeights.Medium;
    return sum + (baseWeight * weight);
  }, 0);

  // Calculate completed weightage
  const completedWeightage = items
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => {
      // Handle case sensitivity - convert to proper case
      const priority = item.priority || 'Medium'; // Default to Medium if undefined
      const weight = priorityWeights[priority] || priorityWeights.Medium;
      return sum + (baseWeight * weight);
    }, 0);

  // Calculate progress percentage
  const progressPercentage = totalWeightage > 0 ? (completedWeightage / totalWeightage) * 100 : 0;

  // Status breakdown
  const statusCounts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">ESG CAP Progress</h3>
            <div className="text-2xl font-bold text-primary">
              {progressPercentage.toFixed(1)}%
            </div>
          </div>
          
          <Progress value={progressPercentage} className="w-full h-3" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="font-semibold text-lg">{totalItems}</div>
              <div className="text-muted-foreground">Total Items</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-lg text-green-700">{statusCounts.completed || 0}</div>
              <div className="text-green-600">Completed</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-lg text-blue-700">{statusCounts.in_progress || 0}</div>
              <div className="text-blue-600">In Progress</div>
            </div>
            
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="font-semibold text-lg text-amber-700">{statusCounts.pending || 0}</div>
              <div className="text-amber-600">Pending</div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Weighted Score: {completedWeightage.toFixed(1)} / {totalWeightage.toFixed(1)}</span>
            <span>Progress: {progressPercentage.toFixed(1)}% Complete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};