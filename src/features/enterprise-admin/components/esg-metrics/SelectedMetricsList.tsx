
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ESGMetricWithTracking } from '../../data/esgMetricsData';
import { Edit, Trash2 } from 'lucide-react';

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

interface SelectedMetricsListProps {
  selectedMetrics: ESGMetricWithTracking[];
  selectedTopic: MaterialTopic | undefined;
  onEditMetric: (metric: ESGMetricWithTracking) => void;
  onRemoveMetric: (metricId: string) => void;
}

const SelectedMetricsList: React.FC<SelectedMetricsListProps> = ({
  selectedMetrics,
  selectedTopic,
  onEditMetric,
  onRemoveMetric
}) => {
  if (selectedMetrics.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Metrics ({selectedMetrics.length})</CardTitle>
        <CardDescription>
          Your chosen metrics for {selectedTopic?.name}. You can edit or remove metrics as needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedMetrics.map(metric => (
              <TableRow key={metric.id}>
                <TableCell className="font-medium">{metric.name}</TableCell>
                <TableCell className="text-sm">{metric.description}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{metric.unit}</TableCell>
                <TableCell>
                  <Badge variant={metric.source === 'Custom' ? 'secondary' : 'outline'}>
                    {metric.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onEditMetric(metric)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onRemoveMetric(metric.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SelectedMetricsList;
