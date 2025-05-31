
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import EditTopicDialog from './EditTopicDialog';
import CreateTopicDialog from './CreateTopicDialog';
import TopicsFilters from './TopicsFilters';
import TopicClassificationTabs from './TopicClassificationTabs';
import TopicsByCategory from './TopicsByCategory';

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
}

interface MaterialTopicsTabProps {
  materialTopics: MaterialTopic[];
  activeFrameworks: Framework[];
  setActiveFrameworks: (frameworks: Framework[]) => void;
  onUpdateTopics?: (topics: MaterialTopic[]) => void;
}

const MaterialTopicsTab: React.FC<MaterialTopicsTabProps> = ({ 
  materialTopics,
  activeFrameworks = ['SASB', 'GRI', 'Custom'],
  setActiveFrameworks,
  onUpdateTopics
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationView, setClassificationView] = useState<'all' | 'risks' | 'opportunities'>('all');
  const [editingTopic, setEditingTopic] = useState<MaterialTopic | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter topics by search term and active frameworks
  const filteredTopics = materialTopics.filter(topic => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by framework
    const matchesFramework = !topic.framework || 
      activeFrameworks.includes(topic.framework as Framework);
    
    // Filter by classification (risk or opportunity)
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

  const handleEditTopic = (topic: MaterialTopic) => {
    setEditingTopic(topic);
    setIsEditDialogOpen(true);
  };

  const handleSaveTopic = (updatedTopic: MaterialTopic) => {
    if (onUpdateTopics) {
      const updatedTopics = materialTopics.map(topic => 
        topic.id === updatedTopic.id ? updatedTopic : topic
      );
      onUpdateTopics(updatedTopics);
      toast.success('Topic updated successfully');
    }
  };

  const handleCreateTopic = (newTopic: MaterialTopic) => {
    if (onUpdateTopics) {
      const updatedTopics = [...materialTopics, newTopic];
      onUpdateTopics(updatedTopics);
      toast.success('Custom topic created successfully');
    }
  };

  const handleDeleteTopic = (topicId: string) => {
    if (onUpdateTopics) {
      const updatedTopics = materialTopics.filter(topic => topic.id !== topicId);
      onUpdateTopics(updatedTopics);
      toast.success('Topic deleted successfully');
    }
  };

  const canEditOrDelete = (topic: MaterialTopic): boolean => {
    return topic.framework === 'Custom' || topic.framework === undefined;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Material Topics Assessment</CardTitle>
            <CardDescription>Detailed assessment of key material ESG topics</CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Custom Topic
          </Button>
        </div>
        
        <TopicsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFrameworks={activeFrameworks}
          onFrameworkChange={setActiveFrameworks}
        />
      </CardHeader>
      <CardContent>
        <TopicClassificationTabs onValueChange={setClassificationView}>
          <TopicsByCategory
            topicsByCategory={topicsByCategory}
            onEditTopic={handleEditTopic}
            onDeleteTopic={handleDeleteTopic}
            canEditOrDelete={canEditOrDelete}
            showActions={!!onUpdateTopics}
          />
        </TopicClassificationTabs>

        {filteredTopics.length === 0 && (
          <div className="py-12 text-center">
            <h4 className="text-lg font-medium">No topics found</h4>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or framework filters
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
