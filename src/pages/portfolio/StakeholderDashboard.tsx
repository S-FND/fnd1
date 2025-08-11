import React from 'react';
import { ProtectedRoute } from '@/components/portfolio/ProtectedRoute';
import { PermissionGate } from '@/components/portfolio/PermissionGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, MessageSquare, TrendingUp } from 'lucide-react';

export const StakeholderDashboard: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={['stakeholder']}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Stakeholder Portal</h1>
            <p className="text-muted-foreground">Access shared reports and provide feedback</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                2 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disclosures</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Updated monthly
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback Given</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                This quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ESG Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">B+</div>
              <p className="text-xs text-muted-foreground">
                Improved from B
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PermissionGate resource="reports" action="read">
            <Card>
              <CardHeader>
                <CardTitle>Shared Reports</CardTitle>
                <CardDescription>Access reports shared with you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Q4 2024 ESG Performance Report</p>
                    <p className="text-sm text-muted-foreground">Published: 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Annual Sustainability Disclosure</p>
                    <p className="text-sm text-muted-foreground">Published: 1 week ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Climate Risk Assessment</p>
                    <p className="text-sm text-muted-foreground">Published: 2 weeks ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Social Impact Metrics</p>
                    <p className="text-sm text-muted-foreground">Published: 1 month ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </CardContent>
            </Card>
          </PermissionGate>

          <Card>
            <CardHeader>
              <CardTitle>Feedback & Communication</CardTitle>
              <CardDescription>Provide input and stay engaged</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Latest Updates</h4>
                <p className="text-sm text-muted-foreground">
                  The company has improved its ESG rating to B+ following implementation 
                  of new environmental initiatives based on stakeholder feedback.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Provide Feedback on Q4 Report</span>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Comment
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Request Additional Information</span>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Request
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Schedule Stakeholder Meeting</span>
                  <Button variant="outline" size="sm">Schedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};