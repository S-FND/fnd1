
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Stakeholder, StakeholderGroup, initialStakeholders, initialStakeholderGroups } from '../../data/stakeholderPrioritization';
import { MaterialTopic, griTopics, sasbTopics } from '../../data/frameworkTopics';
import StakeholderPrioritizationForm from './StakeholderPrioritizationForm';
import StakeholderGroupForm from './StakeholderGroupForm';

interface StakeholderEngagementProps {
  selectedIndustries: string[];
  materialTopics: MaterialTopic[];
  onUpdatePrioritization: (updatedTopics: MaterialTopic[]) => void;
}

const StakeholderEngagement: React.FC<StakeholderEngagementProps> = ({
  selectedIndustries,
  materialTopics,
  onUpdatePrioritization
}) => {
  const [activeTab, setActiveTab] = useState('groups');
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(initialStakeholders);
  const [stakeholderGroups, setStakeholderGroups] = useState<StakeholderGroup[]>(initialStakeholderGroups);
  const [selectedGroup, setSelectedGroup] = useState<StakeholderGroup | null>(null);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [showPrioritizationForm, setShowPrioritizationForm] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  
  // Handle creating a new stakeholder group
  const handleCreateGroup = (newGroup: StakeholderGroup) => {
    setStakeholderGroups([...stakeholderGroups, newGroup]);
    setShowAddGroupForm(false);
  };
  
  // Handle saving a stakeholder's prioritization
  const handleSavePrioritization = (stakeholderId: string, topicPrioritizations: any[]) => {
    const updatedStakeholders = stakeholders.map(stakeholder => {
      if (stakeholder.id === stakeholderId) {
        return {
          ...stakeholder,
          prioritizations: topicPrioritizations.map(p => ({
            topicId: p.topicId,
            businessImpact: p.businessImpact,
            sustainabilityImpact: p.sustainabilityImpact,
            comments: p.comments || '',
            dateSubmitted: new Date().toISOString()
          }))
        };
      }
      return stakeholder;
    });
    
    setStakeholders(updatedStakeholders);
    setShowPrioritizationForm(false);
    setSelectedStakeholder(null);
    
    // Update the materiality matrix
    if (selectedGroup) {
      const allTopics = [...sasbTopics, ...griTopics, ...materialTopics];
      const updatedTopics = allTopics.filter(topic => 
        selectedGroup.topics.includes(topic.id)
      ).map(topic => {
        // Find all stakeholder prioritizations for this topic
        let businessTotal = 0;
        let sustainabilityTotal = 0;
        let count = 0;
        
        updatedStakeholders
          .filter(s => selectedGroup.stakeholders.includes(s.id))
          .forEach(s => {
            const prioritization = s.prioritizations.find(p => p.topicId === topic.id);
            if (prioritization) {
              businessTotal += prioritization.businessImpact;
              sustainabilityTotal += prioritization.sustainabilityImpact;
              count++;
            }
          });
        
        return {
          ...topic,
          businessImpact: count > 0 ? businessTotal / count : topic.businessImpact || 5,
          sustainabilityImpact: count > 0 ? sustainabilityTotal / count : topic.sustainabilityImpact || 5
        };
      });
      
      onUpdatePrioritization(updatedTopics);
    }
  };
  
  // Calculate completion percentage for a group
  const calculateGroupCompletion = (group: StakeholderGroup): number => {
    const totalPossiblePrioritizations = group.stakeholders.length * group.topics.length;
    
    if (totalPossiblePrioritizations === 0) return 0;
    
    let completedPrioritizations = 0;
    
    group.stakeholders.forEach(stakeholderId => {
      const stakeholder = stakeholders.find(s => s.id === stakeholderId);
      if (stakeholder) {
        stakeholder.prioritizations.forEach(p => {
          if (group.topics.includes(p.topicId)) {
            completedPrioritizations++;
          }
        });
      }
    });
    
    return Math.round((completedPrioritizations / totalPossiblePrioritizations) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stakeholder Engagement</CardTitle>
        <CardDescription>Create stakeholder groups and capture their prioritizations of material topics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="groups">Stakeholder Groups</TabsTrigger>
            <TabsTrigger value="stakeholders">Manage Stakeholders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="groups" className="space-y-4">
            {showAddGroupForm ? (
              <StakeholderGroupForm 
                stakeholders={stakeholders}
                materialTopics={materialTopics}
                onSave={handleCreateGroup}
                onCancel={() => setShowAddGroupForm(false)}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Stakeholder Groups</h3>
                  <Button onClick={() => setShowAddGroupForm(true)}>
                    Create New Group
                  </Button>
                </div>
                
                <Table>
                  <TableCaption>Active stakeholder groups for materiality assessment</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stakeholders</TableHead>
                      <TableHead>Topics</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stakeholderGroups.map(group => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            group.status === 'completed' ? 'bg-green-100 text-green-800' :
                            group.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{group.stakeholders.length} stakeholders</TableCell>
                        <TableCell>{group.topics.length} topics</TableCell>
                        <TableCell>{calculateGroupCompletion(group)}%</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedGroup(group)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {selectedGroup && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{selectedGroup.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedGroup(null)}
                        >
                          Close
                        </Button>
                      </div>
                      <CardDescription>{selectedGroup.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Stakeholders in this group</h4>
                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {selectedGroup.stakeholders.map(stakeholderId => {
                              const stakeholder = stakeholders.find(s => s.id === stakeholderId);
                              if (!stakeholder) return null;
                              
                              const completedTopics = stakeholder.prioritizations.filter(
                                p => selectedGroup.topics.includes(p.topicId)
                              ).length;
                              
                              return (
                                <div key={stakeholder.id} className="border rounded-md p-3">
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">{stakeholder.name}</span>
                                    <span className={`text-xs ${
                                      stakeholder.type === 'internal' ? 'text-blue-600' : 'text-green-600'
                                    }`}>
                                      {stakeholder.type.charAt(0).toUpperCase() + stakeholder.type.slice(1)}
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">{stakeholder.role}</div>
                                  <div className="mt-2 flex justify-between">
                                    <span className="text-xs text-muted-foreground">
                                      {completedTopics} of {selectedGroup.topics.length} topics completed
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedStakeholder(stakeholder);
                                        setShowPrioritizationForm(true);
                                      }}
                                    >
                                      {completedTopics > 0 ? "Edit" : "Prioritize"}
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Topics in this group</h4>
                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {selectedGroup.topics.map(topicId => {
                              // Find topic in all available topics
                              const allTopics = [...sasbTopics, ...griTopics, ...materialTopics];
                              const topic = allTopics.find(t => t.id === topicId);
                              if (!topic) return null;
                              
                              return (
                                <div key={topic.id} className="border rounded-md p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ 
                                        backgroundColor: topic.category === 'Environment' 
                                          ? '#22c55e' 
                                          : topic.category === 'Social' 
                                            ? '#60a5fa' 
                                            : '#f59e0b'
                                      }}
                                    />
                                    <span className="font-medium">{topic.name}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">{topic.description}</div>
                                  <div className="mt-1 text-xs">
                                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
                                      {topic.framework}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stakeholders">
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Manage Stakeholders</h3>
                <Button>Add Stakeholder</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakeholders.map(stakeholder => (
                    <TableRow key={stakeholder.id}>
                      <TableCell className="font-medium">{stakeholder.name}</TableCell>
                      <TableCell>{stakeholder.organization}</TableCell>
                      <TableCell>{stakeholder.role}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          stakeholder.type === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {stakeholder.type}
                        </span>
                      </TableCell>
                      <TableCell>{stakeholder.category}</TableCell>
                      <TableCell>{stakeholder.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        {showPrioritizationForm && selectedStakeholder && selectedGroup && (
          <StakeholderPrioritizationForm
            stakeholder={selectedStakeholder}
            topics={materialTopics.filter(topic => selectedGroup.topics.includes(topic.id))}
            onSave={(prioritizations) => handleSavePrioritization(selectedStakeholder.id, prioritizations)}
            onCancel={() => {
              setShowPrioritizationForm(false);
              setSelectedStakeholder(null);
            }}
            existingPrioritizations={selectedStakeholder.prioritizations}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StakeholderEngagement;
