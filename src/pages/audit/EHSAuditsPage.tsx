
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Plus, Calendar, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { logger } from '@/hooks/logger';

const EHSAuditsPage = () => {
  logger.debug('Rendering EHSAuditsPage component');
  const { isAuthenticated, isCompanyUser,isAuthenticatedStatus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  if (!isCompanyUser()) {
    return <Navigate to="/dashboard" />;
  }

  const ehsAudits = [
    {
      id: 'ehs-1',
      title: 'Safety Management System Audit',
      location: 'Mumbai Factory',
      status: 'completed',
      score: 85,
      date: '2024-03-15',
      auditor: 'Safety Consultant Ltd'
    },
    {
      id: 'ehs-2',
      title: 'Environmental Compliance Audit',
      location: 'Delhi Office',
      status: 'in_progress',
      score: null,
      date: '2024-04-01',
      auditor: 'Green Audit Associates'
    },
    {
      id: 'ehs-3',
      title: 'Health & Safety Training Audit',
      location: 'Bangalore Unit',
      status: 'scheduled',
      score: null,
      date: '2024-04-15',
      auditor: 'EHS Experts India'
    }
  ];

  const filteredAudits = ehsAudits.filter(audit => 
    audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EHS Audits</h1>
          <p className="text-muted-foreground">
            Environment, Health & Safety audit management and compliance tracking
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search EHS audits..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Audit
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ehsAudits.length}</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Average across all units</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>EHS Audit Schedule</CardTitle>
            <CardDescription>Track environment, health & safety audits across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Shield className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{audit.title}</h3>
                      <p className="text-sm text-muted-foreground">{audit.location} • {audit.auditor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{audit.date}</p>
                      {audit.score && (
                        <p className="text-sm text-muted-foreground">Score: {audit.score}%</p>
                      )}
                    </div>
                    <StatusBadge status={audit.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedSidebarLayout>
  );
};

const StatusBadge: React.FC<{status: string}> = ({status}) => {
  let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
  let label = "";
  let icon = null;
  
  switch (status) {
    case 'completed':
      variant = "default";
      label = "Completed";
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case 'in_progress':
      variant = "secondary";
      label = "In Progress";
      icon = <Calendar className="h-3 w-3 mr-1" />;
      break;
    case 'scheduled':
      variant = "outline";
      label = "Scheduled";
      icon = <Calendar className="h-3 w-3 mr-1" />;
      break;
  }
  
  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {label}
    </Badge>
  );
};

export default EHSAuditsPage;
