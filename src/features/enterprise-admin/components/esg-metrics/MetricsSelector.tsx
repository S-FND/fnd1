
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
  name: string;
  category: string;
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recommended GIIN IRIS+ Metrics</CardTitle>
            <CardDescription>
              Metrics recommended for: <strong>{selectedTopic.name}</strong>
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
                  <TableCell className="font-medium">{metric.name}</TableCell>
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
