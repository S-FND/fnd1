
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import EditTopicDialog from './EditTopicDialog';
import CreateTopicDialog from './CreateTopicDialog';
import TopicsFilters from './TopicsFilters';
import TopicClassificationTabs from './TopicClassificationTabs';
import { getCombinedTopics, MaterialTopic as FrameworkMaterialTopic } from '../../data/frameworkTopics';
import { industries } from '../../data/materiality';

// Define allowed framework types
type Framework = 'SASB' | 'GRI' | 'Custom';

interface MaterialTopic {
  id: string;
  name: string;
  category: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
  isRisk?: boolean;
  selected?: boolean;
}

interface MaterialTopicsTabProps {
  materialTopics: MaterialTopic[];
  activeFrameworks: Framework[];
  setActiveFrameworks: (frameworks: Framework[]) => void;
  selectedIndustries: string[];
  onUpdateTopics?: (topics: MaterialTopic[]) => void;
  onUpdateSelectedTopics?: (selectedTopics: MaterialTopic[]) => void;
}

const MaterialTopicsTab: React.FC<MaterialTopicsTabProps> = ({ 
  materialTopics,
  activeFrameworks = ['SASB', 'GRI', 'Custom'],
  setActiveFrameworks,
  selectedIndustries = [],
  onUpdateTopics,
  onUpdateSelectedTopics
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationView, setClassificationView] = useState<'all' | 'risks' | 'opportunities'>('all');
  const [editingTopic, setEditingTopic] = useState<MaterialTopic | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [topicsWithSelection, setTopicsWithSelection] = useState<MaterialTopic[]>([]);

  // Get all available topics based on selected industries and frameworks
  React.useEffect(() => {
    if (selectedIndustries.length > 0) {
      const availableTopics = getCombinedTopics(selectedIndustries, activeFrameworks).map(topic => ({
        ...topic,
        businessImpact: topic.businessImpact ?? 5,
        sustainabilityImpact: topic.sustainabilityImpact ?? 5,
        color: topic.color ?? getCategoryColor(topic.category),
        selected: materialTopics.some(mt => mt.id === topic.id)
      }));
      
      // Add any custom topics that might not be in the framework topics
      const customTopics = materialTopics.filter(mt => 
        mt.framework === 'Custom' && !availableTopics.some(at => at.id === mt.id)
      ).map(ct => ({ ...ct, selected: true }));
      
      setTopicsWithSelection([...availableTopics, ...customTopics]);
    } else {
      // If no industries selected, show current material topics
      setTopicsWithSelection(materialTopics.map(topic => ({ ...topic, selected: true })));
    }
  }, [selectedIndustries, activeFrameworks, materialTopics]);

  // Helper function to get color for a category
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Environment': '#22c55e',
      'Social': '#60a5fa',
      'Governance': '#f59e0b'
    };
    return colors[category] || '#94a3b8';
  };

  // Filter topics by search term and active frameworks
  const filteredTopics = topicsWithSelection.filter(topic => {
    const matchesSearch = !searchTerm || 
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFramework = !topic.framework || 
      activeFrameworks.includes(topic.framework as Framework);
    
    const matchesClassification = 
      classificationView === 'all' ||
      (classificationView === 'risks' && (topic.isRisk || topic.businessImpact < 5)) ||
      (classificationView === 'opportunities' && (!topic.isRisk || topic.businessImpact >= 5));
    
    return matchesSearch && matchesFramework && matchesClassification;
  });

  // Organize topics by category
  const topicsByCategory: Record<string, MaterialTopic[]> = {};
  ['Environment', 'Social', 'Governance'].forEach(category => {
    topicsByCategory[category] = filteredTopics.filter(topic => topic.category === category);
  });

  const handleTopicSelection = (topicId: string, selected: boolean) => {
    const updatedTopics = topicsWithSelection.map(topic =>
      topic.id === topicId ? { ...topic, selected } : topic
    );
    setTopicsWithSelection(updatedTopics);
  };

  const handleSaveSelectedTopics = () => {
    const selectedTopics = topicsWithSelection.filter(topic => topic.selected);
    if (onUpdateSelectedTopics) {
      onUpdateSelectedTopics(selectedTopics);
    }
    if (onUpdateTopics) {
      onUpdateTopics(selectedTopics);
    }
    toast.success(`${selectedTopics.length} topics selected for stakeholder engagement`);
  };

  const handleEditTopic = (topic: MaterialTopic) => {
    setEditingTopic(topic);
    setIsEditDialogOpen(true);
  };

  const handleSaveTopic = (updatedTopic: MaterialTopic) => {
    const updatedTopics = topicsWithSelection.map(topic => 
      topic.id === updatedTopic.id ? updatedTopic : topic
    );
    setTopicsWithSelection(updatedTopics);
    
    if (onUpdateTopics) {
      const selectedTopics = updatedTopics.filter(topic => topic.selected);
      onUpdateTopics(selectedTopics);
    }
    toast.success('Topic updated successfully');
  };

  const handleCreateTopic = (newTopic: MaterialTopic) => {
    const topicWithSelection = { ...newTopic, selected: true };
    const updatedTopics = [...topicsWithSelection, topicWithSelection];
    setTopicsWithSelection(updatedTopics);
    
    if (onUpdateTopics) {
      const selectedTopics = updatedTopics.filter(topic => topic.selected);
      onUpdateTopics(selectedTopics);
    }
    toast.success('Custom topic created successfully');
  };

  const handleDeleteTopic = (topicId: string) => {
    const updatedTopics = topicsWithSelection.filter(topic => topic.id !== topicId);
    setTopicsWithSelection(updatedTopics);
    
    if (onUpdateTopics) {
      const selectedTopics = updatedTopics.filter(topic => topic.selected);
      onUpdateTopics(selectedTopics);
    }
    toast.success('Topic deleted successfully');
  };

  const canEditOrDelete = (topic: MaterialTopic): boolean => {
    return topic.framework === 'Custom' || topic.framework === undefined;
  };

  const selectedCount = topicsWithSelection.filter(topic => topic.selected).length;
  const totalCount = topicsWithSelection.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Material Topics Assessment</CardTitle>
            <CardDescription>
              Select relevant ESG topics for stakeholder engagement and materiality assessment
            </CardDescription>
            
            {selectedIndustries.length > 0 && (
              <div className="mt-3">
                <div className="text-sm font-medium mb-2">Selected Industries:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedIndustries.map(industryId => {
                    const industry = industries.find(i => i.id === industryId);
                    return (
                      <Badge key={industryId} variant="secondary">
                        {industry?.name || industryId}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Custom Topic
            </Button>
            <Button onClick={handleSaveSelectedTopics} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Selected ({selectedCount})
            </Button>
          </div>
        </div>
        
        <TopicsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFrameworks={activeFrameworks}
          onFrameworkChange={setActiveFrameworks}
        />
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">
            {selectedCount} of {totalCount} topics selected for stakeholder engagement
          </div>
        </div>

        <TopicClassificationTabs onValueChange={setClassificationView}>
          <div className="space-y-6">
            {['Environment', 'Social', 'Governance'].map(category => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ 
                      backgroundColor: category === 'Environment' ? '#22c55e' : 
                                     category === 'Social' ? '#60a5fa' : '#f59e0b'
                    }}
                  />
                  {category} Topics ({topicsByCategory[category]?.length || 0})
                </h3>
                
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {topicsByCategory[category]?.map((topic) => (
                    <Card key={topic.id} className="border-l-4" style={{ borderLeftColor: topic.color }}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <Checkbox
                            id={`topic-${topic.id}`}
                            checked={topic.selected || false}
                            onCheckedChange={(checked) => handleTopicSelection(topic.id, checked === true)}
                          />
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {topic.framework || 'Custom'}
                            </Badge>
                            {canEditOrDelete(topic) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTopic(topic)}
                                className="h-6 px-2 text-xs"
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <label
                          htmlFor={`topic-${topic.id}`}
                          className="cursor-pointer block"
                        >
                          <h4 className="font-medium text-sm mb-1">{topic.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {topic.description}
                          </p>
                        </label>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">Business Impact</div>
                            <div className="font-medium">{topic.businessImpact.toFixed(2)} / 10</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Sustainability Impact</div>
                            <div className="font-medium">{topic.sustainabilityImpact.toFixed(2)} / 10</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TopicClassificationTabs>

        {filteredTopics.length === 0 && (
          <div className="py-12 text-center">
            <h4 className="text-lg font-medium">No topics found</h4>
            <p className="text-muted-foreground mt-1">
              {selectedIndustries.length === 0 
                ? "Please select industries to see recommended topics"
                : "Try adjusting your search or framework filters"
              }
            </p>
          </div>
        )}

        <EditTopicDialog
          topic={editingTopic}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingTopic(null);
          }}
          onSave={handleSaveTopic}
        />

        <CreateTopicDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreate={handleCreateTopic}
        />
      </CardContent>
    </Card>
  );
};

export default MaterialTopicsTab;
