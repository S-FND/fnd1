
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import AssignmentStats from './assignment/AssignmentStats';
import AssignmentModeSelector from './assignment/AssignmentModeSelector';
import UnassignedMetricsTable from './assignment/UnassignedMetricsTable';
import AssignedMetricsTable from './assignment/AssignedMetricsTable';
import { mockSelectedMetrics, mockTeamMembers, mockUnits } from './assignment/mockData';

interface MaterialTopic {
  id: string;
  topic: string;
  category: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
}

interface MetricsAssignmentProps {
  materialTopics: MaterialTopic[];
}

const MetricsAssignment: React.FC<MetricsAssignmentProps> = ({ materialTopics }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(mockSelectedMetrics);
  const [assignmentMode, setAssignmentMode] = useState<'individual' | 'unit'>('individual');

  const handleAssignment = (metricId: string, assigneeId: string, assigneeName: string) => {
    setSelectedMetrics(metrics =>
      metrics.map(metric =>
        metric.id === metricId
          ? {
              ...metric,
              assignedTo: assigneeName,
              assignmentLevel: assignmentMode === 'individual' ? 'Individual' : 'Unit',
            }
          : metric
      )
    );
    toast.success(`Metric assigned to ${assigneeName}`);
  };

  const handleRemoveAssignment = (metricId: string) => {
    setSelectedMetrics(metrics =>
      metrics.map(metric =>
        metric.id === metricId
          ? { ...metric, assignedTo: null, assignmentLevel: null }
          : metric
      )
    );
    toast.success('Assignment removed');
  };

  const getAssigneeOptions = () => {
    return assignmentMode === 'individual' ? mockTeamMembers : mockUnits;
  };

  const unassignedMetrics = selectedMetrics.filter(metric => !metric.assignedTo);
  const assignedMetrics = selectedMetrics.filter(metric => metric.assignedTo);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metrics Assignment</CardTitle>
          <CardDescription>
            Assign ESG metrics to team members or business units for data collection and reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AssignmentModeSelector
              assignmentMode={assignmentMode}
              onModeChange={setAssignmentMode}
            />

            <AssignmentStats
              totalMetrics={selectedMetrics.length}
              assignedMetrics={assignedMetrics.length}
              unassignedMetrics={unassignedMetrics.length}
            />
          </div>
        </CardContent>
      </Card>

      <UnassignedMetricsTable
        unassignedMetrics={unassignedMetrics}
        assignmentMode={assignmentMode}
        assigneeOptions={getAssigneeOptions()}
        onAssignment={handleAssignment}
      />

      <AssignedMetricsTable
        assignedMetrics={assignedMetrics}
        onRemoveAssignment={handleRemoveAssignment}
      />
    </div>
  );
};

export default MetricsAssignment;
