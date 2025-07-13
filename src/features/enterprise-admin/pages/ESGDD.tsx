
import React, { useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, FileSearch, Database, Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ESGDDPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showNewESGDD, setShowNewESGDD] = useState(false);
  const [selectedType, setSelectedType] = useState<'manual' | 'automated'>('manual');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'manager')) {
    return <Navigate to="/login" />;
  }

  const handleNewESGDD = () => {
    if (selectedType === 'manual') {
      navigate('/esg-dd/manual');
    } else {
      navigate('/esg-dd/automated');
    }
  };

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ESG Due Diligence</h1>
            <p className="text-muted-foreground">
              Create, manage, and track ESG due diligence assessments and corrective action plans.
            </p>
          </div>
          <Button onClick={() => setShowNewESGDD(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New ESG DD
          </Button>
        </div>
        
        {showNewESGDD && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Create New ESG Due Diligence</CardTitle>
              <CardDescription>
                Select the type of ESG due diligence assessment you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedType} onValueChange={(value) => setSelectedType(value as 'manual' | 'automated')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual" className="cursor-pointer">
                    Manual ESG DD - Create detailed ESG due diligence assessments manually
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="automated" id="automated" />
                  <Label htmlFor="automated" className="cursor-pointer">
                    Automated ESG DD - Generate ESG assessments automatically
                  </Label>
                </div>
              </RadioGroup>
              <div className="flex space-x-3">
                <Button onClick={handleNewESGDD}>Continue</Button>
                <Button variant="outline" onClick={() => setShowNewESGDD(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-primary" />
                ESG DD Reports
              </CardTitle>
              <CardDescription>View and manage all ESG due diligence reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access all your ESG due diligence reports, both manual and automated, 
                with filtering and search capabilities.
              </p>
              <Button asChild className="w-full">
                <Link to="/esg-dd/reports">View ESG DD Reports</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                ESG CAP
              </CardTitle>
              <CardDescription>Manage ESG corrective action plans</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track and manage corrective action plans generated from ESG due diligence, 
                including timelines, responsibilities, and completion status.
              </p>
              <Button asChild className="w-full">
                <Link to="/esg-dd/cap">View ESG CAP</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Information Request List
              </CardTitle>
              <CardDescription>Complete comprehensive information requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Fill out detailed information request forms for ESG due diligence 
                covering all aspects of your business operations.
              </p>
              <Button asChild className="w-full">
                <Link to="/esg-dd/irl">View IRL</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default ESGDDPage;
