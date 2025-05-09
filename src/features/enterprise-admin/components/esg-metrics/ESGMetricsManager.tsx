
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMetricsByTopic, getDefaultMetricTracking, ESGMetricWithTracking } from '../../data/esgMetricsData';
import { toast } from 'sonner';

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

interface ESGMetricsManagerProps {
  materialTopics: MaterialTopic[];
}

const ESGMetricsManager: React.FC<ESGMetricsManagerProps> = ({ materialTopics }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [availableMetrics, setAvailableMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [customMetricName, setCustomMetricName] = useState<string>('');
  const [customMetricDescription, setCustomMetricDescription] = useState<string>('');
  const [customMetricUnit, setCustomMetricUnit] = useState<string>('');

  // Load metrics when topic changes
  useEffect(() => {
    if (selectedTopicId) {
      const metrics = getMetricsByTopic(selectedTopicId)
        .map(metric => getDefaultMetricTracking(metric));
      setAvailableMetrics(metrics);
    } else {
      setAvailableMetrics([]);
    }
  }, [selectedTopicId]);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setSelectedMetrics([]);
  };

  const handleToggleMetric = (metricId: string) => {
    const updatedMetrics = availableMetrics.map(metric => {
      if (metric.id === metricId) {
        return { ...metric, isSelected: !metric.isSelected };
      }
      return metric;
    });
    
    setAvailableMetrics(updatedMetrics);
  };

  const handleSaveSelectedMetrics = () => {
    const newSelectedMetrics = availableMetrics.filter(metric => metric.isSelected);
    setSelectedMetrics(newSelectedMetrics);
    toast.success(`${newSelectedMetrics.length} metrics selected for tracking`);
  };

  const handleAddCustomMetric = () => {
    if (!customMetricName.trim() || !selectedTopicId) {
      toast.error('Please enter a metric name and select a topic');
      return;
    }

    const selectedTopic = materialTopics.find(topic => topic.id === selectedTopicId);
    if (!selectedTopic) return;

    const customMetric: ESGMetricWithTracking = {
      id: `custom_${Date.now()}`,
      name: customMetricName,
      description: customMetricDescription || 'Custom metric',
      unit: customMetricUnit || 'N/A',
      source: 'Custom',
      framework: 'Custom',
      relatedTopic: selectedTopicId,
      category: selectedTopic.category === 'Environment' 
        ? 'Environmental' 
        : (selectedTopic.category as 'Social' | 'Governance'),
      dataType: 'Numeric',
      collectionFrequency: 'Monthly',
      dataPoints: [],
      isSelected: true
    };

    setAvailableMetrics([...availableMetrics, customMetric]);
    setCustomMetricName('');
    setCustomMetricDescription('');
    setCustomMetricUnit('');
    toast.success('Custom metric added');
  };

  const handleUpdateMetricData = (metricId: string, field: keyof ESGMetricWithTracking, value: any) => {
    setSelectedMetrics(selectedMetrics.map(metric => {
      if (metric.id === metricId) {
        return { ...metric, [field]: value };
      }
      return metric;
    }));
  };

  const handleAddDataPoint = (metricId: string, date: string, value: string) => {
    if (!date || !value.trim()) {
      toast.error('Please provide both date and value');
      return;
    }

    setSelectedMetrics(selectedMetrics.map(metric => {
      if (metric.id === metricId) {
        const parsedValue = metric.dataType === 'Numeric' || metric.dataType === 'Percentage' 
          ? parseFloat(value) 
          : value;
        
        return {
          ...metric,
          dataPoints: [...metric.dataPoints, { date, value: parsedValue }]
        };
      }
      return metric;
    }));

    toast.success('Data point added');
  };

  const selectedTopic = materialTopics.find(topic => topic.id === selectedTopicId);

  // Helper function to convert boolean values to strings for Input component
  const convertValueForInput = (value: string | number | boolean | undefined): string | number => {
    if (value === undefined || value === null) return '';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return value;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ESG Metrics Management</CardTitle>
          <CardDescription>Select material topics and define metrics for tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Material Topic</label>
              <Select value={selectedTopicId} onValueChange={handleSelectTopic}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a material topic" />
                </SelectTrigger>
                <SelectContent>
                  {materialTopics.map(topic => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name} ({topic.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTopic && (
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-1">{selectedTopic.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedTopic.description}</p>
              </div>
            )}

            {selectedTopicId && (
              <>
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Available Metrics</h3>
                    <Button onClick={handleSaveSelectedMetrics} size="sm">Save Selected</Button>
                  </div>
                  {availableMetrics.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead>Metric Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Source</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableMetrics.map(metric => (
                          <TableRow key={metric.id}>
                            <TableCell>
                              <input 
                                type="checkbox" 
                                checked={metric.isSelected} 
                                onChange={() => handleToggleMetric(metric.id)} 
                                className="h-4 w-4"
                              />
                            </TableCell>
                            <TableCell>{metric.name}</TableCell>
                            <TableCell>{metric.description}</TableCell>
                            <TableCell>{metric.unit}</TableCell>
                            <TableCell>{metric.source}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No predefined metrics available for this topic. Add a custom metric.
                    </div>
                  )}
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Add Custom Metric</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input 
                        value={customMetricName} 
                        onChange={(e) => setCustomMetricName(e.target.value)} 
                        placeholder="Metric name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Input 
                        value={customMetricDescription} 
                        onChange={(e) => setCustomMetricDescription(e.target.value)} 
                        placeholder="Description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Unit</label>
                      <Input 
                        value={customMetricUnit} 
                        onChange={(e) => setCustomMetricUnit(e.target.value)} 
                        placeholder="e.g., kg, %, $"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddCustomMetric}>Add Custom Metric</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Metrics for {selectedTopic?.name}</CardTitle>
            <CardDescription>Configure baseline, targets and data collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {selectedMetrics.map(metric => (
                <div key={metric.id} className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{metric.name}</h3>
                      <p className="text-sm text-muted-foreground">{metric.description} ({metric.unit})</p>
                    </div>
                    <div className="text-sm px-2 py-1 bg-muted rounded-full">
                      {metric.source}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Baseline Data</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs mb-1">Date</label>
                          <Input 
                            type="date" 
                            value={metric.baselineDate || ''} 
                            onChange={(e) => handleUpdateMetricData(metric.id, 'baselineDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1">Value ({metric.unit})</label>
                          <Input 
                            type={metric.dataType === 'Numeric' || metric.dataType === 'Percentage' ? 'number' : 'text'} 
                            value={convertValueForInput(metric.baselineValue)} 
                            onChange={(e) => handleUpdateMetricData(
                              metric.id, 
                              'baselineValue', 
                              metric.dataType === 'Numeric' || metric.dataType === 'Percentage' 
                                ? parseFloat(e.target.value) 
                                : e.target.value
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Target Data</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs mb-1">Date</label>
                          <Input 
                            type="date" 
                            value={metric.targetDate || ''} 
                            onChange={(e) => handleUpdateMetricData(metric.id, 'targetDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1">Value ({metric.unit})</label>
                          <Input 
                            type={metric.dataType === 'Numeric' || metric.dataType === 'Percentage' ? 'number' : 'text'} 
                            value={convertValueForInput(metric.targetValue)} 
                            onChange={(e) => handleUpdateMetricData(
                              metric.id, 
                              'targetValue', 
                              metric.dataType === 'Numeric' || metric.dataType === 'Percentage' 
                                ? parseFloat(e.target.value) 
                                : e.target.value
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Data Collection Frequency</h4>
                    <Select 
                      value={metric.collectionFrequency} 
                      onValueChange={(value) => handleUpdateMetricData(
                        metric.id, 
                        'collectionFrequency', 
                        value as ESGMetricWithTracking['collectionFrequency']
                      )}
                    >
                      <SelectTrigger className="w-full md:w-1/3">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Bi-Annually">Bi-Annually</SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                        <SelectItem value="Never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Data Points</h4>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div>
                        <Input 
                          type="date" 
                          id={`data-date-${metric.id}`} 
                          placeholder="Date" 
                        />
                      </div>
                      <div>
                        <Input 
                          type={metric.dataType === 'Numeric' || metric.dataType === 'Percentage' ? 'number' : 'text'} 
                          id={`data-value-${metric.id}`} 
                          placeholder={`Value (${metric.unit})`} 
                        />
                      </div>
                      <div>
                        <Button 
                          onClick={() => {
                            const dateInput = document.getElementById(`data-date-${metric.id}`) as HTMLInputElement;
                            const valueInput = document.getElementById(`data-value-${metric.id}`) as HTMLInputElement;
                            handleAddDataPoint(metric.id, dateInput.value, valueInput.value);
                            dateInput.value = '';
                            valueInput.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {metric.dataPoints.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {metric.dataPoints.map((point, index) => (
                            <TableRow key={`${metric.id}-point-${index}`}>
                              <TableCell>{point.date}</TableCell>
                              <TableCell>{point.value} {metric.unit}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-2 text-sm text-muted-foreground">
                        No data points added yet
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ESGMetricsManager;
