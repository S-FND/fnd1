
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, Building2, UserCheck } from 'lucide-react';

interface MaterialTopic {
  id: string;
  name: string;
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

// Mock data for selected metrics (in real app, this would come from the metrics manager)
const mockSelectedMetrics = [
  {
    id: 'giin_ghg',
    name: 'Greenhouse Gas Emissions',
    unit: 'Metric tons of CO2 equivalent',
    category: 'Environmental',
    topicId: 'climate',
    assignedTo: null,
    assignmentLevel: null,
  },
  {
    id: 'giin_water',
    name: 'Water Consumption',
    unit: 'Cubic meters',
    category: 'Environmental',
    topicId: 'water',
    assignedTo: 'John Smith',
    assignmentLevel: 'Organization',
  },
  {
    id: 'giin_diversity',
    name: 'Gender Diversity',
    unit: 'Percentage',
    category: 'Social',
    topicId: 'diversity',
    assignedTo: 'HR Team',
    assignmentLevel: 'Department',
  },
];

// Mock team members and units
const mockTeamMembers = [
  { id: '1', name: 'John Smith', role: 'ESG Manager', department: 'Sustainability' },
  { id: '2', name: 'Sarah Johnson', role: 'Data Analyst', department: 'Operations' },
  { id: '3', name: 'Mike Chen', role: 'Environmental Specialist', department: 'EHS' },
  { id: '4', name: 'Lisa Davis', role: 'HR Manager', department: 'Human Resources' },
];

const mockUnits = [
  { id: '1', name: 'Mumbai Office', location: 'Mumbai, Maharashtra' },
  { id: '2', name: 'Delhi Office', location: 'Delhi, India' },
  { id: '3', name: 'Bangalore Office', location: 'Bangalore, Karnataka' },
  { id: '4', name: 'Manufacturing Unit 1', location: 'Pune, Maharashtra' },
];

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
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Assignment Level:</label>
              <Select value={assignmentMode} onValueChange={(value: 'individual' | 'unit') => setAssignmentMode(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Individual Assignment
                    </div>
                  </SelectItem>
                  <SelectItem value="unit">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Unit Assignment
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedMetrics.length}</div>
                <div className="text-sm text-muted-foreground">Total Metrics</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{assignedMetrics.length}</div>
                <div className="text-sm text-muted-foreground">Assigned</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{unassignedMetrics.length}</div>
                <div className="text-sm text-muted-foreground">Unassigned</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {unassignedMetrics.length > 0 && (
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
                        const assignee = getAssigneeOptions().find(option => option.id === value);
                        if (assignee) {
                          handleAssignment(metric.id, assignee.id, assignee.name);
                        }
                      }}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder={`Select ${assignmentMode === 'individual' ? 'person' : 'unit'}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getAssigneeOptions().map((option) => (
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
                                      ? `${(option as any).role} - ${(option as any).department}`
                                      : (option as any).location
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
      )}

      {assignedMetrics.length > 0 && (
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
                        onClick={() => handleRemoveAssignment(metric.id)}
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
      )}
    </div>
  );
};

export default MetricsAssignment;
