
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { cheqMaterialTopics } from '../../data/cheq-mock-data';

const CheQMateriality: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Filter topics based on category
  const filteredTopics = selectedCategory === 'All' 
    ? cheqMaterialTopics 
    : cheqMaterialTopics.filter(topic => topic.category === selectedCategory);
  
  // Create data for the materiality matrix
  const materialityData = cheqMaterialTopics.map(topic => ({
    name: topic.name,
    x: topic.businessImpact,
    y: topic.sustainabilityImpact,
    z: 8,
    category: topic.category,
    color: topic.color
  }));

  const filteredMatrixData = selectedCategory === 'All' 
    ? materialityData 
    : materialityData.filter(topic => {
        const originalTopic = cheqMaterialTopics.find(t => t.name === topic.name);
        return originalTopic?.category === selectedCategory;
      });

  // Group topics by priority
  const highPriorityTopics = cheqMaterialTopics.filter(topic => 
    topic.businessImpact >= 8.5 || topic.sustainabilityImpact >= 8.5
  );
  
  const mediumPriorityTopics = cheqMaterialTopics.filter(topic => 
    (topic.businessImpact >= 7.5 && topic.businessImpact < 8.5) || 
    (topic.sustainabilityImpact >= 7.5 && topic.sustainabilityImpact < 8.5)
  );
  
  const lowPriorityTopics = cheqMaterialTopics.filter(topic => 
    topic.businessImpact < 7.5 && topic.sustainabilityImpact < 7.5
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-bold">CheQ.one Materiality Assessment</h2>
        <p className="text-muted-foreground">
          Double materiality analysis for CheQ.one Financial Services
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Double Materiality Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-1">
              <h3 className="text-base font-medium mb-2">Filter by Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    selectedCategory === "All" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  All Categories
                </button>
                {['Environment', 'Social', 'Governance'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      selectedCategory === category 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="Business Impact" domain={[5, 10]} label={{ value: 'Impact on Business', position: 'bottom', offset: 0 }} />
                    <YAxis type="number" dataKey="y" name="Sustainability Impact" domain={[5, 10]} label={{ value: 'Impact on Sustainability', angle: -90, position: 'insideLeft' }} />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border rounded-md shadow-sm">
                              <p className="font-medium">{payload[0].payload.name}</p>
                              <p className="text-sm">Business Impact: <span className="font-medium">{payload[0].value}</span></p>
                              <p className="text-sm">Sustainability Impact: <span className="font-medium">{payload[1].value}</span></p>
                              <p className="text-sm text-muted-foreground mt-1">{payload[0].payload.category}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      name="Topics" 
                      data={filteredMatrixData} 
                      fill="#8884d8"
                      shape={(props) => {
                        const { cx, cy, fill } = props;
                        const topic = props.payload;
                        return (
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={8} 
                            fill={topic.color} 
                            stroke="#fff"
                            strokeWidth={1}
                          />
                        );
                      }}
                    />
                    
                    {/* Matrix quadrant lines */}
                    <line x1={7.5} y1={5} x2={7.5} y2={10} stroke="#ddd" strokeDasharray="3 3" />
                    <line x1={5} y1={7.5} x2={10} y2={7.5} stroke="#ddd" strokeDasharray="3 3" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Material Topics By Priority</h2>
          <Button>Set ESG Metrics for Material Topics</Button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Badge variant="destructive" className="mr-2">High Priority</Badge>
              Topics requiring immediate focus
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {highPriorityTopics.map((topic) => (
                <Card key={topic.id} className="border-l-4" style={{ borderLeftColor: topic.color }}>
                  <CardContent className="pt-4">
                    <div>
                      <h4 className="font-medium">{topic.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Business Impact</div>
                        <div className="font-medium">{topic.businessImpact} / 10</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Sustainability Impact</div>
                        <div className="font-medium">{topic.sustainabilityImpact} / 10</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-muted-foreground">Category</div>
                        <Badge variant="outline" className="bg-opacity-50 mt-1" style={{ backgroundColor: `${topic.color}20`, color: topic.color, borderColor: topic.color }}>
                          {topic.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Badge className="mr-2">Medium Priority</Badge>
              Topics to address in medium term
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mediumPriorityTopics.map((topic) => (
                <Card key={topic.id} className="border-l-4" style={{ borderLeftColor: topic.color }}>
                  <CardContent className="pt-4">
                    <div>
                      <h4 className="font-medium">{topic.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Business Impact</div>
                        <div className="font-medium">{topic.businessImpact} / 10</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Sustainability Impact</div>
                        <div className="font-medium">{topic.sustainabilityImpact} / 10</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-muted-foreground">Category</div>
                        <Badge variant="outline" className="bg-opacity-50 mt-1" style={{ backgroundColor: `${topic.color}20`, color: topic.color, borderColor: topic.color }}>
                          {topic.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {lowPriorityTopics.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Badge variant="outline" className="mr-2">Low Priority</Badge>
                Topics to monitor
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {lowPriorityTopics.map((topic) => (
                  <Card key={topic.id} className="border-l-4" style={{ borderLeftColor: topic.color }}>
                    <CardContent className="pt-4">
                      <h4 className="font-medium">{topic.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheQMateriality;
