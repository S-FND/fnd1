
import React, { useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, FileSearch, Database, Plus, ArrowRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { logger } from '@/hooks/logger';

const ESGDDPage = () => {
  logger.debug('Rendering ESGDDPage component');
  const { isLoading } = useRouteProtection(['admin', 'manager', 'employee']);
  const { user, isAuthenticated, isAuthenticatedStatus } = useAuth();
  const navigate = useNavigate();
  const [showNewESGDD, setShowNewESGDD] = useState(false);
  const [selectedType, setSelectedType] = useState<'manual' | 'automated'>('manual');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
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
      <div style={{ marginTop: '18px' }}>
          <h1 className="text-2xl font-bold tracking-tight">ESG Due Diligence</h1>
          <p className="text-muted-foreground">
            Create, manage, and track ESG due diligence assessments and corrective action plans.
          </p>
        </div>
        {/* <Button onClick={() => setShowNewESGDD(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New ESG DD
          </Button> */}

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {/* Card 1: ESG DD Reports */}
          <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FileSearch className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-lg font-semibold">ESG DD Reports</CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm">
                View and manage all ESG due diligence reports
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Access all your ESG due diligence reports, both manual and automated,
                with filtering and search capabilities.
              </p>
              <Button asChild className="w-full mt-4 gap-2 group-hover:bg-primary/90">
                <Link to="/esg-dd/reports">
                  View ESG DD Reports
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: ESG CAP */}
          <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Database className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-lg font-semibold">ESG CAP</CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm">
                Manage ESG corrective action plans
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track and manage corrective action plans generated from ESG due diligence,
                including timelines, responsibilities, and completion status.
              </p>
              <Button asChild className="w-full mt-4 gap-2 group-hover:bg-primary/90">
                <Link to="/esg-dd/cap">
                  View ESG CAP
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: Information Request List */}
          <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-lg font-semibold">Information Request List</CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm">
                Complete comprehensive information requests
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fill out detailed information request forms for ESG due diligence
                covering all aspects of your business operations.
              </p>
              <Button asChild className="w-full mt-4 gap-2 group-hover:bg-primary/90">
                <Link to="/esg-dd/irl">
                  View IRL
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default ESGDDPage;
