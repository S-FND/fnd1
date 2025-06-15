
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { MaterialTopic } from '../../data/frameworkTopics';
import { StakeholderPrioritization, Stakeholder } from '../../data/stakeholderPrioritization';

interface StakeholderPrioritizationFormProps {
  stakeholder: Stakeholder;
  topics: MaterialTopic[];
  onSave: (prioritizations: any[]) => void;
  onCancel: () => void;
  existingPrioritizations: StakeholderPrioritization[];
}

const StakeholderPrioritizationForm: React.FC<StakeholderPrioritizationFormProps> = ({
  stakeholder,
  topics,
  onSave,
  onCancel,
  existingPrioritizations
}) => {
  const [prioritizations, setPrioritizations] = useState<any[]>([]);
  
  // Initialize prioritizations with existing data or defaults
  useEffect(() => {
    const initialPrioritizations = topics.map(topic => {
      const existing = existingPrioritizations.find(p => p.topicId === topic.id);
      
      return {
        topicId: topic.id,
        name: topic.name,
        category: topic.category,
        description: topic.description,
        framework: topic.framework,
        businessImpact: existing?.businessImpact || topic.businessImpact || 5,
        sustainabilityImpact: existing?.sustainabilityImpact || topic.sustainabilityImpact || 5,
        comments: existing?.comments || ''
      };
    });
    
    setPrioritizations(initialPrioritizations);
  }, [topics, existingPrioritizations]);
  
  const handleBusinessImpactChange = (topicId: string, value: number[]) => {
    setPrioritizations(
      prioritizations.map(p => 
        p.topicId === topicId ? { ...p, businessImpact: value[0] } : p
      )
    );
  };
  
  const handleSustainabilityImpactChange = (topicId: string, value: number[]) => {
    setPrioritizations(
      prioritizations.map(p => 
        p.topicId === topicId ? { ...p, sustainabilityImpact: value[0] } : p
      )
    );
  };
  
  const handleCommentsChange = (topicId: string, comments: string) => {
    setPrioritizations(
      prioritizations.map(p => 
        p.topicId === topicId ? { ...p, comments } : p
      )
    );
  };
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Topic Prioritization</CardTitle>
        <CardDescription>
          Stakeholder: {stakeholder.name} ({stakeholder.role})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {prioritizations.map(prioritization => (
          <div key={prioritization.topicId} className="border rounded-md p-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: 
                    prioritization.category === 'Environment' ? '#22c55e' : 
                    prioritization.category === 'Social' ? '#60a5fa' : 
                    '#f59e0b' 
                  }} 
                />
                <h3 className="font-medium text-base">{prioritization.name}</h3>
                <span className="text-xs bg-gray-100 px-1.5 rounded text-gray-700">
                  {prioritization.framework}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{prioritization.description}</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`business-${prioritization.topicId}`}>Business Impact</Label>
                  <span className="text-sm font-medium">{prioritization.businessImpact.toFixed(1)}</span>
                </div>
                <Slider
                  id={`business-${prioritization.topicId}`}
                  min={1}
                  max={10}
                  step={0.1}
                  defaultValue={[prioritization.businessImpact]}
                  onValueChange={(values) => handleBusinessImpactChange(prioritization.topicId, values)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Impact</span>
                  <span>High Impact</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`sustainability-${prioritization.topicId}`}>Sustainability Impact</Label>
                  <span className="text-sm font-medium">{prioritization.sustainabilityImpact.toFixed(1)}</span>
                </div>
                <Slider
                  id={`sustainability-${prioritization.topicId}`}
                  min={1}
                  max={10}
                  step={0.1}
                  defaultValue={[prioritization.sustainabilityImpact]}
                  onValueChange={(values) => handleSustainabilityImpactChange(prioritization.topicId, values)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Impact</span>
                  <span>High Impact</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`comments-${prioritization.topicId}`}>Comments (Optional)</Label>
                <Textarea
                  id={`comments-${prioritization.topicId}`}
                  placeholder="Add any comments or reasoning for your prioritization"
                  value={prioritization.comments}
                  onChange={(e) => handleCommentsChange(prioritization.topicId, e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(prioritizations)}>Save Prioritization</Button>
      </CardFooter>
    </Card>
  );
};

export default StakeholderPrioritizationForm;
