
import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { getMetricsByTopic, getDefaultMetricTracking, ESGMetricWithTracking } from '../../data/esgMetricsData';
import { toast } from 'sonner';
import TopicSelector from './TopicSelector';
import MetricsSelector from './MetricsSelector';
import SelectedMetricsList from './SelectedMetricsList';
import CustomMetricDialog from './CustomMetricDialog';

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
      <TopicSelector
        materialTopics={materialTopics}
        selectedTopicId={selectedTopicId}
        onSelectTopic={handleSelectTopic}
      />

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
      />

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
