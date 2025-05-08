
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MaterialTopic {
  id: string;
  name: string;
  category: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
}

interface MaterialTopicsTabProps {
  materialTopics: MaterialTopic[];
}

const MaterialTopicsTab: React.FC<MaterialTopicsTabProps> = ({ materialTopics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Topics Assessment</CardTitle>
        <CardDescription>Detailed assessment of key material ESG topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {['Environment', 'Social', 'Governance'].map(category => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-medium">{category}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {materialTopics
                  .filter(topic => topic.category === category)
                  .map(topic => (
                    <div key={topic.id} className="border rounded-lg p-4">
                      <div className="font-medium text-base">{topic.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {topic.description}
                      </div>
                      <div className="grid grid-cols-2 mt-4 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Business Impact</div>
                          <div className="font-medium">{topic.businessImpact.toFixed(1)}/10</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Sustainability Impact</div>
                          <div className="font-medium">{topic.sustainabilityImpact.toFixed(1)}/10</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialTopicsTab;
