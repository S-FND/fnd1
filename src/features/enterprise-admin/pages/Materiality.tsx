import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ZAxis
} from 'recharts';
import { defaultMaterialTopics, industries, materialTopicsByIndustry } from '../data/materiality';
import { toast } from 'sonner';

// Mock material topics data for the matrix
const materialTopics = [
  { 
    id: 'climate', 
    name: 'Climate Change',
    category: 'Environment',
    businessImpact: 8.5, 
    sustainabilityImpact: 9.2,
    color: '#22c55e'
  },
  { 
    id: 'energy', 
    name: 'Energy Management',
    category: 'Environment',
    businessImpact: 7.8, 
    sustainabilityImpact: 8.5,
    color: '#22c55e'
  },
  { 
    id: 'water', 
    name: 'Water Management',
    category: 'Environment',
    businessImpact: 6.5, 
    sustainabilityImpact: 8.0,
    color: '#22c55e'
  },
  { 
    id: 'waste', 
    name: 'Waste Management',
    category: 'Environment',
    businessImpact: 6.0, 
    sustainabilityImpact: 7.5,
    color: '#22c55e'
  },
  { 
    id: 'biodiversity', 
    name: 'Biodiversity',
    category: 'Environment',
    businessImpact: 4.5, 
    sustainabilityImpact: 7.0,
    color: '#22c55e'
  },
  { 
    id: 'diversity', 
    name: 'Diversity & Inclusion',
    category: 'Social',
    businessImpact: 7.5, 
    sustainabilityImpact: 6.5,
    color: '#60a5fa'
  },
  { 
    id: 'laborRights', 
    name: 'Labor Rights',
    category: 'Social',
    businessImpact: 8.0, 
    sustainabilityImpact: 7.8,
    color: '#60a5fa'
  },
  { 
    id: 'communityEngagement', 
    name: 'Community Engagement',
    category: 'Social',
    businessImpact: 5.5, 
    sustainabilityImpact: 6.0,
    color: '#60a5fa'
  },
  { 
    id: 'employeeWellbeing', 
    name: 'Employee Wellbeing',
    category: 'Social',
    businessImpact: 7.0, 
    sustainabilityImpact: 5.5,
    color: '#60a5fa'
  },
  { 
    id: 'ethics', 
    name: 'Business Ethics',
    category: 'Governance',
    businessImpact: 9.0, 
    sustainabilityImpact: 7.5,
    color: '#f59e0b'
  },
  { 
    id: 'transparency', 
    name: 'Transparency',
    category: 'Governance',
    businessImpact: 8.2, 
    sustainabilityImpact: 7.0,
    color: '#f59e0b'
  },
  { 
    id: 'dataPrivacy', 
    name: 'Data Privacy & Security',
    category: 'Governance',
    businessImpact: 8.8, 
    sustainabilityImpact: 6.0,
    color: '#f59e0b'
  },
  { 
    id: 'supplierConduct', 
    name: 'Supplier Conduct',
    category: 'Governance',
    businessImpact: 7.2, 
    sustainabilityImpact: 7.8,
    color: '#f59e0b'
  },
];

const MatrixQuadrant = ({ x1, y1, x2, y2, label, className }: { 
  x1: string, 
  y1: string, 
  x2: string, 
  y2: string, 
  label: string, 
  className: string 
}) => (
  <div 
    style={{ 
      position: 'absolute', 
      left: x1, 
      top: y1, 
      width: `calc(${x2} - ${x1})`, 
      height: `calc(${y2} - ${y1})`,
      padding: '10px',
    }}
    className={className}
  >
    <span className="text-xs font-medium">{label}</span>
  </div>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border shadow-sm rounded-md">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-xs">Business Impact: {payload[0].payload.businessImpact}</p>
        <p className="text-xs">Sustainability Impact: {payload[0].payload.sustainabilityImpact}</p>
      </div>
    );
  }
  return null;
};

const MaterialityPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [materialTopics, setMaterialTopics] = useState(defaultMaterialTopics);
  
  const form = useForm();

  useEffect(() => {
    if (selectedIndustries.length === 0) {
      setMaterialTopics(defaultMaterialTopics);
      return;
    }
    
    // Combine material topics from all selected industries
    const combinedTopics = new Map();
    
    selectedIndustries.forEach(industryId => {
      const industryTopics = materialTopicsByIndustry[industryId as keyof typeof materialTopicsByIndustry];
      if (!industryTopics) return;
      
      industryTopics.forEach(topic => {
        if (combinedTopics.has(topic.id)) {
          // Average the values if topic exists
          const existingTopic = combinedTopics.get(topic.id);
          existingTopic.businessImpact = (existingTopic.businessImpact + topic.businessImpact) / 2;
          existingTopic.sustainabilityImpact = (existingTopic.sustainabilityImpact + topic.sustainabilityImpact) / 2;
        } else {
          // Otherwise just add it
          combinedTopics.set(topic.id, { ...topic });
        }
      });
    });
    
    setMaterialTopics(Array.from(combinedTopics.values()));
    
    toast.info(`Updated materiality assessment for ${selectedIndustries.length} selected industries`);
  }, [selectedIndustries]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleIndustryChange = (industryId: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries(prev => [...prev, industryId]);
    } else {
      setSelectedIndustries(prev => prev.filter(id => id !== industryId));
    }
  };

  const filteredTopics = selectedCategory === 'All' 
    ? materialTopics 
    : materialTopics.filter(topic => topic.category === selectedCategory);

  const materialityData = filteredTopics.map(topic => ({
    x: topic.businessImpact,
    y: topic.sustainabilityImpact,
    z: 100,
    name: topic.name,
    category: topic.category,
    businessImpact: topic.businessImpact,
    sustainabilityImpact: topic.sustainabilityImpact,
    color: topic.color
  }));

  const highPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact >= 7.5 && topic.sustainabilityImpact >= 7.5
  );

  const mediumPriorityTopics = materialTopics.filter(
    topic => 
      (topic.businessImpact >= 7.5 && topic.sustainabilityImpact < 7.5) || 
      (topic.businessImpact < 7.5 && topic.sustainabilityImpact >= 7.5)
  );

  const lowPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact < 7.5 && topic.sustainabilityImpact < 7.5
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Materiality Assessment</h1>
            <p className="text-muted-foreground">
              Analyze and prioritize ESG material topics based on business impact and sustainability impact
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Industry Selection</CardTitle>
              <CardDescription>Select industries relevant to your organization to customize materiality assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {industries.map((industry) => (
                  <div key={industry.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`industry-${industry.id}`}
                      checked={selectedIndustries.includes(industry.id)}
                      onCheckedChange={(checked) => handleIndustryChange(industry.id, checked === true)}
                    />
                    <label 
                      htmlFor={`industry-${industry.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {industry.name}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedIndustries([])}
                >
                  Clear Selection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedIndustries.length <= 0}
                >
                  {selectedIndustries.length} {selectedIndustries.length === 1 ? 'Industry' : 'Industries'} Selected
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="matrix">Materiality Matrix</TabsTrigger>
              <TabsTrigger value="topics">Material Topics</TabsTrigger>
              <TabsTrigger value="methodology">Assessment Methodology</TabsTrigger>
            </TabsList>
            
            <TabsContent value="matrix" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Double Materiality Matrix</CardTitle>
                  <CardDescription>Plotting of material topics based on business impact and sustainability impact</CardDescription>
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
                      
                      <div className="mt-8">
                        <h3 className="text-base font-medium mb-2">Legend</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">Environmental</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm">Social</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-sm">Governance</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-3 h-[500px] relative">
                      {/* Quadrant labels */}
                      <MatrixQuadrant 
                        x1="0%" 
                        y1="0%" 
                        x2="50%" 
                        y2="50%" 
                        label="Monitor" 
                        className="text-gray-500" 
                      />
                      <MatrixQuadrant 
                        x1="50%" 
                        y1="0%" 
                        x2="100%" 
                        y2="50%" 
                        label="Manage" 
                        className="text-blue-500" 
                      />
                      <MatrixQuadrant 
                        x1="0%" 
                        y1="50%" 
                        x2="50%" 
                        y2="100%" 
                        label="Maintain" 
                        className="text-amber-500" 
                      />
                      <MatrixQuadrant 
                        x1="50%" 
                        y1="50%" 
                        x2="100%" 
                        y2="100%" 
                        label="Focus & Act" 
                        className="text-green-600 font-medium" 
                      />
                      
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid />
                          <XAxis 
                            type="number" 
                            dataKey="x" 
                            name="Business Impact" 
                            domain={[0, 10]} 
                            label={{ value: 'Business Impact', position: 'bottom' }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="y" 
                            name="Sustainability Impact" 
                            domain={[0, 10]} 
                            label={{ value: 'Sustainability Impact', angle: -90, position: 'left' }}
                          />
                          <ZAxis type="number" dataKey="z" range={[50, 400]} />
                          <Tooltip content={<CustomTooltip />} />
                          {/* Reference lines for quadrants */}
                          <CartesianGrid strokeDasharray="3 3" />
                          {/* Scatter plot points */}
                          <Scatter 
                            name="Material Topics" 
                            data={materialityData} 
                            fill="#8884d8"
                            shape="circle"
                          >
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Material Topics by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                        <Badge variant="destructive">High Priority</Badge>
                        <span>Topics to Focus On</span>
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {highPriorityTopics.map(topic => (
                          <div key={topic.id} className="border rounded-md p-3">
                            <div className="font-medium">{topic.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">{topic.description}</div>
                            <div className="flex items-center gap-2 text-sm mt-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }}></div>
                              <span>{topic.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                        <Badge variant="default">Medium Priority</Badge>
                        <span>Topics to Manage</span>
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {mediumPriorityTopics.map(topic => (
                          <div key={topic.id} className="border rounded-md p-3">
                            <div className="font-medium">{topic.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">{topic.description}</div>
                            <div className="flex items-center gap-2 text-sm mt-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }}></div>
                              <span>{topic.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                        <Badge variant="outline">Lower Priority</Badge>
                        <span>Topics to Monitor</span>
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {lowPriorityTopics.map(topic => (
                          <div key={topic.id} className="border rounded-md p-3">
                            <div className="font-medium">{topic.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">{topic.description}</div>
                            <div className="flex items-center gap-2 text-sm mt-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }}></div>
                              <span>{topic.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="topics">
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
            </TabsContent>
            
            <TabsContent value="methodology">
              <Card>
                <CardHeader>
                  <CardTitle>Materiality Assessment Methodology</CardTitle>
                  <CardDescription>Our approach to determining material ESG topics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Double Materiality Approach</h3>
                    <p className="text-sm">
                      Our materiality assessment follows the double materiality principle, which considers both:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                      <li>
                        <span className="font-medium">Impact Materiality:</span> How our company's activities impact the environment and society
                      </li>
                      <li>
                        <span className="font-medium">Financial Materiality:</span> How ESG factors impact our company's financial performance and value creation
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Industry-Specific Considerations</h3>
                    <p className="text-sm">
                      Our materiality assessment is tailored to the specific industries in which we operate. We have selected {selectedIndustries.length} {selectedIndustries.length === 1 ? 'industry' : 'industries'} for this assessment:
                    </p>
                    <div className="mt-2">
                      {selectedIndustries.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedIndustries.map(id => {
                            const industry = industries.find(i => i.id === id);
                            return industry ? (
                              <Badge key={id} variant="outline">{industry.name}</Badge>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No industries selected. Using default materiality assessment.</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Assessment Process</h3>
                    <ol className="list-decimal pl-6 mt-2 space-y-3 text-sm">
                      <li>
                        <span className="font-medium block">Identification of Topics</span>
                        Topics were identified through stakeholder consultations, industry benchmarking, and ESG reporting frameworks (GRI, SASB, TCFD).
                      </li>
                      <li>
                        <span className="font-medium block">Stakeholder Engagement</span>
                        We engaged with various stakeholders including employees, investors, customers, suppliers, regulators, and community representatives.
                      </li>
                      <li>
                        <span className="font-medium block">Prioritization</span>
                        Topics were rated on a scale from 1-10 for both business impact and sustainability impact based on stakeholder input and expert assessment.
                      </li>
                      <li>
                        <span className="font-medium block">Validation</span>
                        The final materiality matrix was reviewed and validated by our ESG Committee and Board of Directors.
                      </li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Review Cycle</h3>
                    <p className="text-sm">
                      Our materiality assessment is reviewed annually and updated completely every three years to ensure continued relevance to our business strategy and stakeholder concerns.
                    </p>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button>Download Full Assessment Report</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default MaterialityPage;
