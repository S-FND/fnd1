

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';

import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Navigate } from 'react-router-dom';
import { GHGScope1Form } from '../components/ghg/GHGScope1Form';
import { GHGScope2Form } from '../components/ghg/GHGScope2Form';
import { GHGScope3Form } from '../components/ghg/GHGScope3Form';
import GHGScope4Form from '../components/ghg/GHGScope4Form';
import { GHGSummary } from '../components/ghg/GHGSummary';
import { GHGDataAssignment } from '../components/ghg/GHGDataAssignment';
import { companyInfo } from '../components/ghg/summary/mockData';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';

export type GHGScope =
  | 'scope1Sources'
  | 'scope2Sources'
  | 'scope3Sources'
  | 'scope4Sources';

export interface GHGSource {
  id: string;
  access: 'data-collector' | 'data-verifier';
}

type ScopeSource = {
  id: string;
  access: 'data-collector' | 'data-verifier';
};

type ScopeAccessData = {
  scope1Sources?: ScopeSource[];
  scope2Sources?: ScopeSource[];
  scope3Sources?: ScopeSource[];
  scope4Sources?: ScopeSource[];
};

type ScopeAccessState = {
  scope1: boolean;
  scope2: boolean;
  scope3: boolean;
  scope4: boolean;
};

export type AssignedGHGSources = Record<GHGScope, GHGSource[]>;

const GHGAccountingPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin', 'employee']);
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("summary");
  const [isParent, setIsParent] = useState(false);

  const [assignedSources, setAssignedSources] = useState<AssignedGHGSources>({
    scope1Sources: [],
    scope2Sources: [],
    scope3Sources: [],
    scope4Sources: [],
  });

  const hasCollectorAccess = (sources?: ScopeSource[]) =>
    Array.isArray(sources)
      ? sources.some(src => src.access === 'data-collector')
      : false;


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin' && user?.role !== 'employee')) {
    return <Navigate to="/" />;
  }

  const isUnitAdmin = user?.role === 'unit_admin';
  const unitName = isUnitAdmin && user?.units?.find(unit => unit.id === user?.unitId)?.name;

  useEffect(() => {
    // You can set the default active tab based on user role or other criteria
    let user = localStorage.getItem('fandoro-user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsParent(parsedUser.isParent || false);
      if (parsedUser.assignedSource) {
        console.log("Assigned Sources:", parsedUser.assignedSource);
        setAssignedSources(parsedUser.assignedSource);
      }

    }
  }, []);

  const [scopeAccess, setScopeAccess] = useState<ScopeAccessState>({
    scope1: false,
    scope2: false,
    scope3: false,
    scope4: false
  });
  useEffect(() => {
    if (!assignedSources) return;

    setScopeAccess({
      scope1: hasCollectorAccess(assignedSources.scope1Sources),
      scope2: hasCollectorAccess(assignedSources.scope2Sources),
      scope3: hasCollectorAccess(assignedSources.scope3Sources),
      scope4: hasCollectorAccess(assignedSources.scope4Sources),
    });
  }, [assignedSources]);

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">GHG Accounting</h1>
          <p className="text-muted-foreground">
            {isUnitAdmin
              ? `Manage carbon emissions data for ${unitName || 'your unit'}.`
              : `Manage enterprise-wide carbon emissions for ${companyInfo.name}.`}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Company Overview</CardTitle>
            <CardDescription>Key information about IMR Resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium">Headquarters</h3>
                <p className="text-sm text-muted-foreground">{companyInfo.headquarters}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Established</h3>
                <p className="text-sm text-muted-foreground">{companyInfo.established}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Operations</h3>
                <p className="text-sm text-muted-foreground">{companyInfo.operations.join(", ")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Annual Trading Volume</h3>
                <p className="text-sm text-muted-foreground">{companyInfo.annualTradingVolume}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Business Units</h3>
                <p className="text-sm text-muted-foreground">{companyInfo.businessUnits.length} units across {companyInfo.operations.length} countries</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Total Employees</h3>
                <p className="text-sm text-muted-foreground">
                  {companyInfo.businessUnits.reduce((sum, unit) => sum + unit.employees, 0)} employees
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="summary">Summary</TabsTrigger> 
            {/* //{isParent ? " (Parent)" : ""} */}
            {/* {!isParent && assignedSources && assignedSources.scope1Sources && assignedSources.scope1Sources.length>0 && <TabsTrigger value="scope1">Scope 1</TabsTrigger>}
            {!isParent && assignedSources && assignedSources.scope2Sources && assignedSources.scope2Sources.length>0 && <TabsTrigger value="scope2">Scope 2</TabsTrigger>}
            {!isParent && assignedSources && assignedSources.scope3Sources && assignedSources.scope3Sources.length>0 && <TabsTrigger value="scope3">Scope 3</TabsTrigger>}
            {!isParent && assignedSources && assignedSources.scope4Sources && assignedSources.scope4Sources.length>0 && <TabsTrigger value="scope4">Scope 4</TabsTrigger>} */}
            {(isParent || scopeAccess?.scope1) && (
              <TabsTrigger value="scope1">Scope 1</TabsTrigger>
            )}

            {(isParent || scopeAccess?.scope2) && (
              <TabsTrigger value="scope2">Scope 2</TabsTrigger>
            )}

            {(isParent ||scopeAccess?.scope3) && (
              <TabsTrigger value="scope3">Scope 3</TabsTrigger>
            )}

            {(isParent || scopeAccess?.scope4) && (
              <TabsTrigger value="scope4">Scope 4</TabsTrigger>
            )}
            {/* <TabsTrigger value="assignments">Assignments</TabsTrigger> */}
          </TabsList>

          <TabsContent value="summary" className="mt-6">
            <GHGSummary />
          </TabsContent>

          <TabsContent value="scope1" className="mt-6">
            <GHGScope1Form currentAccess={assignedSources.scope1Sources} isParent={isParent} />
          </TabsContent>

          <TabsContent value="scope2" className="mt-6">
            <GHGScope2Form currentAccess={assignedSources.scope2Sources} isParent={isParent} />
          </TabsContent>

          <TabsContent value="scope3" className="mt-6">
            <GHGScope3Form currentAccess={assignedSources.scope3Sources} isParent={isParent} />
          </TabsContent>

          <TabsContent value="scope4" className="mt-6">
            <GHGScope4Form currentAccess={assignedSources.scope4Sources} isParent={isParent} />
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
            <GHGDataAssignment />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedSidebarLayout>

  );
};

export default GHGAccountingPage;
