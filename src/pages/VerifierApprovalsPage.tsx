import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock, FileText, BarChart3, Flame, Building2, Filter, Target, Shield, AlertTriangle, ExternalLink, Settings, UserCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ApprovalWorkflowDialog } from '@/components/ghg/ApprovalWorkflowDialog';
import { ReviewApprovalDialog } from '@/components/verifier/ReviewApprovalDialog';
import { RejectApprovalDialog } from '@/components/verifier/RejectApprovalDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { VerificationSettingsCard } from '@/components/admin/VerificationSettingsCard';
import { VerifierAssignmentSelect } from '@/components/admin/VerifierAssignmentSelect';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { httpClient } from '@/lib/httpClient';
import { PageAccessContext } from '@/context/PageAccessContext';
import { PageOverlay } from '@/components/ui/page-overlay';
import { useOverlay } from '@/context/OverlayContext';

interface ApprovalItem {
  _id: string;
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
  assignedVerifierId?: string;
  assignedVerifierName?: string;
  dataCollectionId?: string;
}

interface Verifier {
  user_id: string;
  full_name: string | null;
  email: string;
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

export interface AssignedUser {
  _id: string;
  name: string;
  email: string;
}

export interface EvidenceFile {
  key: string;
  type: string;
  name: string;
}

export interface GHGDataCollection {
  _id: string;
  entityId: string;
  sourceTemplateId: string;

  reportingPeriod: string;
  reportingMonth: string;
  reportingYear: number;

  activityDataValue: number;

  emissionCO2: number;
  emissionCH4: number;
  emissionN2O: number;
  totalEmission: number;

  dataQuality: 'Low' | 'Medium' | 'High';

  collectedDate: string; // ISO date (YYYY-MM-DD)
  collectedBy: string;

  verifiedBy: string; // empty string when not verified
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';

  notes: string;

  evidenceFiles: EvidenceFile[];

  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  __v: number;
}

export interface GHGScopeItem {
  title?: string;
  link?: string;
  module?: string;
  type?: string;
  _id: string;
  entityId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  facilityName: string;
  sourceCategory: string;
  sourceDescription: string;
  sourceType: string;

  fuelType: string;
  measurementFrequency: 'Monthly' | 'Quarterly' | 'Yearly';

  dataCollections: GHGDataCollection;

  verifiers: AssignedUser[];
  collectors: AssignedUser[];

  scope: 'Scope 1' | 'Scope 2' | 'Scope 3' | 'Scope 4';
  assignedVerifierName?: string;
  assignedVerifierId?: string;
  submittedBy?: string;
  submittedByEmail?: string;
  verifierEmail?: string;
  dataCollectionId?: string;
  activityDataUnit?: string;
}



const VerifierApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([]);
  const [verifiers, setVerifiers] = useState<Verifier[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [selectedVerifier, setSelectedVerifier] = useState<string>('all');
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | GHGScopeItem | null>(null);
  const [selectedRejectItem, setSelectedRejectItem] = useState<ApprovalItem | GHGScopeItem | null>(null);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  const [useDemoData, setUseDemoData] = useState(false);

  const [ghgApprovalItems, setGhgApprovalItems] = useState<GHGScopeItem[]>([]);


  // useEffect(() => {
  //   const init = async () => {
  //     if (user?.email) {
  //       await fetchUserProfile();
  //     }
  //     await Promise.all([fetchApprovalItems(), fetchVerifiers()]);
  //   };
  //   init();
  // }, [user]);

  // Use demo data if no real data is loaded
  // useEffect(() => {
  //   if (!loading && approvalItems.length === 0) {
  //     setUseDemoData(true);
  //     // setApprovalItems(DEMO_APPROVAL_ITEMS);
  //     setVerifiers(DEMO_VERIFIERS);
  //   }
  // }, [loading, approvalItems.length]);

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

  const fetchVerifiers = async () => {
    try {
      // Get user roles with can_approve_actions
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, can_approve_actions')
        .eq('can_approve_actions', true);

      if (rolesError) throw rolesError;

      if (roles && roles.length > 0) {
        const userIds = roles.map(r => r.user_id);
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);

        if (profiles) {
          setVerifiers(profiles);
        }
      }
    } catch (error) {
      console.error('Error fetching verifiers:', error);
    }
  };

