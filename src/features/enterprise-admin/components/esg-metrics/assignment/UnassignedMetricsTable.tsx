
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Building2 } from 'lucide-react';

interface UnassignedMetric {
  id: string;
  name: string;
  unit: string;
  category: string;
  topicId: string;
  assignedTo: string | null;
  assignmentLevel: string | null;
}

interface AssigneeOption {
  id: string;
  name: string;
  role?: string;
  department?: string;
  location?: string;
}

interface UnassignedMetricsTableProps {
  unassignedMetrics: UnassignedMetric[];
  assignmentMode: 'individual' | 'unit';
  assigneeOptions: AssigneeOption[];
  onAssignment: (metricId: string, assigneeId: string, assigneeName: string) => void;
}

const UnassignedMetricsTable: React.FC<UnassignedMetricsTableProps> = ({
  unassignedMetrics,
  assignmentMode,
  assigneeOptions,
  onAssignment
}) => {
  if (unassignedMetrics.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unassigned Metrics</CardTitle>
        <CardDescription>Assign these metrics to team members or units</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Assign To</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unassignedMetrics.map((metric) => (
              <TableRow key={metric.id}>
                <TableCell className="font-medium">{metric.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{metric.category}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{metric.unit}</TableCell>
                <TableCell>
                  <Select onValueChange={(value) => {
                    const assignee = assigneeOptions.find(option => option.id === value);
                    if (assignee) {
                      onAssignment(metric.id, assignee.id, assignee.name);
                    }
                  }}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={`Select ${assignmentMode === 'individual' ? 'person' : 'unit'}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {assigneeOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center gap-2">
                            {assignmentMode === 'individual' ? (
                              <Users className="h-4 w-4" />
                            ) : (
                              <Building2 className="h-4 w-4" />
                            )}
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {assignmentMode === 'individual' 
                                  ? `${option.role} - ${option.department}`
                                  : option.location
                                }
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button size="sm" disabled>
                    Assign
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

export default UnassignedMetricsTable;
