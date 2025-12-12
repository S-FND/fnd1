import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock, FileText, BarChart3, Flame, Building2, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ApprovalWorkflowDialog } from '@/components/ghg/ApprovalWorkflowDialog';
import { toast } from 'sonner';

interface PendingItem {
  id: string;
  type: 'ghg_activity' | 'esms_document' | 'esg_metric';
  module: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: string;
  facility?: string;
  scope?: string;
  category?: string;
}

interface GHGActivityData {
  id: string;
  source_id: string;
  period_name: string;
  activity_value: number;
  activity_unit: string;
  calculated_emissions: number;
  status: string;
  created_at: string;
  created_by: string;
  ghg_sources: {
    source_name: string;
    scope: string;
    category: string;
    facility_id: string | null;
    facilities?: {
      name: string;
    } | null;
  };
}

const PendingApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [facilities, setFacilities] = useState<{ id: string; name: string }[]>([]);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingItems();
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    const { data } = await supabase
      .from('facilities')
      .select('id, name')
      .eq('is_active', true);
    
    if (data) {
      setFacilities(data);
    }
  };

  const fetchPendingItems = async () => {
    setLoading(true);
    try {
      // Fetch GHG activity data pending verification
      const { data: ghgData, error: ghgError } = await supabase
        .from('ghg_activity_data')
        .select(`
          id,
          source_id,
          period_name,
          activity_value,
          activity_unit,
          calculated_emissions,
          status,
          created_at,
          created_by,
          ghg_sources!inner (
            source_name,
            scope,
            category,
            facility_id,
            facilities (
              name
            )
          )
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });

      if (ghgError) {
        console.error('Error fetching GHG data:', ghgError);
      }

      const items: PendingItem[] = [];

      // Process GHG activity data
      if (ghgData) {
        (ghgData as unknown as GHGActivityData[]).forEach((item) => {
          items.push({
            id: item.id,
            type: 'ghg_activity',
            module: 'GHG Accounting',
            title: item.ghg_sources.source_name,
            description: `${item.period_name} - ${item.activity_value} ${item.activity_unit} (${item.calculated_emissions.toFixed(2)} tCO2e)`,
            submittedBy: item.created_by,
            submittedAt: item.created_at,
            status: item.status,
            facility: item.ghg_sources.facilities?.name || 'Not specified',
            scope: item.ghg_sources.scope,
            category: item.ghg_sources.category,
          });
        });
      }

      // Fetch ESMS documents pending review (if any have a review workflow)
      const { data: esmsData } = await supabase
        .from('esms_documents')
        .select('*')
        .eq('is_uploaded', true)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (esmsData) {
        esmsData.forEach((doc) => {
          items.push({
            id: doc.id,
            type: 'esms_document',
            module: 'ESMS',
            title: doc.title,
            description: doc.file_name || 'Document uploaded',
            submittedBy: doc.user_id,
            submittedAt: doc.updated_at,
            status: 'uploaded',
            category: doc.section_id,
          });
        });
      }

      // Fetch approval requests
      const { data: approvalData } = await supabase
        .from('approval_requests')
        .select('*')
        .in('status', ['pending_review', 'in_review'])
        .order('submitted_at', { ascending: false });

      if (approvalData) {
        approvalData.forEach((req) => {
          items.push({
            id: req.id,
            type: 'esg_metric',
            module: formatModuleName(req.module),
            title: req.record_type,
            description: req.change_summary || 'Pending approval',
            submittedBy: req.maker_id,
            submittedAt: req.submitted_at || req.created_at,
            status: req.status,
            category: req.module,
          });
        });
      }

      setPendingItems(items);
    } catch (error) {
      console.error('Error fetching pending items:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const formatModuleName = (module: string): string => {
    const moduleMap: Record<string, string> = {
      'esg_metrics': 'ESG Metrics',
      'esg_cap': 'ESG CAP',
      'ghg_accounting': 'GHG Accounting',
      'brsr_report': 'BRSR Report',
      'esg_dd': 'ESG DD',
    };
    return moduleMap[module] || module;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'pending_review':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'in_review':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20"><FileText className="h-3 w-3 mr-1" /> In Review</Badge>;
      case 'verified':
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'scope_1':
        return <Flame className="h-4 w-4 text-orange-500" />;
      case 'scope_2':
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'scope_3':
        return <Building2 className="h-4 w-4 text-purple-500" />;
      case 'scope_4':
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const formatScopeName = (scope: string) => {
    return scope.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleReviewClick = (item: PendingItem) => {
    if (item.type === 'ghg_activity') {
      setSelectedActivityId(item.id);
      setApprovalDialogOpen(true);
    } else {
      toast.info('Review functionality for this module is coming soon');
    }
  };

  const filteredItems = pendingItems.filter(item => {
    if (selectedModule !== 'all' && item.module !== selectedModule) return false;
    if (selectedFacility !== 'all' && item.facility !== selectedFacility) return false;
    if (selectedScope !== 'all' && item.scope !== selectedScope) return false;
    return true;
  });

  const ghgItems = filteredItems.filter(item => item.module === 'GHG Accounting');
  const esmsItems = filteredItems.filter(item => item.module === 'ESMS');
  const esgMetricsItems = filteredItems.filter(item => item.module === 'ESG Metrics');
  const otherItems = filteredItems.filter(item => !['GHG Accounting', 'ESMS', 'ESG Metrics'].includes(item.module));

  // Group GHG items by scope
  const ghgByScope = {
    scope_1: ghgItems.filter(i => i.scope === 'scope_1'),
    scope_2: ghgItems.filter(i => i.scope === 'scope_2'),
    scope_3: ghgItems.filter(i => i.scope === 'scope_3'),
    scope_4: ghgItems.filter(i => i.scope === 'scope_4'),
  };

  // Group GHG items by facility
  const ghgByFacility = ghgItems.reduce((acc, item) => {
    const facility = item.facility || 'Not specified';
    if (!acc[facility]) acc[facility] = [];
    acc[facility].push(item);
    return acc;
  }, {} as Record<string, PendingItem[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve pending data entries and documents
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold">{pendingItems.length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">GHG Accounting</p>
                <p className="text-2xl font-bold">{ghgItems.length}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ESMS Documents</p>
                <p className="text-2xl font-bold">{esmsItems.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ESG Metrics</p>
                <p className="text-2xl font-bold">{esgMetricsItems.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="GHG Accounting">GHG Accounting</SelectItem>
                <SelectItem value="ESMS">ESMS</SelectItem>
                <SelectItem value="ESG Metrics">ESG Metrics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedFacility} onValueChange={setSelectedFacility}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Facilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                {facilities.map(f => (
                  <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedScope} onValueChange={setSelectedScope}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Scopes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes</SelectItem>
                <SelectItem value="scope_1">Scope 1</SelectItem>
                <SelectItem value="scope_2">Scope 2</SelectItem>
                <SelectItem value="scope_3">Scope 3</SelectItem>
                <SelectItem value="scope_4">Scope 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="by-module" className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-module">By Module</TabsTrigger>
          <TabsTrigger value="by-facility">By Facility</TabsTrigger>
          <TabsTrigger value="by-scope">By Scope (GHG)</TabsTrigger>
        </TabsList>

        <TabsContent value="by-module" className="space-y-4">
          {/* GHG Accounting Section */}
          {ghgItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  GHG Accounting
                </CardTitle>
                <CardDescription>{ghgItems.length} items pending approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ghgItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        {getScopeIcon(item.scope || '')}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{formatScopeName(item.scope || '')}</Badge>
                            <Badge variant="secondary" className="text-xs">{item.facility}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Submitted {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(item.status)}
                        <Button size="sm" onClick={() => handleReviewClick(item)}>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ESMS Section */}
          {esmsItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  ESMS Documents
                </CardTitle>
                <CardDescription>{esmsItems.length} documents uploaded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {esmsItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <span className="text-xs text-muted-foreground">
                          Uploaded {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(item.status)}
                        <Button size="sm" variant="outline" onClick={() => handleReviewClick(item)}>
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ESG Metrics Section */}
          {esgMetricsItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  ESG Metrics
                </CardTitle>
                <CardDescription>{esgMetricsItems.length} items pending approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {esgMetricsItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <span className="text-xs text-muted-foreground">
                          Submitted {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(item.status)}
                        <Button size="sm" onClick={() => handleReviewClick(item)}>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other Modules */}
          {otherItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Other Modules</CardTitle>
                <CardDescription>{otherItems.length} items pending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {otherItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.module} - {item.description}</p>
                        <span className="text-xs text-muted-foreground">
                          Submitted {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(item.status)}
                        <Button size="sm" onClick={() => handleReviewClick(item)}>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">All caught up!</h3>
                <p className="text-muted-foreground">No pending approvals at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="by-facility" className="space-y-4">
          {Object.entries(ghgByFacility).map(([facility, items]) => (
            <Card key={facility}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {facility}
                </CardTitle>
                <CardDescription>{items.length} items pending approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        {getScopeIcon(item.scope || '')}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{formatScopeName(item.scope || '')}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Submitted {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(item.status)}
                        <Button size="sm" onClick={() => handleReviewClick(item)}>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(ghgByFacility).length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No facility-based items</h3>
                <p className="text-muted-foreground">No GHG accounting items pending approval.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="by-scope" className="space-y-4">
          {(['scope_1', 'scope_2', 'scope_3', 'scope_4'] as const).map(scope => {
            const scopeItems = ghgByScope[scope];
            if (scopeItems.length === 0) return null;
            
            return (
              <Card key={scope}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getScopeIcon(scope)}
                    {formatScopeName(scope)}
                  </CardTitle>
                  <CardDescription>{scopeItems.length} items pending approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scopeItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{item.facility}</Badge>
                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Submitted {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(item.status)}
                          <Button size="sm" onClick={() => handleReviewClick(item)}>
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {ghgItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No GHG items pending</h3>
                <p className="text-muted-foreground">All GHG accounting items have been reviewed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <ApprovalWorkflowDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        activityDataId={selectedActivityId || ''}
        onSuccess={() => {
          fetchPendingItems();
          setSelectedActivityId(null);
        }}
      />
    </div>
  );
};

export default PendingApprovalsPage;