  const handleAssignVerifier = (itemId: string, verifierId: string) => {
    const verifier = verifiers.find(v => v.user_id === verifierId);

    setApprovalItems(prev =>
      prev.map(item =>
        item._id === itemId
          ? { ...item, assignedVerifierId: verifierId, assignedVerifierName: verifier?.full_name || verifier?.email || 'Unknown' }
          : item
      )
    );

    toast.success(`Verifier ${verifier?.full_name || verifier?.email} assigned successfully`);
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
        return <Badge className="bg-red-600 text-white">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 text-white">High</Badge>;
      case 'medium':
        return <Badge className="bg-green-500 text-white">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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
      setSelectedActivityId(item._id);
      setApprovalDialogOpen(true);
    } else if (item.link) {
      navigate(item.link);
    } else {
      toast.info('Review functionality for this module is coming soon');
    }
  };

  const handleAcceptClick = (item: ApprovalItem | GHGScopeItem) => {
    setSelectedItem(item);
    setReviewDialogOpen(true);
  };

  const handleApproveWithComment = async (itemId: string, dataCollectionId: string, comment: string) => {
    try {

      const item = ghgApprovalItems.find(i => i._id === itemId && i.dataCollectionId === dataCollectionId);
      if (!item) throw new Error('Item not found');

      if (item.type === 'ghg_activity') {
        let approveDataResult = await httpClient.post('ghg-accounting/verify-ghg-data', {
          dataCollectionId: dataCollectionId,
          verificationStatus: 'Verified',
          verificationComments: comment,
        });
        if (approveDataResult.status !== 200) {
          throw new Error('Failed to approve GHG activity data');
        }
        else{
          getItemsToBeVerified();
          toast.success('Approved successfully');
        }

      }

      
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
      throw error;
    }
  };

  const handleRejectClick = (item: ApprovalItem | GHGScopeItem ) => {
    setSelectedRejectItem(item);
    setRejectDialogOpen(true);
  };

  const handleRejectWithComment = async (itemId: string, dataCollectionId: string, comment: string) => {
    try {
      const item = ghgApprovalItems.find(i => i._id === itemId && i.dataCollectionId === dataCollectionId);
      if (!item) throw new Error('Item not found');

      if (item.type === 'ghg_activity') {
        let approveDataResult = await httpClient.post('ghg-accounting/verify-ghg-data', {
          dataCollectionId: dataCollectionId,
          verificationStatus: 'Rejected',
          verificationComments: comment,
        });
        if (approveDataResult.status !== 200) {
          throw new Error('Failed to approve GHG activity data');
        }
        else{
          getItemsToBeVerified();
          toast.success('Rejected successfully');
        }

      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject');
      throw error;
    }
  };

  const filteredItems = React.useMemo(() => {
    return ghgApprovalItems.filter(item => {
  
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
        return false;
      }
  
      if (selectedScope !== 'all') {
        const itemScope = item.scope?.toLowerCase().replace(' ', '_');
        if (itemScope !== selectedScope) return false;
      }
  
      return true;
    });
  }, [ghgApprovalItems, selectedPriority, selectedScope]);

  const displayItems = filteredItems;
  const displayCount = filteredItems.length;
  
  const getGetDataValueLabel=(item:GHGScopeItem)=>{
    let value;
    switch (item.scope) {
      case 'Scope 1':
        value=item.fuelType
        break;
      case 'Scope 2':
        value=item.sourceType
        break;

      case 'Scope 3':
        value=item.sourceType
        break;
        
      default:
        break;
    }
    return value;
  }

  // Count stats
  const criticalCount = ghgApprovalItems.filter(i => i.priority === 'critical').length;
  const highCount     = ghgApprovalItems.filter(i => i.priority === 'high').length;
  const mediumCount   = ghgApprovalItems.filter(i => i.priority === 'medium').length;
  const lowCount      = ghgApprovalItems.filter(i => i.priority === 'low').length;


  const overdueCount = ghgApprovalItems.filter(item => {
    if (!item.dataCollections?.collectedDate) return false;
    const collectedDate = new Date(item.dataCollections.collectedDate);
    const now = new Date();
    const daysDiff = (now.getTime() - collectedDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff > 7 && item.dataCollections.verificationStatus === 'Pending';
  }).length;

  const ghgCount = ghgApprovalItems.length;

  const getItemsToBeVerified = async () => {
    try {
      setLoading(true);
      let result = await httpClient.get('ghg-accounting/items/tobe-verified');
      if (result.status !== 200) {
        throw new Error('Failed to load items to be verified');
      }
      
      const transformedItems = result['data']['sourceDetails'].map((item: GHGScopeItem) => {
        const dataQuality = item.dataCollections?.dataQuality?.toLowerCase() || 'medium';
        let priority: 'low' | 'medium' | 'high' | 'critical';
        
        // Map dataQuality to priority
        switch(dataQuality) {
          case 'low': priority = 'low'; break;
          case 'medium': priority = 'medium'; break;
          case 'high': priority = 'high'; break;
          default: priority = 'medium';
        }
        
        return {
          _id: item._id,
          type: 'ghg_activity' as const,
          module: 'GHG',
          title: `${item.sourceCategory} - ${item.dataCollections.reportingPeriod} - ${item.dataCollections.reportingMonth} ${item.dataCollections.reportingYear}`,
          description: item.sourceDescription,
          submittedBy: item.collectors[0]?.name || 'Unknown',
          submittedAt: item.dataCollections.updatedAt,
          status: item.dataCollections.verificationStatus.toLowerCase(),
          priority: priority, // This is the priority field that filters will use
          facility: item.facilityName,
          scope: item.scope,
          category: item.sourceCategory,
          link: `/ghg-accounting/data-entry?source=${item._id}&dataCollectionId=${item.dataCollections._id}`,
          assignedVerifierId: item.verifiers[0]?._id,
          assignedVerifierName: item.verifiers[0]?.name || 'Unknown',
          submittedByEmail: item.collectors[0]?.email || 'Unknown',
          verifierEmail: item.verifiers[0]?.email || 'Unknown',
          dataCollectionId: item.dataCollections._id,
          activityDataValue: `${item.dataCollections.activityDataValue} ${item.activityDataUnit} of ${getGetDataValueLabel(item)}`,
          dataCollections: item.dataCollections,
          dataQuality: dataQuality // Keep original dataQuality for filtering
        };
      });
      
      setGhgApprovalItems(transformedItems);
      return result.data;
    } catch (error) {
      console.error('Error fetching items to be verified:', error);
      toast.error('Failed to load items to be verified');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getItemsToBeVerified();
  }, []);

  useEffect(() => {
    console.log('Approval Items:', approvalItems);
  }, [approvalItems]);

  useEffect(() => {
    console.log('GHG Approval Items:', ghgApprovalItems);
  }, [ghgApprovalItems]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Gray transparent overlay (blocks clicks) */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading Items to Verify...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <UnifiedSidebarLayout>
      <div className="w-full px-4 py-6 space-y-6">

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
                  <p className="text-2xl font-bold">{ghgApprovalItems.length}</p>
                </div>
                {/* <Clock className="h-8 w-8 text-amber-500" /> */}
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card> */}
           <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">{highCount}</p>
                </div>
                {/* <AlertTriangle className="h-8 w-8 text-orange-500" /> */}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Medium Priority</p>
                  <p className="text-2xl font-bold text-orange-600">{mediumCount}</p>
                </div>
                {/* <AlertTriangle className="h-8 w-8 text-orange-500" /> */}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Priority</p>
                  <p className="text-2xl font-bold text-orange-600">{lowCount}</p>
                </div>
                {/* <AlertTriangle className="h-8 w-8 text-orange-500" /> */}
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
                {/* <XCircle className="h-8 w-8 text-destructive" /> */}
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">GHG Data</p>
                  <p className="text-2xl font-bold">{ghgCount}</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card> */}
        </div>

        <Tabs defaultValue="approvals" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="approvals">
              <CheckCircle className="h-4 w-4 mr-2" />
              Pending Approvals ({approvalItems.length})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Verification Settings
            </TabsTrigger>
          </TabsList> */}

          <TabsContent value="approvals" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>
                  {/* <Select value={selectedModule} onValueChange={setSelectedModule}>
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
                  </Select> */}
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      {/* <SelectItem value="critical">Critical</SelectItem> */}
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
                      {/* <SelectItem value="scope_4">Scope 4</SelectItem> */}
                    </SelectContent>
                  </Select>
                  {/* <Select value={selectedVerifier} onValueChange={setSelectedVerifier}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="All Verifiers" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Verifiers</SelectItem>
                      {verifiers.map(v => (
                        <SelectItem key={v.user_id} value={v.user_id}>
                          {v.full_name || v.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  <Button variant="outline" size="sm" onClick={getItemsToBeVerified} >
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Empty State */}
            {ghgApprovalItems.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">All caught up!</h3>
                  <p className="text-muted-foreground">You have no pending approvals at this time.</p>
                </CardContent>
              </Card>
            )}

            {/* Approvals Table */}
            {ghgApprovalItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Verifications</CardTitle>
                  <CardDescription>
                    {/* {ghgApprovalItems.length} item{ghgApprovalItems.length !== 1 ? 's' : ''} requiring your verification */}
                    {displayCount} item{displayCount !== 1 ? 's' : ''} requiring your verification
                    {displayItems.length > 0 && filteredItems.length < ghgApprovalItems.length && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (filtered from {ghgApprovalItems.length})
                      </span>
                    )}
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
                        <TableHead className="w-[140px]">Submitted By</TableHead>
                        {/* <TableHead className="w-[180px]">Assigned Verifier</TableHead> */}
                        <TableHead className="w-[100px]">Scope</TableHead>
                        <TableHead className="w-[80px]">Link</TableHead>
                        <TableHead className="w-[160px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayItems.length > 0 &&
                        displayItems.map((item, index) => (
                          <TableRow key={`${item._id}-${index}`}>
                            <TableCell className="font-medium">{index + 1}</TableCell>

                            <TableCell>{getModuleBadge('GHG')}</TableCell>

                            <TableCell>
                            {getPriorityBadge(item.priority|| 'medium')}
                            </TableCell>

                            <TableCell>
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.sourceDescription}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Submitted{' '}
                                  {format(
                                    new Date(item.dataCollections?.updatedAt ?? Date.now()),
                                    'MMM d, yyyy'
                                  )}
                                </p>
                              </div>
                            </TableCell>

                            <TableCell>
                              <span className="text-sm" title={item.submittedByEmail}>
                                {item.submittedBy}
                              </span>
                            </TableCell>

                            {/* <TableCell>
                              <span className="text-sm" title={item.verifierEmail}>
                                {item.assignedVerifierName}
                              </span>
                            </TableCell> */}

                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {item.scope}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/verifier-approvals/${item._id}?scope=${encodeURIComponent(
                                      item.scope.split(' ').join('_')
                                    )}&collectionId=${item.dataCollectionId}`
                                  )
                                }
                                className="h-8 w-8 p-0"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600"
                                  onClick={() => handleAcceptClick(item)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive"
                                  onClick={() => handleRejectClick(item)}
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
          </TabsContent>

          <TabsContent value="settings">
            <VerificationSettingsCard />
          </TabsContent>
        </Tabs>

        {/* Approval Dialog */}
        <ApprovalWorkflowDialog
          open={approvalDialogOpen}
          onOpenChange={setApprovalDialogOpen}
          activityDataId={selectedActivityId}
          onSuccess={() => {
            // fetchApprovalItems();
            setApprovalDialogOpen(false);
          }}
        />

        {/* Review Approval Dialog */}
        <ReviewApprovalDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          item={selectedItem}
          onApprove={handleApproveWithComment}
        />

        {/* Reject Dialog */}
        <RejectApprovalDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          item={selectedRejectItem}
          onReject={handleRejectWithComment}
        />
      </div>
    </UnifiedSidebarLayout>
  );
};

export default VerifierApprovalsPage;