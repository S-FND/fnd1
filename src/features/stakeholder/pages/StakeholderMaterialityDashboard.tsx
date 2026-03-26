import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { MaterialTopic } from '../../enterprise-admin/data/frameworkTopics';
import { httpClient } from '@/lib/httpClient';

interface StakeholderPrioritization {
  topicId: string;
  businessImpact: number;
  sustainabilityImpact: number;
  comments?: string;
}

interface StakeholderMaterialityDashboardProps {
  stakeholderName: string;
  groupName: string;
  topics: MaterialTopic[];
  onSavePrioritizations: (prioritizations: StakeholderPrioritization[]) => void;
  onSubmitPrioritizations?: (prioritizations: StakeholderPrioritization[]) => void;
  existingPrioritizations?: StakeholderPrioritization[];
  hasSubmitted?: boolean;
  stakeholderId?: string;
  companyId?: string;
}

interface FandoroUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  entityId: string | null;
  entityType: number;
  companyId?: string;
  hasSubmitted?: boolean;
  assessmentSubmittedAt?: string;
  team_member_id?: string;
  isParent?: boolean;
  emailVerified?: boolean;
}

const DEFAULT_IMPACT = 5;
const AUTO_SAVE_DELAY = 1500;

const StakeholderMaterialityDashboard: React.FC<StakeholderMaterialityDashboardProps> = ({
  stakeholderName,
  groupName,
  topics,
  onSavePrioritizations,
  onSubmitPrioritizations,
  existingPrioritizations = [],
  hasSubmitted = false,
  stakeholderId: propStakeholderId,
  companyId: propCompanyId
}) => {
  const [prioritizations, setPrioritizations] = useState<StakeholderPrioritization[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [user, setUser] = useState<FandoroUser | null>(null);

  // Load user from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('fandoro-user');
      console.log('fandoro-user:', userStr);
      if (userStr) {
        const userData: FandoroUser = JSON.parse(userStr);
        setUser(userData);
      } else {
        console.warn('No fandoro-user found in localStorage');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Get effective stakeholderId and companyId
  const effectiveStakeholderId = useMemo(() => {
    return propStakeholderId || user?._id;
  }, [propStakeholderId, user]);

  const effectiveCompanyId = useMemo(() => {
    if (propCompanyId) return propCompanyId;
    if (user?.companyId) return user.companyId;
    if ((user as any)?.companyEntityId) return (user as any).companyEntityId;
    if (user?.entityId) return user.entityId;
    return null;
  }, [propCompanyId, user]);

  // Debug log
  useEffect(() => {
    console.log('=== Debug IDs ===');
    console.log('propStakeholderId:', propStakeholderId);
    console.log('propCompanyId:', propCompanyId);
    console.log('user?._id:', user?._id);
    console.log('effectiveStakeholderId:', effectiveStakeholderId);
    console.log('effectiveCompanyId:', effectiveCompanyId);
  }, [propStakeholderId, propCompanyId, user, effectiveStakeholderId, effectiveCompanyId]);

  const getStorageKey = useCallback(() => {
    const userId = effectiveStakeholderId;
    const compId = effectiveCompanyId;
    return `materiality_${userId}_${compId}_${groupName.replace(/\s/g, '_')}`;
  }, [effectiveStakeholderId, effectiveCompanyId, groupName]);

  // Load data from API - Updated to new endpoint
  const loadFromAPI = useCallback(async () => {
    if (!effectiveStakeholderId || !groupName) {
      console.warn('Missing params');
      return null;
    }
  
    try {
      const url = `stakeholders-materiality/assessment?stakeholderId=${effectiveStakeholderId}&groupName=${encodeURIComponent(groupName)}`;
      console.log('Loading from API:', url);
      const response: any = await httpClient.get(url);
      return response?.data || response;
    } catch (error) {
      console.error('API load error:', error);
      return null;
    }
  }, [effectiveStakeholderId, groupName]);

  // Save to API - Updated to new endpoint
  const saveToAPI = useCallback(async (responses: StakeholderPrioritization[], action: 'save' | 'submit') => {
    if (!effectiveStakeholderId || !groupName) {
      console.warn('No stakeholderId or groupName available for API save');
      return false;
    }

    try {
      const payload = {
        stakeholderId: effectiveStakeholderId,
        stakeholderName: user?.name || stakeholderName,
        stakeholderEmail: user?.email,
        groupName: groupName,
        responses: responses.map(r => ({
          topicId: r.topicId,
          topicName: topics.find(t => t.id === r.topicId)?.name || '',
          businessImpact: r.businessImpact,
          sustainabilityImpact: r.sustainabilityImpact,
          comments: r.comments || '',
          confidence: 0.8,
          lastUpdated: new Date()
        })),
        action: action,
        metadata: {
          assessmentVersion: '1.0',
          completionTime: Date.now(),
          deviceInfo: navigator.userAgent
        }
      };

      console.log('Saving to API:', payload);
      const response: any = await httpClient.post('stakeholders-materiality/assessment', payload);

      if (response.data?.success === true || response.status === 201 || response.status === 200) {
        setLastSaved(new Date());
        return true;
      }
      return false;
    } catch (error) {
      console.error('API save error:', error);
      return false;
    }
  }, [effectiveStakeholderId, stakeholderName, user, groupName, topics]);

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      if (!effectiveStakeholderId) return;
  
      setIsLoading(true);
  
      try {
        const apiData = await loadFromAPI();
  
        if (apiData?.responses && apiData.responses.length > 0) {
          setPrioritizations(apiData.responses);
        } else {
          // Initialize fresh
          setPrioritizations(
            topics.map((t) => ({
              topicId: t.id,
              businessImpact: DEFAULT_IMPACT,
              sustainabilityImpact: DEFAULT_IMPACT,
              comments: ''
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (topics.length > 0) {
      loadData();
    }
  }, [effectiveStakeholderId, topics, loadFromAPI]);

  // Initialize prioritizations
  useEffect(() => {
    if (!isLoading && !hasSubmitted && prioritizations.length === 0 && topics.length > 0) {
      if (existingPrioritizations.length > 0) {
        setPrioritizations(existingPrioritizations);
      } else {
        const initialPrioritizations = topics.map(topic => {
          const existing = existingPrioritizations.find(p => p.topicId === topic.id);
          return existing || {
            topicId: topic.id,
            businessImpact: DEFAULT_IMPACT,
            sustainabilityImpact: DEFAULT_IMPACT,
            comments: ''
          };
        });
        setPrioritizations(initialPrioritizations);
      }
    }
  }, [topics, existingPrioritizations, hasSubmitted, isLoading, prioritizations.length]);

  // Auto-save
  useEffect(() => {
    if (hasSubmitted || prioritizations.length === 0 || isLoading) return;
    
    const hasChanges = prioritizations.some(p => 
      p.businessImpact !== DEFAULT_IMPACT || 
      p.sustainabilityImpact !== DEFAULT_IMPACT || 
      p.comments
    );
    
    if (!hasChanges) return;
    
    const timer = setTimeout(async () => {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify({
        prioritizations,
        timestamp: new Date().toISOString(),
        stakeholderName,
        groupName,
        version: '1.0'
      }));
      
      if (effectiveStakeholderId && groupName) {
        await saveToAPI(prioritizations, 'save');
      }
    }, AUTO_SAVE_DELAY);
    
    return () => clearTimeout(timer);
  }, [prioritizations, saveToAPI, getStorageKey, stakeholderName, groupName, hasSubmitted, effectiveStakeholderId, isLoading]);

  const updatePrioritization = useCallback((topicId: string, field: keyof StakeholderPrioritization, value: any) => {
    setPrioritizations(prev => {
      const updated = prev.map(p => 
        p.topicId === topicId ? { ...p, [field]: value } : p
      );
      return updated;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const hasAnyProgress = prioritizations.some(p => 
        p.businessImpact !== DEFAULT_IMPACT || 
        p.sustainabilityImpact !== DEFAULT_IMPACT || 
        p.comments
      );
      
      if (!hasAnyProgress) {
        toast.info('No changes to save');
        return;
      }
      
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify({
        prioritizations,
        timestamp: new Date().toISOString(),
        stakeholderName,
        groupName,
        version: '1.0'
      }));
      
      if (effectiveStakeholderId && groupName) {
        const result = await saveToAPI(prioritizations, 'save');
        if (result) {
          toast.success('Synced to server');
        }
      }
      
      onSavePrioritizations(prioritizations);
      
      const completedCount = prioritizations.filter(p => 
        p.businessImpact !== DEFAULT_IMPACT || 
        p.sustainabilityImpact !== DEFAULT_IMPACT || 
        p.comments
      ).length;
      
      toast.success('Draft saved successfully!', {
        description: `${completedCount} of ${topics.length} topics completed`,
      });
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  }, [prioritizations, onSavePrioritizations, saveToAPI, getStorageKey, stakeholderName, groupName, isSaving, topics.length, effectiveStakeholderId]);

  const handleSubmit = async () => {
    if (!effectiveStakeholderId || !groupName) {
      toast.error('Missing stakeholder information');
      return;
    }
  
    setIsSubmitting(true);
    const success = await saveToAPI(prioritizations, "submit");
    if (success) {
      toast.success("Assessment submitted successfully!");
      if (onSubmitPrioritizations) {
        onSubmitPrioritizations(prioritizations);
      }
    } else {
      toast.error("Submit failed");
    }
  
    setIsSubmitting(false);
  };

  const currentTopic: any = topics[currentTopicIndex];
  const currentPrioritization = prioritizations.find(p => p.topicId === currentTopic?.id);

  const completedCount = useMemo(() => 
    prioritizations.filter(p => 
      p.businessImpact !== DEFAULT_IMPACT || 
      p.sustainabilityImpact !== DEFAULT_IMPACT || 
      p.comments
    ).length,
    [prioritizations]
  );

  const allCompleted = useMemo(() => completedCount === topics.length, [completedCount, topics.length]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading assessment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentTopic || !currentPrioritization) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">No topics available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assessment Completed</CardTitle>
          <CardDescription>
            Thank you for completing the materiality assessment! Your responses have been submitted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-green-600 font-semibold">
              ✓ Assessment submitted successfully
            </div>
            <p className="text-muted-foreground">
              You can now view the aggregated results from all stakeholders in the Results tab.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Topic {currentTopicIndex + 1} of {topics.length}</CardTitle>
            <Badge variant="outline">
              {completedCount} of {topics.length} completed
            </Badge>
          </div>
          <CardDescription>
            Please rate the impact of this topic on both business performance and sustainability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{currentTopic.name}</h3>
            <p className="text-sm text-muted-foreground">{currentTopic.description}</p>
            <div className="flex gap-2">
              <Badge variant="outline">
                {currentTopic.category}
              </Badge>
              <Badge variant="secondary">{currentTopic.framework}</Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Business Impact: {currentPrioritization.businessImpact}/10
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  How much does this topic impact your organization's financial performance?
                </p>
                <Slider
                  value={[currentPrioritization.businessImpact]}
                  onValueChange={(value) => updatePrioritization(currentTopic.id, 'businessImpact', value[0])}
                  max={10}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Low Impact</span>
                  <span>High Impact</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Sustainability Impact: {currentPrioritization.sustainabilityImpact}/10
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  How much does this topic impact society and the environment?
                </p>
                <Slider
                  value={[currentPrioritization.sustainabilityImpact]}
                  onValueChange={(value) => updatePrioritization(currentTopic.id, 'sustainabilityImpact', value[0])}
                  max={10}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Low Impact</span>
                  <span>High Impact</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Comments (Optional)</label>
            <p className="text-xs text-muted-foreground mb-2">
              Please share any additional thoughts about this topic
            </p>
            <Textarea
              value={currentPrioritization.comments || ''}
              onChange={(e) => updatePrioritization(currentTopic.id, 'comments', e.target.value)}
              placeholder="Share your thoughts on this topic..."
              rows={3}
            />
          </div>

          {lastSaved && (
            <div className="text-xs text-green-600 text-right">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentTopicIndex(Math.max(0, currentTopicIndex - 1))}
              disabled={currentTopicIndex === 0}
            >
              Previous Topic
            </Button>
            
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              
              {currentTopicIndex < topics.length - 1 ? (
                <Button
                  onClick={() => setCurrentTopicIndex(Math.min(topics.length - 1, currentTopicIndex + 1))}
                >
                  Next Topic
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700" disabled={!allCompleted || isSubmitting}>
                      {isSubmitting ? 'Submitting...' : (allCompleted ? 'Submit Assessment' : `Complete ${topics.length - completedCount} More`)}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Submit Assessment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to submit your assessment? Once submitted, you won't be able to make changes to your responses.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>
                        Submit Assessment
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {topics.map((topic, index) => {
              const prioritization = prioritizations.find(p => p.topicId === topic.id);
              const isCompleted = prioritization && (
                prioritization.businessImpact !== DEFAULT_IMPACT || 
                prioritization.sustainabilityImpact !== DEFAULT_IMPACT || 
                prioritization.comments
              );
              
              return (
                <Button
                  key={topic.id}
                  variant={index === currentTopicIndex ? "default" : isCompleted ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentTopicIndex(index)}
                  className="text-xs relative"
                >
                  {index + 1}
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakeholderMaterialityDashboard;