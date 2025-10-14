import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Stakeholder, StakeholderGroup, initialStakeholders, initialStakeholderGroups } from '../../data/stakeholderPrioritization';
import { MaterialTopic, griTopics, sasbTopics } from '../../data/frameworkTopics';
import StakeholderPrioritizationForm from './StakeholderPrioritizationForm';
import StakeholderGroupForm from './StakeholderGroupForm';
import { sampleStakeholders } from '../../data/stakeholders';
import { Stakeholder as ManageStakeholder } from '../stakeholders/types';
import { httpClient } from '@/lib/httpClient';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import { logger } from '@/hooks/logger';

interface StakeholderEngagementProps {
  selectedIndustries: string[];
  materialTopics: MaterialTopic[];
  onUpdatePrioritization: (updatedTopics: MaterialTopic[]) => void;
}

interface StakeholderInvitation {
  id: string;
  stakeholderId: string;
  groupId: string;
  email: string;
  status: 'pending' | 'sent' | 'completed';
  inviteCode?: string;
  tempPassword?: string;
  sentAt?: Date;
}

const StakeholderEngagement: React.FC<StakeholderEngagementProps> = ({
  selectedIndustries,
  materialTopics,
  onUpdatePrioritization
}) => {
  const [activeTab, setActiveTab] = useState('groups');
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [stakeholderGroups, setStakeholderGroups] = useState<StakeholderGroup[]>(initialStakeholderGroups);
  const [selectedGroup, setSelectedGroup] = useState<StakeholderGroup | null>(null);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [showPrioritizationForm, setShowPrioritizationForm] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [availableStakeholders, setAvailableStakeholders] = useState<ManageStakeholder[]>([]);
  const [selectedStakeholdersForInvite, setSelectedStakeholdersForInvite] = useState<string[]>([]);
  const [invitations, setInvitations] = useState<StakeholderInvitation[]>([]);

  // Load stakeholders from the Manage Stakeholders section
  useEffect(() => {
    setAvailableStakeholders(sampleStakeholders as ManageStakeholder[]);
    handleFetchStakeholders();
  }, []);



  const handleFetchStakeholders = async () => {
    try {
      let stakeHolderList=await httpClient.get(API_ENDPOINTS.STAKEHOLDERS.LIST)
      
      if(stakeHolderList.status == 200){
        if (stakeHolderList?.data && Array.isArray(stakeHolderList.data)) {
          let data: Stakeholder[] = stakeHolderList.data;
          data=data.map((d)=> {return {...d,type:d['subcategoryId'].split("|")[1]}})
          logger.log('handleFetchStakeholders :: data',data)
          setStakeholders(data);
        }
      }
    } catch (error) {
      // Error already handled by interceptors, using local data
      logger.log('Fallback to local data');
    }
  };

  // Generate temporary credentials for unregistered stakeholders
  const generateTempCredentials = () => {
    const tempId = `stakeholder_${Math.random().toString(36).substr(2, 8)}`;
    const tempPassword = Math.random().toString(36).substr(2, 10);
    return { tempId, tempPassword };
  };

  // Handle stakeholder invitation
  const handleInviteStakeholders = () => {
    if (!selectedGroup || selectedStakeholdersForInvite.length === 0) {
      toast.error('Please select stakeholders to invite');
      return;
    }

    const newInvitations: StakeholderInvitation[] = selectedStakeholdersForInvite.map(stakeholderId => {
      const stakeholder = availableStakeholders.find(s => s.id === stakeholderId);
      const { tempId, tempPassword } = generateTempCredentials();
      
      return {
        id: `invite_${Date.now()}_${stakeholderId}`,
        stakeholderId,
        groupId: selectedGroup._id,
        email: stakeholder?.email || '',
        status: 'pending' as const,
        inviteCode: tempId,
        tempPassword,
        sentAt: new Date()
      };
    });

    // Simulate sending emails
    newInvitations.forEach(invitation => {
      const stakeholder = availableStakeholders.find(s => s.id === invitation.stakeholderId);
      logger.log(`
        Sending email to: ${invitation.email}
        Subject: Invitation to Participate in Materiality Assessment
        
        Dear ${stakeholder?.name},
        
        You have been invited to participate in our materiality assessment for "${selectedGroup.name}".
        
        Login credentials:
        Username: ${invitation.inviteCode}
        Password: ${invitation.tempPassword}
        
        Please login to provide your input on the impact of various ESG topics.
        
        Best regards,
        ESG Team
      `);
    });

    setInvitations([...invitations, ...newInvitations]);
    setSelectedStakeholdersForInvite([]);
    setShowInviteDialog(false);
    
    toast.success(`Invitations sent to ${newInvitations.length} stakeholders`);
  };

  // Handle creating a new stakeholder group
  const handleCreateGroup = async (newGroup: StakeholderGroup) => {
    logger.log('newGroup',newGroup)
    let topicStructure=[]
    newGroup.topics.forEach((t)=>topicStructure.push({
      metric: null,
      topic: t,
      category: null
    }))
    newGroup.topics=topicStructure
    // delete newGroup._id
    delete newGroup['id']
    let groupCreateResponse=await httpClient.post('stakeholder-engagement-group',newGroup);
    logger.log('groupCreateResponse',groupCreateResponse)
    setStakeholderGroups([...stakeholderGroups, newGroup]);
    // setShowAddGroupForm(false);
  };
  
  // Handle saving a stakeholder's prioritization
  const handleSavePrioritization = (stakeholderId: string, topicPrioritizations: any[]) => {
    const updatedStakeholders = stakeholders.map(stakeholder => {
      if (stakeholder._id === stakeholderId) {
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
    
    if (selectedGroup) {
      const allTopics = [...sasbTopics, ...griTopics, ...materialTopics];
      const updatedTopics = allTopics.filter(topic => 
        selectedGroup.topics.includes(topic.id)
      ).map(topic => {
        let businessTotal = 0;
        let sustainabilityTotal = 0;
        let count = 0;
        
        updatedStakeholders
          .filter(s => selectedGroup.stakeholders.includes(s._id))
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
      const stakeholder = stakeholders.find(s => s._id === stakeholderId);
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

  useEffect(()=>{
    logger.log('stakeholders',stakeholders)
  },[stakeholders])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stakeholder Engagement</CardTitle>
        <CardDescription>Create stakeholder groups and invite them to participate in materiality assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="groups">Stakeholder Groups</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
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
                      <TableRow key={group._id}>
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell>
                          <Badge variant={
                            group.status === 'completed' ? 'default' :
                            group.status === 'active' ? 'secondary' : 'outline'
                          }>
                            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{group.stakeholders.length} stakeholders</TableCell>
                        <TableCell>{group.topics.length} topics</TableCell>
                        <TableCell>{calculateGroupCompletion(group)}%</TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedGroup(group)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedGroup(group);
                              setShowInviteDialog(true);
                            }}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Invite
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {selectedGroup && !showInviteDialog && (
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
                              const stakeholder = stakeholders.find(s => s._id === stakeholderId);
                              if (!stakeholder) return null;
                              
                              const completedTopics = stakeholder.prioritizations.filter(
                                p => selectedGroup.topics.includes(p.topicId)
                              ).length;
                              
                              return (
                                <div key={stakeholder._id} className="border rounded-md p-3">
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">{stakeholder.name}</span>
                                    <Badge variant={stakeholder.type === 'internal' ? 'secondary' : 'outline'}>
                                      {stakeholder.type.charAt(0).toUpperCase() + stakeholder.type.slice(1)}
                                    </Badge>
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
                              const allTopics = [...sasbTopics, ...griTopics, ...materialTopics];
                              const topic = allTopics.find(t => t.id === topicId);
                              if (!topic) return null;
                              
                              return (
                                <div key={topic.id} className="border rounded-md p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ 
                                        backgroundColor: topic['category'] === 'Environment' 
                                          ? '#22c55e' 
                                          : topic['category'] === 'Social' 
                                            ? '#60a5fa' 
                                            : '#f59e0b'
                                      }}
                                    />
                                    <span className="font-medium">{topic['name']}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">{topic.description}</div>
                                  <div className="mt-1 text-xs">
                                    <Badge variant="outline">
                                      {topic.framework}
                                    </Badge>
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
          
          <TabsContent value="invitations" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Invitation History</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stakeholder</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Login Credentials</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map(invitation => {
                    const stakeholder = availableStakeholders.find(s => s.id === invitation.stakeholderId);
                    const group = stakeholderGroups.find(g => g._id === invitation.groupId);
                    
                    return (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">{stakeholder?.name}</TableCell>
                        <TableCell>{invitation.email}</TableCell>
                        <TableCell>{group?.name}</TableCell>
                        <TableCell>
                          <Badge variant={
                            invitation.status === 'completed' ? 'default' :
                            invitation.status === 'sent' ? 'secondary' : 'outline'
                          }>
                            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{invitation.sentAt?.toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs">
                          <div>ID: {invitation.inviteCode}</div>
                          <div>Pass: {invitation.tempPassword}</div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Invitation Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Invite Stakeholders</DialogTitle>
              <DialogDescription>
                Select stakeholders to invite for materiality assessment: {selectedGroup?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto">
                {availableStakeholders.map(stakeholder => (
                  <div key={stakeholder.id} className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      id={stakeholder.id}
                      checked={selectedStakeholdersForInvite.includes(stakeholder.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStakeholdersForInvite([...selectedStakeholdersForInvite, stakeholder.id]);
                        } else {
                          setSelectedStakeholdersForInvite(selectedStakeholdersForInvite.filter(id => id !== stakeholder.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{stakeholder.name}</div>
                      <div className="text-sm text-muted-foreground">{stakeholder.email}</div>
                      <div className="text-xs text-muted-foreground">{stakeholder.organization}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteStakeholders}>
                <Send className="h-4 w-4 mr-2" />
                Send Invitations
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {showPrioritizationForm && selectedStakeholder && selectedGroup && (
          <StakeholderPrioritizationForm
            stakeholder={selectedStakeholder}
            topics={materialTopics.filter(topic => selectedGroup.topics.includes(topic.id))}
            onSave={(prioritizations) => handleSavePrioritization(selectedStakeholder._id, prioritizations)}
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
