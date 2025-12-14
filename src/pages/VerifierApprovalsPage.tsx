import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock, FileText, BarChart3, Flame, Building2, Filter, Target, Shield, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ApprovalWorkflowDialog } from '@/components/ghg/ApprovalWorkflowDialog';
import { toast } from 'sonner';

interface ApprovalItem {
  id: string;
  type: 'ghg_activity' | 'esms_document' | 'esg_metric' | 'audit' | 'sdg';
  module: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedByName?: string;
  submittedAt: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  facility?: string;
  scope?: string;
  category?: string;
  dueDate?: string;
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
    assigned_verifiers: string[] | null;
    facilities?: {
      name: string;
    } | null;
  };
}

const VerifierApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [facilities, setFacilities] = useState<{ id: string; name: string }[]>([]);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (user?.email) {
        await fetchUserProfile();
      }
      // Always fetch approval items after profile attempt
      await fetchApprovalItems();
      await fetchFacilities();
    };
    init();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user?.email) return;
    
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('email', user.email)
        .maybeSingle();
      
      if (data?.user_id) {
        setUserProfileId(data.user_id);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchFacilities = async () => {
    const { data } = await supabase
      .from('facilities')
      .select('id, name')
      .eq('is_active', true);
    
    if (data) {
      setFacilities(data);
    }
  };

  const fetchApprovalItems = async () => {
    setLoading(true);
    try {
      const items: ApprovalItem[] = [];

      // Fetch GHG activity data with status 'submitted'
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
            assigned_verifiers,
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

      // Filter GHG data to items where user is assigned verifier (if userProfileId exists)
      // For admins/managers, show all submitted data
      if (ghgData) {
        const ghgDataTyped = ghgData as unknown as GHGActivityData[];
        const filteredGhgData = userProfileId 
          ? ghgDataTyped.filter(item => {
              const verifiers = item.ghg_sources?.assigned_verifiers || [];
              return verifiers.includes(userProfileId);
            })
          : ghgDataTyped; // Show all for admins without profile

        filteredGhgData.forEach((item) => {
          items.push({
            id: item.id,
            type: 'ghg_activity',
            module: 'GHG Accounting',
            title: item.ghg_sources.source_name,
            description: `${item.period_name} - ${item.activity_value} ${item.activity_unit} (${item.calculated_emissions.toFixed(2)} tCO2e)`,
            submittedBy: item.created_by,
            submittedAt: item.created_at,
            status: item.status,
            priority: 'medium',
            facility: item.ghg_sources.facilities?.name || 'Not specified',
            scope: item.ghg_sources.scope,
            category: item.ghg_sources.category,
          });
        });
      }

      // Fetch ESMS documents pending review
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
            status: 'pending_review',
            priority: 'medium',
            category: doc.section_id,
          });
        });
      }

      // Fetch approval requests assigned to this user
      const { data: approvalData } = await supabase
        .from('approval_requests')
        .select('*')
        .or(`assigned_checker_id.eq.${userProfileId},approver_id.eq.${userProfileId}`)
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
            priority: req.priority as 'low' | 'medium' | 'high' | 'critical',
            category: req.module,
            dueDate: req.due_at,
          });
        });
      }

      setApprovalItems(items);
    } catch (error) {
      console.error('Error fetching approval items:', error);
      toast.error('Failed to load approval items');
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-500 text-white">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 text-white">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
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

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'GHG Accounting':
        return <Flame className="h-5 w-5 text-orange-500" />;
      case 'ESMS':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'ESG Metrics':
        return <BarChart3 className="h-5 w-5 text-green-500" />;
      case 'ESG DD':
        return <Shield className="h-5 w-5 text-purple-500" />;
      case 'SDG':
        return <Target className="h-5 w-5 text-teal-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatScopeName = (scope: string) => {
    return scope.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleReviewClick = (item: ApprovalItem) => {
    if (item.type === 'ghg_activity') {
      setSelectedActivityId(item.id);
      setApprovalDialogOpen(true);
    } else {
      toast.info('Review functionality for this module is coming soon');
    }
  };

  const handleQuickApprove = async (item: ApprovalItem) => {
    if (item.type !== 'ghg_activity') {
      toast.info('Quick approve is only available for GHG data');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('ghg_activity_data')
        .update({
          status: 'verified',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (error) throw error;

      toast.success('Data approved successfully');
      fetchApprovalItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleQuickReject = async (item: ApprovalItem) => {
    // For reject, open the dialog to require a comment
    if (item.type === 'ghg_activity') {
      setSelectedActivityId(item.id);
      setApprovalDialogOpen(true);
    }
  };

  const filteredItems = approvalItems.filter(item => {
    if (selectedModule !== 'all' && item.module !== selectedModule) return false;
    if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
    if (selectedScope !== 'all' && item.scope !== selectedScope) return false;
    return true;
  });

  // Group items by module
  const itemsByModule = filteredItems.reduce((acc, item) => {
    if (!acc[item.module]) acc[item.module] = [];
    acc[item.module].push(item);
    return acc;
  }, {} as Record<string, ApprovalItem[]>);

  // Group GHG items by scope
  const ghgItems = filteredItems.filter(item => item.module === 'GHG Accounting');
  const ghgByScope = {
    scope_1: ghgItems.filter(i => i.scope === 'scope_1'),
    scope_2: ghgItems.filter(i => i.scope === 'scope_2'),
    scope_3: ghgItems.filter(i => i.scope === 'scope_3'),
    scope_4: ghgItems.filter(i => i.scope === 'scope_4'),
  };

  // Count overdue items
  const overdueCount = filteredItems.filter(item => 
    item.dueDate && new Date(item.dueDate) < new Date()
  ).length;

  // Count by priority
  const criticalCount = filteredItems.filter(item => item.priority === 'critical').length;
  const highCount = filteredItems.filter(item => item.priority === 'high').length;

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
        <h1 className="text-3xl font-bold tracking-tight">Approvals to be Done</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve data submissions assigned to you
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold">{filteredItems.length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">{highCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">{overdueCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">GHG Data</p>
                <p className="text-2xl font-bold">{ghgItems.length}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
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
                <SelectItem value="ESG DD">ESG DD</SelectItem>
                <SelectItem value="SDG">SDG</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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
            <Button variant="outline" size="sm" onClick={fetchApprovalItems}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">All caught up!</h3>
            <p className="text-muted-foreground">You have no pending approvals at this time.</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      {filteredItems.length > 0 && (
        <Tabs defaultValue="by-module" className="space-y-4">
          <TabsList>
            <TabsTrigger value="by-module">By Module</TabsTrigger>
            <TabsTrigger value="by-scope">By Scope (GHG)</TabsTrigger>
            <TabsTrigger value="by-priority">By Priority</TabsTrigger>
          </TabsList>

          <TabsContent value="by-module" className="space-y-4">
            {Object.entries(itemsByModule).map(([module, items]) => (
              <Card key={module}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getModuleIcon(module)}
                    {module}
                  </CardTitle>
                  <CardDescription>{items.length} items pending your approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          {item.scope && getScopeIcon(item.scope)}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{item.title}</p>
                              {getPriorityBadge(item.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {item.scope && <Badge variant="outline" className="text-xs">{formatScopeName(item.scope)}</Badge>}
                              {item.facility && <Badge variant="secondary" className="text-xs">{item.facility}</Badge>}
                              <span className="text-xs text-muted-foreground">
                                Submitted {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                              </span>
                              {item.dueDate && new Date(item.dueDate) < new Date() && (
                                <Badge variant="destructive" className="text-xs">Overdue</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          {item.type === 'ghg_activity' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={(e) => { e.stopPropagation(); handleQuickApprove(item); }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => { e.stopPropagation(); handleQuickReject(item); }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
          </TabsContent>

          <TabsContent value="by-scope" className="space-y-4">
            {Object.entries(ghgByScope).map(([scope, items]) => {
              if (items.length === 0) return null;
              return (
                <Card key={scope}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getScopeIcon(scope)}
                      {formatScopeName(scope)}
                    </CardTitle>
                    <CardDescription>{items.length} GHG entries pending approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{item.title}</p>
                              {getPriorityBadge(item.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                              {item.facility && <Badge variant="outline" className="text-xs">{item.facility}</Badge>}
                              <span className="text-xs text-muted-foreground">
                                Submitted {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          {item.type === 'ghg_activity' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={(e) => { e.stopPropagation(); handleQuickApprove(item); }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => { e.stopPropagation(); handleQuickReject(item); }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No GHG data pending your approval</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="by-priority" className="space-y-4">
            {['critical', 'high', 'medium', 'low'].map(priority => {
              const items = filteredItems.filter(i => i.priority === priority);
              if (items.length === 0) return null;
              return (
                <Card key={priority}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getPriorityBadge(priority)}
                      <span className="ml-2 capitalize">{priority} Priority</span>
                    </CardTitle>
                    <CardDescription>{items.length} items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            {getModuleIcon(item.module)}
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{item.module}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  Submitted {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(item.status)}
                            {item.type === 'ghg_activity' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={(e) => { e.stopPropagation(); handleQuickApprove(item); }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={(e) => { e.stopPropagation(); handleQuickReject(item); }}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
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
          </TabsContent>
        </Tabs>
      )}

      {/* Approval Dialog */}
      <ApprovalWorkflowDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        activityDataId={selectedActivityId}
        onSuccess={() => {
          fetchApprovalItems();
          setApprovalDialogOpen(false);
        }}
      />
    </div>
  );
};

export default VerifierApprovalsPage;
