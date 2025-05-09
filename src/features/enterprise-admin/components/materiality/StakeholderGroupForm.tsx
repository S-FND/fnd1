
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Stakeholder, StakeholderGroup } from '../../data/stakeholderPrioritization';
import { MaterialTopic } from '../../data/frameworkTopics';

interface StakeholderGroupFormProps {
  stakeholders: Stakeholder[];
  materialTopics: MaterialTopic[];
  onSave: (group: StakeholderGroup) => void;
  onCancel: () => void;
  existingGroup?: StakeholderGroup;
}

const StakeholderGroupForm: React.FC<StakeholderGroupFormProps> = ({
  stakeholders,
  materialTopics,
  onSave,
  onCancel,
  existingGroup
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    selectedStakeholders: string[];
    selectedTopics: string[];
  }>({
    name: existingGroup?.name || '',
    description: existingGroup?.description || '',
    selectedStakeholders: existingGroup?.stakeholders || [],
    selectedTopics: existingGroup?.topics || []
  });
  
  const [activeTab, setActiveTab] = useState('stakeholders');
  
  const handleSave = () => {
    const newGroup: StakeholderGroup = {
      id: existingGroup?.id || `group-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      stakeholders: formData.selectedStakeholders,
      topics: formData.selectedTopics,
      status: 'draft',
      dateCreated: existingGroup?.dateCreated || new Date().toISOString(),
      dateUpdated: new Date().toISOString()
    };
    
    onSave(newGroup);
  };
  
  const toggleStakeholder = (stakeholderId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStakeholders: prev.selectedStakeholders.includes(stakeholderId)
        ? prev.selectedStakeholders.filter(id => id !== stakeholderId)
        : [...prev.selectedStakeholders, stakeholderId]
    }));
  };
  
  const toggleTopic = (topicId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topicId)
        ? prev.selectedTopics.filter(id => id !== topicId)
        : [...prev.selectedTopics, topicId]
    }));
  };
  
  // Group topics by category
  const topicsByCategory = materialTopics.reduce<Record<string, MaterialTopic[]>>(
    (acc, topic) => {
      if (!acc[topic.category]) {
        acc[topic.category] = [];
      }
      acc[topic.category].push(topic);
      return acc;
    },
    {}
  );
  
  // Group stakeholders by type
  const stakeholdersByType = stakeholders.reduce<Record<string, Stakeholder[]>>(
    (acc, stakeholder) => {
      if (!acc[stakeholder.type]) {
        acc[stakeholder.type] = [];
      }
      acc[stakeholder.type].push(stakeholder);
      return acc;
    },
    {}
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingGroup ? 'Edit Group' : 'Create New Stakeholder Group'}</CardTitle>
        <CardDescription>
          Select stakeholders and topics for this assessment group
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Group Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter a name for this stakeholder group"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the purpose of this stakeholder group"
          />
        </div>
        
        <div className="border rounded-md p-4">
          <div className="flex mb-4 border-b">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'stakeholders' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('stakeholders')}
            >
              Select Stakeholders
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'topics' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('topics')}
            >
              Select Topics
            </button>
          </div>
          
          {activeTab === 'stakeholders' && (
            <div>
              <div className="text-sm font-medium mb-2">
                Selected: {formData.selectedStakeholders.length} stakeholders
              </div>
              
              {Object.entries(stakeholdersByType).map(([type, typeStakeholders]) => (
                <div key={type} className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 capitalize">{type}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {typeStakeholders.map(stakeholder => (
                      <div 
                        key={stakeholder.id} 
                        className={`flex items-center p-2 border rounded-md ${
                          formData.selectedStakeholders.includes(stakeholder.id) 
                            ? 'bg-primary/10 border-primary/30' 
                            : ''
                        }`}
                      >
                        <Checkbox
                          id={`stakeholder-${stakeholder.id}`}
                          checked={formData.selectedStakeholders.includes(stakeholder.id)}
                          onCheckedChange={() => toggleStakeholder(stakeholder.id)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`stakeholder-${stakeholder.id}`}
                          className="text-sm cursor-pointer flex flex-col"
                        >
                          <span className="font-medium">{stakeholder.name}</span>
                          <span className="text-xs text-muted-foreground">{stakeholder.role}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'topics' && (
            <div>
              <div className="text-sm font-medium mb-2">
                Selected: {formData.selectedTopics.length} topics
              </div>
              
              {Object.entries(topicsByCategory).map(([category, categoryTopics]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {categoryTopics.map(topic => (
                      <div 
                        key={topic.id} 
                        className={`flex items-center p-2 border rounded-md ${
                          formData.selectedTopics.includes(topic.id) 
                            ? 'bg-primary/10 border-primary/30' 
                            : ''
                        }`}
                      >
                        <Checkbox
                          id={`topic-${topic.id}`}
                          checked={formData.selectedTopics.includes(topic.id)}
                          onCheckedChange={() => toggleTopic(topic.id)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`topic-${topic.id}`}
                          className="text-sm cursor-pointer flex flex-col"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{topic.name}</span>
                            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                              {topic.framework}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{topic.description}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleSave}
          disabled={
            !formData.name || 
            formData.selectedStakeholders.length === 0 || 
            formData.selectedTopics.length === 0
          }
        >
          {existingGroup ? 'Update Group' : 'Create Group'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StakeholderGroupForm;
