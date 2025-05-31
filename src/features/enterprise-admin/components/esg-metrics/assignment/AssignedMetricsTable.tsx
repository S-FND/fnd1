
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck } from 'lucide-react';

interface AssignedMetric {
  id: string;
  name: string;
  unit: string;
  category: string;
  topicId: string;
  assignedTo: string;
  assignmentLevel: string;
}

interface AssignedMetricsTableProps {
  assignedMetrics: AssignedMetric[];
  onRemoveAssignment: (metricId: string) => void;
}

const AssignedMetricsTable: React.FC<AssignedMetricsTableProps> = ({
  assignedMetrics,
  onRemoveAssignment
}) => {
  if (assignedMetrics.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Metrics</CardTitle>
        <CardDescription>Currently assigned metrics and their owners</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Assignment Level</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedMetrics.map((metric) => (
              <TableRow key={metric.id}>
                <TableCell className="font-medium">{metric.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{metric.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    {metric.assignedTo}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{metric.assignmentLevel}</Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onRemoveAssignment(metric.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AssignedMetricsTable;
