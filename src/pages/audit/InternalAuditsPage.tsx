
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Plus, Building2, FileText, Users, TrendingUp } from 'lucide-react';

const InternalAuditsPage = () => {
  const { isAuthenticated, isCompanyUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isCompanyUser()) {
    return <Navigate to="/dashboard" />;
  }

  const internalAudits = [
    {
      id: 'int-1',
      title: 'ESG Governance Assessment',
      department: 'Corporate Governance',
      status: 'completed',
      findings: 12,
      date: '2024-03-20',
      auditor: 'Internal Audit Team'
    },
    {
      id: 'int-2',
      title: 'Carbon Footprint Verification',
      department: 'Sustainability',
      status: 'in_progress',
      findings: 5,
      date: '2024-04-05',
      auditor: 'ESG Team'
    },
    {
      id: 'int-3',
      title: 'Supply Chain Ethics Review',
      department: 'Procurement',
      status: 'planned',
      findings: 0,
      date: '2024-04-20',
      auditor: 'Compliance Team'
    },
    {
      id: 'int-4',
      title: 'Diversity & Inclusion Audit',
      department: 'Human Resources',
      status: 'completed',
      findings: 8,
      date: '2024-03-10',
      auditor: 'HR Audit Team'
    }
  ];

  const filteredAudits = internalAudits.filter(audit => 
    audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search internal audits..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Audit
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Audit Reports
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {internalAudits.filter(a => a.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently ongoing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {internalAudits.filter(a => a.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {internalAudits.reduce((sum, audit) => sum + audit.findings, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all audits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Under audit scope</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Audits</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="planned">Planned</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <AuditList audits={filteredAudits} />
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <AuditList audits={filteredAudits.filter(a => a.status === 'completed')} />
            </TabsContent>

            <TabsContent value="in_progress" className="mt-4">
              <AuditList audits={filteredAudits.filter(a => a.status === 'in_progress')} />
            </TabsContent>

            <TabsContent value="planned" className="mt-4">
              <AuditList audits={filteredAudits.filter(a => a.status === 'planned')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const AuditList: React.FC<{audits: any[]}> = ({ audits }) => {
  if (audits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">No audits found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {audits.map((audit) => (
        <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="font-medium">{audit.title}</h3>
              <p className="text-sm text-muted-foreground">
                {audit.department} • {audit.auditor}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{audit.date}</p>
              <p className="text-sm text-muted-foreground">
                {audit.findings} finding{audit.findings !== 1 ? 's' : ''}
              </p>
            </div>
            <InternalStatusBadge status={audit.status} />
          </div>
        </div>
      ))}
    </div>
  );
};

const InternalStatusBadge: React.FC<{status: string}> = ({status}) => {
  let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
  let label = "";
  
  switch (status) {
    case 'completed':
      variant = "default";
      label = "Completed";
      break;
    case 'in_progress':
      variant = "secondary";
      label = "In Progress";
      break;
    case 'planned':
      variant = "outline";
      label = "Planned";
      break;
  }
  
  return <Badge variant={variant}>{label}</Badge>;
};

export default InternalAuditsPage;
