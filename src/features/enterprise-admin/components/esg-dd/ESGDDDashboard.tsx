
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, ClipboardCheck, AlertTriangle } from 'lucide-react';
import ESGDDWorkflowsList from './ESGDDWorkflowsList';
import { mockESGDDWorkflows } from '../../data/esgDD';

const ESGDDDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active DD Workflows
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockESGDDWorkflows.filter(w => w.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Due diligence workflows in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending CAP Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockESGDDWorkflows.reduce((acc, workflow) => 
                acc + workflow.capItems.filter(item => item.status === 'pending' || item.status === 'in_progress').length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Action items awaiting completion
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Start ESG Due Diligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-2" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New DD Workflow
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>ESG Due Diligence Workflows</CardTitle>
          <CardDescription>
            Track and manage your ESG due diligence processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ESGDDWorkflowsList workflows={mockESGDDWorkflows} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ESGDDDashboard;
