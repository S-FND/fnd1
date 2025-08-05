
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Save, CheckCircle } from 'lucide-react';
import { ESGMetricWithTracking } from '../../data/esgMetricsData';

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

interface SelectedMetricsListProps {
  selectedMetrics: ESGMetricWithTracking[];
  selectedTopic: MaterialTopic | undefined;
  onEditMetric: (metric: ESGMetricWithTracking) => void;
  onRemoveMetric: (metricId: string) => void;
  onSaveConfiguration?: () => void;
  savedMetrics?: ESGMetricWithTracking[];
  onEditSavedMetric?: (metric: ESGMetricWithTracking) => void;
  onDeleteSavedMetric?: (metricId: string) => void;
}

const SelectedMetricsList: React.FC<SelectedMetricsListProps> = ({
  selectedMetrics,
  selectedTopic,
  onEditMetric,
  onRemoveMetric,
  onSaveConfiguration,
  savedMetrics = [],
  onEditSavedMetric,
  onDeleteSavedMetric
}) => {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Daily': return 'bg-red-100 text-red-800';
      case 'Weekly': return 'bg-orange-100 text-orange-800';
      case 'Monthly': return 'bg-blue-100 text-blue-800';
      case 'Quarterly': return 'bg-purple-100 text-purple-800';
      case 'Bi-Annually': return 'bg-indigo-100 text-indigo-800';
      case 'Annually': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Metrics for Current Topic */}
      {selectedMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Selected Metrics ({selectedMetrics.length})</CardTitle>
                <CardDescription>
                  {selectedTopic ? `Metrics for ${selectedTopic.topic}` : 'Selected metrics for configuration'}
                </CardDescription>
              </div>
              {onSaveConfiguration && (
                <Button onClick={onSaveConfiguration} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Configuration
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {selectedMetrics.map((metric) => (
                <div key={metric.code} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{metric.name}</h4>
                      <Badge variant="outline">{metric.source}</Badge>
                      <Badge className={getFrequencyColor(metric.collectionFrequency)}>
                        {metric.collectionFrequency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{metric.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Unit: {metric.unit}</span>
                      <span>Type: {metric.dataType}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditMetric(metric)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onRemoveMetric(metric.code)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Metrics Configuration */}
      {savedMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Configured Metrics ({savedMetrics.length})
            </CardTitle>
            <CardDescription>
              These metrics are saved and available for data entry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {savedMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{metric.name}</h4>
                      <Badge variant="outline">{metric.source}</Badge>
                      <Badge className={getFrequencyColor(metric.collectionFrequency)}>
                        {metric.collectionFrequency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{metric.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Unit: {metric.unit}</span>
                      <span>Type: {metric.dataType}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {onEditSavedMetric && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onEditSavedMetric(metric)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDeleteSavedMetric && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDeleteSavedMetric(metric.code)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedMetrics.length === 0 && savedMetrics.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No metrics selected yet</p>
            <p className="text-sm text-muted-foreground">Select a topic and add metrics to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelectedMetricsList;
