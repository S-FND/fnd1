import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock, FileText, BarChart3, Flame, Building2, Filter, Target, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ApprovalWorkflowDialog } from '@/components/ghg/ApprovalWorkflowDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ApprovalItem {
  id: string;
  type: 'ghg_activity' | 'esms_document' | 'esg_metric' | 'esg_dd' | 'sdg';
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
  link?: string;
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (user?.email) {
        await fetchUserProfile();
      }
      await fetchApprovalItems();
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

      if (ghgData) {
        const ghgDataTyped = ghgData as unknown as GHGActivityData[];
        const filteredGhgData = userProfileId 
          ? ghgDataTyped.filter(item => {
              const verifiers = item.ghg_sources?.assigned_verifiers || [];
              return verifiers.includes(userProfileId);
            })
          : ghgDataTyped;

        filteredGhgData.forEach((item) => {
          const scopeNumber = item.ghg_sources.scope.replace(/[^0-9]/g, '');
          items.push({
            id: item.id,
            type: 'ghg_activity',
            module: 'GHG',
            title: `${item.ghg_sources.source_name} - ${item.period_name}`,
            description: `${item.activity_value} ${item.activity_unit} (${item.calculated_emissions.toFixed(2)} tCO2e)`,
            submittedBy: item.created_by,
            submittedAt: item.created_at,
            status: item.status,
            priority: 'medium',
            facility: item.ghg_sources.facilities?.name || 'Not specified',
            scope: `Scope ${scopeNumber}`,
            category: item.ghg_sources.category,
            link: `/ghg-accounting/data-entry?source=${item.source_id}`,
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
            link: `/esms/${doc.section_id}`,
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
          const module = formatModuleName(req.module);
          let link = '/dashboard';
          let scope: string | undefined;
          
          // Determine link and scope based on module
          if (req.module === 'esg_metrics') {
            link = '/esg-metrics';
          } else if (req.module === 'esg_dd') {
            link = '/esg-dd';
          } else if (req.module === 'ghg_accounting') {
            link = '/ghg-accounting';
            // Extract scope from current_data if available
            const data = req.current_data as Record<string, any>;
            if (data?.scope) {
              scope = data.scope;
            }
          } else if (req.module === 'brsr_report') {
            link = '/brsr-report';
          } else if (req.module === 'esg_cap') {
            link = '/esg-cap';
          }

          items.push({
            id: req.id,
            type: req.module === 'esg_dd' ? 'esg_dd' : 'esg_metric',
            module: module,
            title: req.record_type,
            description: req.change_summary || 'Pending approval',
            submittedBy: req.maker_id,
            submittedAt: req.submitted_at || req.created_at,
            status: req.status,
            priority: req.priority as 'low' | 'medium' | 'high' | 'critical',
            category: req.module,
            dueDate: req.due_at,
            link,
            scope,
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
      'ghg_accounting': 'GHG',
      'brsr_report': 'BRSR Report',
      'esg_dd': 'ESG DD',
    };
    return moduleMap[module] || module;
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

  const getModuleBadge = (module: string) => {
    const colors: Record<string, string> = {
      'GHG': 'bg-orange-100 text-orange-800 border-orange-200',
      'ESG Metrics': 'bg-green-100 text-green-800 border-green-200',
      'ESMS': 'bg-blue-100 text-blue-800 border-blue-200',
      'ESG DD': 'bg-purple-100 text-purple-800 border-purple-200',
      'SDG Metrics': 'bg-teal-100 text-teal-800 border-teal-200',
    };
    return <Badge variant="outline" className={colors[module] || 'bg-gray-100 text-gray-800'}>{module}</Badge>;
  };

  const handleReviewClick = (item: ApprovalItem) => {
    if (item.type === 'ghg_activity') {
      setSelectedActivityId(item.id);
      setApprovalDialogOpen(true);
    } else if (item.link) {
      navigate(item.link);
    } else {
      toast.info('Review functionality for this module is coming soon');
    }
  };

  const handleQuickApprove = async (item: ApprovalItem) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (item.type === 'ghg_activity') {
        const { error } = await supabase
          .from('ghg_activity_data')
          .update({
            status: 'verified',
            verified_by: user.id,
            verified_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (error) throw error;
      } else if (item.type === 'esg_metric' || item.type === 'esg_dd') {
        const { error } = await supabase
          .from('approval_requests')
          .update({
            status: 'approved',
            approved_at: new Date().toISOString(),
            approver_id: user.id,
          })
          .eq('id', item.id);

        if (error) throw error;
      }

      toast.success('Approved successfully');
      fetchApprovalItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleQuickReject = async (item: ApprovalItem) => {
    if (item.type === 'ghg_activity') {
      setSelectedActivityId(item.id);
      setApprovalDialogOpen(true);
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
          .from('approval_requests')
          .update({
            status: 'rejected',
            reviewed_at: new Date().toISOString(),
            assigned_checker_id: user.id,
          })
          .eq('id', item.id);

        if (error) throw error;

        toast.success('Rejected');
        fetchApprovalItems();
      } catch (error: any) {
        toast.error(error.message || 'Failed to reject');
      }
    }
  };

  const filteredItems = approvalItems.filter(item => {
    if (selectedModule !== 'all' && item.module !== selectedModule) return false;
    if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
    if (selectedScope !== 'all') {
      if (!item.scope) return false;
      if (!item.scope.toLowerCase().includes(selectedScope.replace('scope_', ''))) return false;
    }
    return true;
  });

  // Count stats
  const criticalCount = approvalItems.filter(item => item.priority === 'critical').length;
  const highCount = approvalItems.filter(item => item.priority === 'high').length;
  const overdueCount = approvalItems.filter(item => item.dueDate && new Date(item.dueDate) < new Date()).length;
  const ghgCount = approvalItems.filter(item => item.module === 'GHG').length;

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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold">{approvalItems.length}</p>
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
                <p className="text-2xl font-bold">{ghgCount}</p>
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
                <SelectItem value="ESG Metrics">ESG Metrics</SelectItem>
                <SelectItem value="GHG">GHG</SelectItem>
                <SelectItem value="ESMS">ESMS</SelectItem>
                <SelectItem value="ESG DD">ESG DD</SelectItem>
                <SelectItem value="SDG Metrics">SDG Metrics</SelectItem>
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
                <SelectValue placeholder="All Scopes (GHG)" />
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

      {/* Approvals Table */}
      {filteredItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
            <CardDescription>
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} requiring your verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">S.No</TableHead>
                  <TableHead className="w-[120px]">Module</TableHead>
                  <TableHead className="w-[100px]">Priority</TableHead>
                  <TableHead>Verification Title</TableHead>
                  <TableHead className="w-[100px]">Scope</TableHead>
                  <TableHead className="w-[80px]">Link</TableHead>
                  <TableHead className="w-[160px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{getModuleBadge(item.module)}</TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                          {item.dueDate && new Date(item.dueDate) < new Date() && (
                            <Badge variant="destructive" className="ml-2 text-xs">Overdue</Badge>
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.module === 'GHG' && item.scope ? (
                        <Badge variant="outline" className="text-xs">
                          {item.scope}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.link && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(item.link!)}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleQuickApprove(item)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleQuickReject(item)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
