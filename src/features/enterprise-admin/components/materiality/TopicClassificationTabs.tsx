
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleAlert, TrendingUp } from 'lucide-react';

interface TopicClassificationTabsProps {
  onValueChange: (value: 'all' | 'risks' | 'opportunities') => void;
  children: React.ReactNode;
}

const TopicClassificationTabs: React.FC<TopicClassificationTabsProps> = ({
  onValueChange,
  children
}) => {
  return (
    <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => onValueChange(value as 'all' | 'risks' | 'opportunities')}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Topics</TabsTrigger>
        <TabsTrigger value="risks" className="flex items-center gap-1">
          <CircleAlert className="w-4 h-4" /> Risks
        </TabsTrigger>
        <TabsTrigger value="opportunities" className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" /> Opportunities
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        {children}
      </TabsContent>
      
      <TabsContent value="risks" className="space-y-4">
        {children}
      </TabsContent>
      
      <TabsContent value="opportunities" className="space-y-4">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default TopicClassificationTabs;
