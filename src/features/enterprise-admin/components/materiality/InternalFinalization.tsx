import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface MaterialTopic {
  id: string;
  topic: string;
  esg: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
  finalized?:boolean;
}

interface InternalFinalizationProps {
  materialTopics: MaterialTopic[];
  onFinalize: (selectedTopics: MaterialTopic[]) => void;
  onBack: () => void;
}

const InternalFinalization: React.FC<InternalFinalizationProps> = ({
  materialTopics,
  onFinalize,
  onBack
}) => {
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  console.log('materialTopics',materialTopics)
  const handleTopicToggle = (topicId: string, checked: boolean) => {
    if (checked) {
      setSelectedTopicIds(prev => [...prev, topicId]);
    } else {
      setSelectedTopicIds(prev => prev.filter(id => id !== topicId));
    }
  };

  const handleSelectAll = () => {
    setSelectedTopicIds(materialTopics.map(topic => topic.id));
  };

  useEffect(()=>{
    setSelectedTopicIds(materialTopics.filter((m)=> m.finalized).map((f)=> f.id))
  },[materialTopics])

  const handleClearAll = () => {
    setSelectedTopicIds([]);
  };

  const handleFinalize = () => {
    if (selectedTopicIds.length === 0) {
      toast.error('Please select at least one material topic to finalize');
      return;
    }

    const selectedTopics = materialTopics.filter(topic => 
      selectedTopicIds.includes(topic.id)
    );


    
    onFinalize(selectedTopics);
    toast.success(`${selectedTopics.length} material topics finalized successfully`);
  };

  // Group topics by priority for better organization
  const highPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact >= 7.5 && topic.sustainabilityImpact >= 7.5
  );
  
  const mediumPriorityTopics = materialTopics.filter(
    topic => (topic.businessImpact >= 7.5 && topic.sustainabilityImpact < 7.5) || 
            (topic.businessImpact < 7.5 && topic.sustainabilityImpact >= 7.5)
  );
  
  const lowPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact < 7.5 && topic.sustainabilityImpact < 7.5
  );

  const renderTopicGroup = (topics: MaterialTopic[], title: string, variant: any) => {
    if (topics.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant={variant}>{title}</Badge>
          <span className="text-sm text-muted-foreground">({topics.length} topics)</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => {
            const isSelected = selectedTopicIds.includes(topic.id) || topic.finalized;
            return (
              <Card 
                key={topic.id} 
                className={`border-l-4 cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary/20 bg-primary/5' : 'hover:shadow-md'
                }`}
                style={{ borderLeftColor: topic.color }}
                onClick={() => handleTopicToggle(topic.id, !isSelected)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleTopicToggle(topic.id, !!checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{topic.topic}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {/* {topic.description} */}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Business:</span>
                          <div className="font-medium">{topic.businessImpact.toFixed(1)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sustainability:</span>
                          <div className="font-medium">{topic.sustainabilityImpact.toFixed(1)}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs" style={{ 
                          backgroundColor: `${topic.color}20`, 
                          color: topic.color, 
                          borderColor: topic.color 
                        }}>
                          {topic.esg}
                        </Badge>
                        {topic.framework && (
                          <Badge variant="outline" className="text-xs ml-1">
                            {topic.framework}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Finalize Material Topics Internally
          </CardTitle>
          <CardDescription>
            Select the material topics that are most relevant to your organization. 
            These will be used to recommend ESG metrics for tracking and reporting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All ({materialTopics.length})
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedTopicIds.length} of {materialTopics.length} topics selected
            </div>
          </div>

          <div className="space-y-8">
            {renderTopicGroup(highPriorityTopics, 'High Priority', 'destructive')}
            {renderTopicGroup(mediumPriorityTopics, 'Medium Priority', 'default')}
            {renderTopicGroup(lowPriorityTopics, 'Low Priority', 'outline')}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Method Selection
        </Button>
        <Button onClick={handleFinalize} disabled={selectedTopicIds.length === 0}>
          Finalize Selected Topics
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default InternalFinalization;