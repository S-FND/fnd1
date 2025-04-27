import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Book, Calendar, CheckCircle2, Clock, GraduationCap, LineChart, Play, Search, Shield, User } from 'lucide-react';
import { trainingModules } from '@/data';

const LMSOverview: React.FC<{ehsTraining:[]}> = ({ehsTraining}) => {
  // Group modules by category
  const categorizedModules = trainingModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof trainingModules>);

  const categories = Object.keys(categorizedModules);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-bold">Learning Management System</h2>
        <p className="text-muted-foreground">
          Access training modules, track progress, and manage certifications
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Learning</CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </div>
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search courses..."
                  className="rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={categories[0]} className="space-y-4">
              <TabsList className="flex flex-wrap">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category} ({categorizedModules[category].length})
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {categorizedModules[category].map(module => (
                    <div key={module.id} className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="flex gap-3">
                        <div className="bg-muted rounded-md p-2">
                          {category === "ESG" ? (
                            <GraduationCap className="h-5 w-5 text-green-500" />
                          ) : category === "GHG" ? (
                            <LineChart className="h-5 w-5 text-blue-500" />
                          ) : category === "EHS" ? (
                            <Shield className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Book className="h-5 w-5 text-purple-500" />
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-medium">{module.title}</h3>
                          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {module.duration}
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {module.completion}% Complete
                            </div>
                          </div>
                          <Badge variant="outline" className="mt-2">{category}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col-reverse md:flex-row items-center gap-3 w-full md:w-auto">
                        <Progress value={module.completion} className="w-full md:w-[100px]" />
                        <Button size="sm" variant={module.completion === 100 ? "outline" : "default"}>
                          {module.completion === 100 ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" /> Completed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Play className="h-4 w-4" /> Continue
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle>Your Learning Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">{trainingModules.length}</div>
                <div className="text-sm text-muted-foreground">Available Courses</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-500">3</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-500">2</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-amber-500">8.5</div>
                <div className="text-sm text-muted-foreground">Hours Spent</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Upcoming Training Sessions</h3>
              <div className="space-y-3">
                {[
                  {
                    title: "EHS Workshop",
                    date: "April 15, 2024",
                    time: "10:00 - 12:00",
                    calendar: true
                  },
                  {
                    title: "ESG Reporting Webinar",
                    date: "April 22, 2024",
                    time: "14:00 - 15:30",
                    calendar: false
                  }
                ].map((event, i) => (
                  <div key={i} className="flex gap-3 p-3 border rounded-md">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.date}, {event.time}
                      </div>
                      {event.calendar && (
                        <div className="mt-1 text-xs text-primary">Added to your calendar</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Certifications</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">EHS Safety Champion</div>
                    <Badge>Valid</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Expires: Dec 31, 2024</div>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">GHG Accounting Level 1</div>
                    <Badge>Valid</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Expires: Aug 15, 2024</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>AI-powered learning recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Advanced ESG Reporting",
                description: "Learn the latest standards and practices for ESG disclosure",
                duration: "4 hours",
                level: "Intermediate"
              },
              {
                title: "Scope 3 Emissions Calculation",
                description: "Techniques for accurate supply chain carbon accounting",
                duration: "3 hours",
                level: "Advanced"
              },
              {
                title: "Sustainability Communication",
                description: "Effectively communicate your ESG initiatives to stakeholders",
                duration: "2.5 hours",
                level: "Beginner"
              }
            ].map((course, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="font-medium">{course.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {course.description}
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">View Course</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMSOverview;
