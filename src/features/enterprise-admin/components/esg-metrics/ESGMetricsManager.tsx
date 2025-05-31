
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getMetricsByTopic, getDefaultMetricTracking, ESGMetricWithTracking } from '../../data/esgMetricsData';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

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
  const [editingMetric, setEditingMetric] = useState<ESGMetricWithTracking | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Custom metric form state
  const [customMetricForm, setCustomMetricForm] = useState({
    name: '',
    description: '',
    unit: '',
    dataType: 'Numeric' as 'Numeric' | 'Percentage' | 'Text' | 'Boolean',
  });

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

  const handleAddMetric = (metricId: string) => {
    const metric = availableMetrics.find(m => m.id === metricId);
    if (metric && !selectedMetrics.find(sm => sm.id === metricId)) {
      setSelectedMetrics([...selectedMetrics, { ...metric, isSelected: true }]);
      toast.success('Metric added to your selection');
    }
  };

  const handleRemoveMetric = (metricId: string) => {
    setSelectedMetrics(selectedMetrics.filter(m => m.id !== metricId));
    toast.success('Metric removed from selection');
  };

  const handleEditMetric = (metric: ESGMetricWithTracking) => {
    setEditingMetric(metric);
    setCustomMetricForm({
      name: metric.name,
      description: metric.description,
      unit: metric.unit,
      dataType: metric.dataType,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingMetric) {
      setSelectedMetrics(metrics =>
        metrics.map(m =>
          m.id === editingMetric.id
            ? {
                ...m,
                name: customMetricForm.name,
                description: customMetricForm.description,
                unit: customMetricForm.unit,
                dataType: customMetricForm.dataType,
              }
            : m
        )
      );
      toast.success('Metric updated successfully');
      setIsEditDialogOpen(false);
      setEditingMetric(null);
      resetCustomMetricForm();
    }
  };

  const handleAddCustomMetric = () => {
    if (!customMetricForm.name.trim() || !selectedTopicId) {
      toast.error('Please enter a metric name and select a topic');
      return;
    }

    const selectedTopic = materialTopics.find(topic => topic.id === selectedTopicId);
    if (!selectedTopic) return;

    const customMetric: ESGMetricWithTracking = {
      id: `custom_${Date.now()}`,
      name: customMetricForm.name,
      description: customMetricForm.description || 'Custom metric',
      unit: customMetricForm.unit || 'N/A',
      source: 'Custom',
      framework: 'Custom',
      relatedTopic: selectedTopicId,
      category: selectedTopic.category === 'Environment' 
        ? 'Environmental' 
        : (selectedTopic.category as 'Social' | 'Governance'),
      dataType: customMetricForm.dataType,
      collectionFrequency: 'Monthly',
      dataPoints: [],
      isSelected: true
    };

    setSelectedMetrics([...selectedMetrics, customMetric]);
    setIsAddDialogOpen(false);
    resetCustomMetricForm();
    toast.success('Custom metric added successfully');
  };

  const resetCustomMetricForm = () => {
    setCustomMetricForm({
      name: '',
      description: '',
      unit: '',
      dataType: 'Numeric',
    });
  };

  const selectedTopic = materialTopics.find(topic => topic.id === selectedTopicId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Material Topic</CardTitle>
          <CardDescription>Choose a material topic to view recommended GIIN IRIS+ metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedTopicId} onValueChange={handleSelectTopic}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a material topic from your materiality assessment" />
            </SelectTrigger>
            <SelectContent>
              {materialTopics.map(topic => (
                <SelectItem key={topic.id} value={topic.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: topic.color }}
                    />
                    <div>
                      <div className="font-medium">{topic.name}</div>
                      <div className="text-xs text-muted-foreground">{topic.category}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTopic && (
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
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Metric
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Metric</DialogTitle>
                    <DialogDescription>
                      Create a custom metric for {selectedTopic.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Metric Name *</label>
                      <Input 
                        value={customMetricForm.name} 
                        onChange={(e) => setCustomMetricForm(prev => ({...prev, name: e.target.value}))} 
                        placeholder="Enter metric name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Input 
                        value={customMetricForm.description} 
                        onChange={(e) => setCustomMetricForm(prev => ({...prev, description: e.target.value}))} 
                        placeholder="Describe the metric"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Unit of Measurement</label>
                      <Input 
                        value={customMetricForm.unit} 
                        onChange={(e) => setCustomMetricForm(prev => ({...prev, unit: e.target.value}))} 
                        placeholder="e.g., kg, %, hours, USD"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Data Type</label>
                      <Select 
                        value={customMetricForm.dataType} 
                        onValueChange={(value: any) => setCustomMetricForm(prev => ({...prev, dataType: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Numeric">Numeric</SelectItem>
                          <SelectItem value="Percentage">Percentage</SelectItem>
                          <SelectItem value="Text">Text</SelectItem>
                          <SelectItem value="Boolean">Yes/No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCustomMetric}>
                        Add Metric
                      </Button>
                    </div>
                  </div>
                </DialogContent>
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
                          onClick={() => handleAddMetric(metric.id)}
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
      )}

      {selectedMetrics.length > 0 && (
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
                          onClick={() => handleEditMetric(metric)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRemoveMetric(metric.id)}
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
      )}

      {/* Edit Metric Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Metric</DialogTitle>
            <DialogDescription>
              Modify the metric details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Metric Name *</label>
              <Input 
                value={customMetricForm.name} 
                onChange={(e) => setCustomMetricForm(prev => ({...prev, name: e.target.value}))} 
                placeholder="Enter metric name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input 
                value={customMetricForm.description} 
                onChange={(e) => setCustomMetricForm(prev => ({...prev, description: e.target.value}))} 
                placeholder="Describe the metric"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit of Measurement</label>
              <Input 
                value={customMetricForm.unit} 
                onChange={(e) => setCustomMetricForm(prev => ({...prev, unit: e.target.value}))} 
                placeholder="e.g., kg, %, hours, USD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Type</label>
              <Select 
                value={customMetricForm.dataType} 
                onValueChange={(value: any) => setCustomMetricForm(prev => ({...prev, dataType: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Numeric">Numeric</SelectItem>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Text">Text</SelectItem>
                  <SelectItem value="Boolean">Yes/No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ESGMetricsManager;
