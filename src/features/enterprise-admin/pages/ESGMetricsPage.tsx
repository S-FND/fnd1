
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { defaultMaterialTopics } from '../data/materiality';
import ESGMetricsManager from '../components/esg-metrics/ESGMetricsManager';
import MetricsDataEntry from '../components/esg-metrics/MetricsDataEntry';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

const ESGMetricsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('configuration');
  const [finalizedTopics, setFinalizedTopics] = useState<MaterialTopic[]>([]);

  // Load finalized topics from materiality assessment
  useEffect(() => {
    const savedTopics = localStorage.getItem('finalizedMaterialTopics');
    if (savedTopics) {
      try {
        const topics = JSON.parse(savedTopics);
        setFinalizedTopics(topics);
      } catch (error) {
        console.error('Error loading finalized topics:', error);
        // Fallback to high priority topics from default data
        const highPriorityTopics = defaultMaterialTopics.filter(
          topic => topic.businessImpact >= 7.0 && topic.sustainabilityImpact >= 7.0
        );
        setFinalizedTopics(highPriorityTopics);
      }
    } else {
      // No finalized topics found, show message to complete materiality assessment
      setFinalizedTopics([]);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ESG Metrics Management</h1>
        <p className="text-muted-foreground">
          Configure and manage ESG metrics based on your finalized material topics from the materiality assessment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Finalized Material Topics</CardTitle>
          <CardDescription>
            These topics were prioritized based on your materiality assessment results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {finalizedTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center p-3 border rounded-lg border-l-4"
                style={{ borderLeftColor: topic.color }}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{topic.name}</h4>
                  <p className="text-xs text-muted-foreground">{topic.category}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Business Impact:</span>
                      <div className="font-medium">{topic.businessImpact.toFixed(1)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sustainability Impact:</span>
                      <div className="font-medium">{topic.sustainabilityImpact.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {finalizedTopics.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No Material Topics Finalized
                </h3>
                <p className="text-muted-foreground mb-6">
                  Complete your materiality assessment to identify and finalize material topics before configuring ESG metrics.
                </p>
                <Button onClick={() => navigate('/materiality')}>
                  Go to Materiality Assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="configuration">Metrics Configuration</TabsTrigger>
          <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-6 mt-4">
          <ESGMetricsManager materialTopics={finalizedTopics} />
        </TabsContent>
        
        <TabsContent value="data-entry" className="space-y-6 mt-4">
          <MetricsDataEntry materialTopics={finalizedTopics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGMetricsPage;
