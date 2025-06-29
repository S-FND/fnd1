
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MaterialTopic } from '../../enterprise-admin/data/frameworkTopics';

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
  existingPrioritizations?: StakeholderPrioritization[];
}

const StakeholderMaterialityDashboard: React.FC<StakeholderMaterialityDashboardProps> = ({
  stakeholderName,
  groupName,
  topics,
  onSavePrioritizations,
  existingPrioritizations = []
}) => {
  const [prioritizations, setPrioritizations] = useState<StakeholderPrioritization[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

  useEffect(() => {
    // Initialize prioritizations with existing data or defaults
    const initialPrioritizations = topics.map(topic => {
      const existing = existingPrioritizations.find(p => p.topicId === topic.id);
      return existing || {
        topicId: topic.id,
        businessImpact: 5,
        sustainabilityImpact: 5,
        comments: ''
      };
    });
    setPrioritizations(initialPrioritizations);
  }, [topics, existingPrioritizations]);

  const updatePrioritization = (topicId: string, field: keyof StakeholderPrioritization, value: any) => {
    setPrioritizations(prev => prev.map(p => 
      p.topicId === topicId ? { ...p, [field]: value } : p
    ));
  };

  const handleSave = () => {
    onSavePrioritizations(prioritizations);
    toast.success('Your prioritizations have been saved successfully!');
  };

  const currentTopic = topics[currentTopicIndex];
  const currentPrioritization = prioritizations.find(p => p.topicId === currentTopic?.id);

  if (!currentTopic || !currentPrioritization) {
    return <div>Loading...</div>;
  }

  const completedCount = prioritizations.filter(p => 
    p.businessImpact !== 5 || p.sustainabilityImpact !== 5 || p.comments
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Material Topics Prioritization</h1>
          <p className="text-muted-foreground">Welcome, {stakeholderName}</p>
          <p className="text-sm text-muted-foreground">Assessment Group: {groupName}</p>
        </div>

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
                <Badge 
                  variant="outline" 
                  style={{ 
                    backgroundColor: `${currentTopic.category === 'Environment' ? '#22c55e' : 
                                       currentTopic.category === 'Social' ? '#60a5fa' : '#f59e0b'}20`,
                    color: currentTopic.category === 'Environment' ? '#22c55e' : 
                           currentTopic.category === 'Social' ? '#60a5fa' : '#f59e0b',
                    borderColor: currentTopic.category === 'Environment' ? '#22c55e' : 
                                 currentTopic.category === 'Social' ? '#60a5fa' : '#f59e0b'
                  }}
                >
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

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentTopicIndex(Math.max(0, currentTopicIndex - 1))}
                disabled={currentTopicIndex === 0}
              >
                Previous Topic
              </Button>
              
              <div className="space-x-2">
                <Button variant="outline" onClick={handleSave}>
                  Save Progress
                </Button>
                
                {currentTopicIndex < topics.length - 1 ? (
                  <Button
                    onClick={() => setCurrentTopicIndex(Math.min(topics.length - 1, currentTopicIndex + 1))}
                  >
                    Next Topic
                  </Button>
                ) : (
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    Complete Assessment
                  </Button>
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
                  prioritization.businessImpact !== 5 || 
                  prioritization.sustainabilityImpact !== 5 || 
                  prioritization.comments
                );
                
                return (
                  <Button
                    key={topic.id}
                    variant={index === currentTopicIndex ? "default" : isCompleted ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentTopicIndex(index)}
                    className="text-xs"
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StakeholderMaterialityDashboard;
