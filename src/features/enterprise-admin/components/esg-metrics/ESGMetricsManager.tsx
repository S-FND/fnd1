
import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getMetricsByTopic, getDefaultMetricTracking, ESGMetricWithTracking } from '../../data/esgMetricsData';
import { getIRISMetricsByTopic, isStandardMaterialTopic, IRISMetric } from '../../data/irisMetricsDatabase';
import { toast } from 'sonner';
import TopicSelector from './TopicSelector';
import MetricsSelector from './MetricsSelector';
import SelectedMetricsList from './SelectedMetricsList';
import CustomMetricDialog from './CustomMetricDialog';
import ExcelUpload from './ExcelUpload';

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
  const [savedMetrics, setSavedMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [editingMetric, setEditingMetric] = useState<ESGMetricWithTracking | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [customMetrics, setCustomMetrics] = useState<ESGMetricWithTracking[]>([]);
  
  // Custom metric form state
  const [customMetricForm, setCustomMetricForm] = useState({
    name: '',
    description: '',
    unit: '',
    dataType: 'Numeric' as 'Numeric' | 'Percentage' | 'Text' | 'Boolean' | 'Dropdown' | 'Radio' | 'Table',
    collectionFrequency: 'Monthly' as 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Bi-Annually' | 'Annually',
    inputFormat: {
      options: [] as string[],
      tableColumns: [] as string[],
      tableRows: 1,
    },
  });

  // Load saved metrics and custom metrics from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedESGMetrics');
    if (saved) {
      try {
        const parsedMetrics = JSON.parse(saved);
        setSavedMetrics(parsedMetrics);
      } catch (error) {
        console.error('Error loading saved metrics:', error);
      }
    }

    const savedCustomMetrics = localStorage.getItem('customESGMetrics');
    if (savedCustomMetrics) {
      try {
        const customData = JSON.parse(savedCustomMetrics);
        setCustomMetrics(customData);
      } catch (error) {
        console.error('Error loading custom metrics:', error);
      }
    }
  }, []);

  // Save metrics to localStorage whenever savedMetrics changes
  useEffect(() => {
    localStorage.setItem('savedESGMetrics', JSON.stringify(savedMetrics));
  }, [savedMetrics]);

  // Load metrics when topic changes
  useEffect(() => {
    if (selectedTopicId && selectedTopicId !== 'all-topics') {
      // Check if this is a standard material topic with IRIS+ metrics
      if (isStandardMaterialTopic(selectedTopicId)) {
        // Get IRIS+ metrics for this topic
        const irisMetrics = getIRISMetricsByTopic(selectedTopicId);
        const convertedIrisMetrics: ESGMetricWithTracking[] = irisMetrics.map(metric => ({
          id: metric.id,
          name: metric.name,
          description: metric.description,
          unit: metric.unit,
          source: 'IRIS+',
          framework: metric.framework,
          relatedTopic: selectedTopicId,
          category: metric.category,
          dataType: metric.dataType,
          inputFormat: {},
          collectionFrequency: metric.collectionFrequency,
          dataPoints: [],
          isSelected: false
        }));
        
        // Also get any existing topic-specific metrics
        const topicMetrics = getMetricsByTopic(selectedTopicId)
          .map(metric => {
            const defaultTracking = getDefaultMetricTracking(metric);
            return {
              ...defaultTracking,
              collectionFrequency: 'Monthly' as const
            };
          });
        
        // Combine IRIS+ metrics, topic-specific metrics, and custom metrics
        setAvailableMetrics([...convertedIrisMetrics, ...topicMetrics, ...customMetrics]);
      } else {
        // For custom topics or topics without IRIS+ metrics, use existing logic
        const topicMetrics = getMetricsByTopic(selectedTopicId)
          .map(metric => {
            const defaultTracking = getDefaultMetricTracking(metric);
            return {
              ...defaultTracking,
              collectionFrequency: 'Monthly' as const
            };
          });
        setAvailableMetrics([...topicMetrics, ...customMetrics]);
      }
    } else {
      // If no topic selected or "all-topics" selected, show all custom metrics as available
      setAvailableMetrics(customMetrics);
    }
  }, [selectedTopicId, customMetrics]);

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
      collectionFrequency: metric.collectionFrequency,
      inputFormat: {
        options: metric.inputFormat?.options || [],
        tableColumns: metric.inputFormat?.tableColumns || [],
        tableRows: metric.inputFormat?.tableRows || 1,
      },
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSavedMetric = (metric: ESGMetricWithTracking) => {
    setEditingMetric(metric);
    setCustomMetricForm({
      name: metric.name,
      description: metric.description,
      unit: metric.unit,
      dataType: metric.dataType,
      collectionFrequency: metric.collectionFrequency,
      inputFormat: {
        options: metric.inputFormat?.options || [],
        tableColumns: metric.inputFormat?.tableColumns || [],
        tableRows: metric.inputFormat?.tableRows || 1,
      },
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteSavedMetric = (metricId: string) => {
    setSavedMetrics(metrics => metrics.filter(m => m.id !== metricId));
    toast.success('Metric deleted successfully');
  };

  const handleSaveEdit = () => {
    if (editingMetric) {
      const updatedMetric = {
        ...editingMetric,
        name: customMetricForm.name,
        description: customMetricForm.description,
        unit: customMetricForm.unit,
        dataType: customMetricForm.dataType,
        inputFormat: customMetricForm.inputFormat,
        collectionFrequency: customMetricForm.collectionFrequency,
      };

      setSelectedMetrics(metrics =>
        metrics.map(m => m.id === editingMetric.id ? updatedMetric : m)
      );

      // Update in saved metrics if it exists there
      setSavedMetrics(metrics =>
        metrics.map(m => m.id === editingMetric.id ? updatedMetric : m)
      );

      // Update in custom metrics if it's a custom metric
      if (editingMetric.source === 'Custom') {
        const updatedCustomMetrics = customMetrics.map(m => 
          m.id === editingMetric.id ? updatedMetric : m
        );
        setCustomMetrics(updatedCustomMetrics);
        localStorage.setItem('customESGMetrics', JSON.stringify(updatedCustomMetrics));
      }

      toast.success('Metric updated successfully');
      setIsEditDialogOpen(false);
      setEditingMetric(null);
      resetCustomMetricForm();
    }
  };

  const handleAddCustomMetric = () => {
    if (!customMetricForm.name.trim()) {
      toast.error('Please enter a metric name');
      return;
    }

    // Determine category based on selected topic or default
    let category: 'Environmental' | 'Social' | 'Governance' = 'Environmental';
    if (selectedTopicId) {
      const selectedTopic = materialTopics.find(topic => topic.id === selectedTopicId);
      if (selectedTopic) {
        category = selectedTopic.category === 'Environment' 
          ? 'Environmental' 
          : (selectedTopic.category as 'Social' | 'Governance');
      }
    }

    const customMetric: ESGMetricWithTracking = {
      id: `custom_${Date.now()}`,
      name: customMetricForm.name,
      description: customMetricForm.description || 'Custom metric',
      unit: customMetricForm.unit || 'N/A',
      source: 'Custom',
      framework: 'Custom',
      relatedTopic: selectedTopicId || 'all',
      category,
      dataType: customMetricForm.dataType,
      inputFormat: customMetricForm.inputFormat,
      collectionFrequency: customMetricForm.collectionFrequency,
      dataPoints: [],
      isSelected: true
    };

    // Add to custom metrics list and save to localStorage
    const updatedCustomMetrics = [...customMetrics, customMetric];
    setCustomMetrics(updatedCustomMetrics);
    localStorage.setItem('customESGMetrics', JSON.stringify(updatedCustomMetrics));

    // Add to selected metrics
    setSelectedMetrics([...selectedMetrics, customMetric]);
    setIsAddDialogOpen(false);
    resetCustomMetricForm();
    toast.success('Custom metric added and available for all topics');
  };

  const handleSaveConfiguration = () => {
    if (selectedMetrics.length === 0) {
      toast.error('Please select at least one metric to save');
      return;
    }

    // Add selected metrics to saved metrics, avoiding duplicates
    const newMetrics = selectedMetrics.filter(
      selectedMetric => !savedMetrics.find(saved => saved.id === selectedMetric.id)
    );

    setSavedMetrics(prev => [...prev, ...newMetrics]);
    toast.success(`${selectedMetrics.length} metrics saved for data entry`);
    setSelectedMetrics([]);
  };

  const resetCustomMetricForm = () => {
    setCustomMetricForm({
      name: '',
      description: '',
      unit: '',
      dataType: 'Numeric',
      collectionFrequency: 'Monthly',
      inputFormat: {
        options: [],
        tableColumns: [],
        tableRows: 1,
      },
    });
  };

  const selectedTopic = materialTopics.find(topic => topic.id === selectedTopicId);

  return (
    <div className="space-y-6">
      <ExcelUpload 
        onMetricsImported={(metrics) => {
          setSavedMetrics(prev => [...prev, ...metrics]);
          toast.success(`${metrics.length} metrics imported and saved`);
        }}
        onDataImported={() => {}} // Data import handled in MetricsDataEntry
        materialTopics={materialTopics}
      />
      
      <TopicSelector
        materialTopics={materialTopics}
        selectedTopicId={selectedTopicId}
        onSelectTopic={handleSelectTopic}
      />

      {/* Always show metrics section - either topic-specific or all custom metrics */}
      <div className="space-y-6">
        {!selectedTopicId && (
          <Card>
            <CardHeader>
              <CardTitle>Custom Metrics Management</CardTitle>
              <CardDescription>
                Add and manage custom ESG metrics that can be used across all material topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {customMetrics.length} custom metrics available
                </p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Metric
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <MetricsSelector
          selectedTopic={selectedTopic}
          availableMetrics={availableMetrics}
          selectedMetrics={selectedMetrics}
          onAddMetric={handleAddMetric}
          onOpenCustomDialog={() => setIsAddDialogOpen(true)}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
        >
          <CustomMetricDialog
            isEdit={false}
            selectedTopic={selectedTopic}
            customMetricForm={customMetricForm}
            setCustomMetricForm={setCustomMetricForm}
            onSave={handleAddCustomMetric}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </MetricsSelector>

        <SelectedMetricsList
          selectedMetrics={selectedMetrics}
          selectedTopic={selectedTopic}
          onEditMetric={handleEditMetric}
          onRemoveMetric={handleRemoveMetric}
          onSaveConfiguration={handleSaveConfiguration}
          savedMetrics={savedMetrics}
          onEditSavedMetric={handleEditSavedMetric}
          onDeleteSavedMetric={handleDeleteSavedMetric}
        />
      </div>

      {/* Edit Metric Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <CustomMetricDialog
          isEdit={true}
          selectedTopic={selectedTopic}
          customMetricForm={customMetricForm}
          setCustomMetricForm={setCustomMetricForm}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default ESGMetricsManager;
