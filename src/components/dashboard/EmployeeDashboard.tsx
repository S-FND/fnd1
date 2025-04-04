
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, GraduationCap, LineChart, Users } from 'lucide-react';
import { personalGHGParams, trainingModules } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EmployeeDashboard: React.FC = () => {
  // Mock user-specific data
  const userTrainingCompletion = 67;
  const userTrainingsCompleted = 3;
  const userTotalTrainings = 6;
  
  const upcomingTrainings = [
    { id: 1, title: "EHS Chemical Safety", date: "April 20, 2024", priority: "High" },
    { id: 2, title: "ESG Reporting Standards", date: "May 5, 2024", priority: "Medium" },
  ];
  
  const userAchievements = [
    { id: 1, title: "ESG Champion", description: "Completed all ESG training modules", date: "March 15, 2024" },
    { id: 2, title: "Green Commuter", description: "Used sustainable transport for 30 days", date: "February 28, 2024" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>
              Your sustainability journey at a glance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Training Progress</div>
                <div className="flex items-center gap-2">
                  <Progress value={userTrainingCompletion} className="h-2" />
                  <span className="text-sm font-medium">{userTrainingCompletion}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {userTrainingsCompleted} of {userTotalTrainings} modules completed
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Your Carbon Footprint</div>
                <div className="flex items-center gap-2">
                  <Progress value={75} className="h-2" />
                  <span className="text-sm font-medium">3.2 tonnes</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  15% below company average
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">Upcoming Trainings</h4>
              {upcomingTrainings.map((training) => (
                <div key={training.id} className="flex items-center justify-between border-b py-2">
                  <div>
                    <div className="font-medium text-sm">{training.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {training.date}
                    </div>
                  </div>
                  <Badge variant={training.priority === "High" ? "destructive" : "outline"}>
                    {training.priority} Priority
                  </Badge>
                </div>
              ))}
              
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link to="/lms">View All Trainings</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <Link to="/ghg" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Calculate Personal Carbon Footprint
              </Link>
            </Button>
            
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/lms" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Continue Learning
              </Link>
            </Button>
            
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                View Your Team's Progress
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userAchievements.map((achievement) => (
                <div key={achievement.id} className="border-l-4 border-green-500 pl-4 py-1">
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm text-muted-foreground mb-1">{achievement.description}</div>
                  <div className="text-xs">{achievement.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sustainability Tips</CardTitle>
            <CardDescription>AI-powered suggestions for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm">
                Consider joining the carpooling program for your daily commute to reduce emissions by up to 1.2 tonnes annually.
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm">
                You've been using 15% more paper than average. Try using digital alternatives when possible.
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm">
                Based on your role, the "Advanced Waste Management" training may help you improve facility sustainability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
