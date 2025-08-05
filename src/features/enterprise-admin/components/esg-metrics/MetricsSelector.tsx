
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ESGMetricWithTracking } from '../../data/esgMetricsData';
import { Plus, ExternalLink } from 'lucide-react';

interface MaterialTopic {
  id: string;
  topic: string;
  esg: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
}

interface MetricsSelectorProps {
  selectedTopic: MaterialTopic | undefined;
  availableMetrics: ESGMetricWithTracking[];
  selectedMetrics: ESGMetricWithTracking[];
  onAddMetric: (metricId: string) => void;
  onOpenCustomDialog: () => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  children: React.ReactNode; // For the custom metric dialog
}

const MetricsSelector: React.FC<MetricsSelectorProps> = ({
  selectedTopic,
  availableMetrics,
  selectedMetrics,
  onAddMetric,
  onOpenCustomDialog,
  isAddDialogOpen,
  setIsAddDialogOpen,
  children
}) => {
  if (!selectedTopic) return null;

  const irisMetrics = availableMetrics.filter(metric => metric.source === 'IRIS+');
  const otherMetrics = availableMetrics.filter(metric => metric.source !== 'IRIS+');
  const hasIrisMetrics = irisMetrics.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {hasIrisMetrics ? 'IRIS+ Recommended Metrics' : 'Available Metrics'}
              {hasIrisMetrics && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  IRIS+ Database
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {hasIrisMetrics 
                ? `Recommended metrics from IRIS+ database for ${selectedTopic.topic}. These are industry-standard metrics for this material topic.`
                : `Available metrics for ${selectedTopic.topic}`
              }
              <a 
                href="https://iris.thegiin.org/metrics/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 ml-2 text-blue-600 hover:text-blue-800"
              >
                View IRIS+ Database <ExternalLink className="h-3 w-3" />
              </a>
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={onOpenCustomDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Metric
              </Button>
            </DialogTrigger>
            {children}
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {availableMetrics.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableMetrics.map(metric => (
                <TableRow key={metric.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {metric.name}
                      {metric.source === 'IRIS+' && (
                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          IRIS+
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{metric.description}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{metric.unit}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{metric.framework}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      onClick={() => onAddMetric(metric.id)}
                      disabled={selectedMetrics.some(sm => sm.id === metric.id)}
                    >
                      {selectedMetrics.some(sm => sm.id === metric.id) ? 'Added' : 'Add'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No predefined IRIS+ metrics available for this topic.</p>
            <p className="text-sm">You can add custom metrics using the button above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsSelector;
