
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AssignmentStatsProps {
  totalMetrics: number;
  assignedMetrics: number;
  unassignedMetrics: number;
}

const AssignmentStats: React.FC<AssignmentStatsProps> = ({
  totalMetrics,
  assignedMetrics,
  unassignedMetrics
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div className="p-4 border rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{totalMetrics}</div>
        <div className="text-sm text-muted-foreground">Total Metrics</div>
      </div>
      <div className="p-4 border rounded-lg">
        <div className="text-2xl font-bold text-green-600">{assignedMetrics}</div>
        <div className="text-sm text-muted-foreground">Assigned</div>
      </div>
      <div className="p-4 border rounded-lg">
        <div className="text-2xl font-bold text-amber-600">{unassignedMetrics}</div>
        <div className="text-sm text-muted-foreground">Unassigned</div>
      </div>
    </div>
  );
};

export default AssignmentStats;
