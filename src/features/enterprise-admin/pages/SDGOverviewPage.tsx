import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { sdgGoals } from '@/data/sdg/goals';
import { Target, TrendingUp, Users, Globe } from 'lucide-react';

const SDGOverviewPage = () => {
  const totalProgress = Math.round(
    sdgGoals.reduce((sum, goal) => sum + goal.progress, 0) / sdgGoals.length
  );

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SDG Overview</h1>
          <p className="text-muted-foreground">
            Track your organization's progress towards the Sustainable Development Goals
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active SDGs</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sdgGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                out of 17 total goals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProgress}%</div>
              <p className="text-xs text-muted-foreground">
                average completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stakeholders Impacted</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450</div>
              <p className="text-xs text-muted-foreground">
                people reached
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Impact</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                countries reached
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SDG Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle>SDG Goals Progress</CardTitle>
            <CardDescription>
              Your organization's progress towards each Sustainable Development Goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sdgGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="min-w-[40px] justify-center">
                      {goal.number}
                    </Badge>
                    <div>
                      <p className="font-medium">{goal.name}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{goal.progress}%</div>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default SDGOverviewPage;