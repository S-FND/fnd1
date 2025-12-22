import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, ClipboardCheck, Settings, AlertTriangle, Filter, UserCheck, ExternalLink } from 'lucide-react';
import { VerificationSettingsCard } from '@/components/admin/VerificationSettingsCard';
import { useNavigate } from 'react-router-dom';
import { getApprovalDeepLink } from '@/utils/approvalDeepLinks';

interface UserWithVerifierStatus {
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  can_approve_actions: boolean;
}

interface PendingApproval {
  id: string;
  source_name: string;
  module: string;
  scope: string;
  period_name: string;
  activity_value: number;
  status: string;
  created_at: string;
  collector_email: string;
  assigned_verifier_id?: string;
  assigned_verifier_name?: string;
}

// Demo data for users
const DEMO_USERS: UserWithVerifierStatus[] = [
  { user_id: 'user-1', email: 'rajesh.kumar@company.com', full_name: 'Rajesh Kumar', role: 'portfolio_company_admin', can_approve_actions: true },
  { user_id: 'user-2', email: 'priya.sharma@company.com', full_name: 'Priya Sharma', role: 'portfolio_team_editor', can_approve_actions: true },
  { user_id: 'user-3', email: 'amit.patel@company.com', full_name: 'Amit Patel', role: 'portfolio_team_editor', can_approve_actions: false },
  { user_id: 'user-4', email: 'sunita.reddy@company.com', full_name: 'Sunita Reddy', role: 'portfolio_team_viewer', can_approve_actions: false },
  { user_id: 'user-5', email: 'vikram.singh@company.com', full_name: 'Vikram Singh', role: 'portfolio_team_editor', can_approve_actions: true },
  { user_id: 'user-6', email: 'neha.gupta@company.com', full_name: 'Neha Gupta', role: 'portfolio_team_viewer', can_approve_actions: false },
  { user_id: 'user-7', email: 'karthik.iyer@company.com', full_name: 'Karthik Iyer', role: 'portfolio_company_admin', can_approve_actions: true },
  { user_id: 'user-8', email: 'meera.nair@company.com', full_name: 'Meera Nair', role: 'portfolio_team_editor', can_approve_actions: false },
];

// Demo data for pending approvals
const DEMO_PENDING_APPROVALS: PendingApproval[] = [
  { id: 'pa-1', source_name: 'Diesel Generator - Mumbai', module: 'GHG', scope: 'Scope 1', period_name: 'January 2024', activity_value: 2450, status: 'submitted', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'amit.patel@company.com', assigned_verifier_id: 'user-1', assigned_verifier_name: 'Rajesh Kumar' },
  { id: 'pa-2', source_name: 'Company Fleet', module: 'GHG', scope: 'Scope 1', period_name: 'Q1 2024', activity_value: 12800, status: 'submitted', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'sunita.reddy@company.com', assigned_verifier_id: 'user-2', assigned_verifier_name: 'Priya Sharma' },
  { id: 'pa-3', source_name: 'Electricity - Bangalore', module: 'GHG', scope: 'Scope 2', period_name: 'February 2024', activity_value: 45000, status: 'submitted', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'neha.gupta@company.com', assigned_verifier_id: 'user-1', assigned_verifier_name: 'Rajesh Kumar' },
  { id: 'pa-4', source_name: 'Business Travel - Flights', module: 'GHG', scope: 'Scope 3', period_name: 'March 2024', activity_value: 24500, status: 'submitted', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'meera.nair@company.com', assigned_verifier_id: 'user-5', assigned_verifier_name: 'Vikram Singh' },
  { id: 'pa-5', source_name: 'Refrigerant Leakage', module: 'GHG', scope: 'Scope 1', period_name: 'Q1 2024', activity_value: 15, status: 'submitted', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'amit.patel@company.com', assigned_verifier_id: 'user-7', assigned_verifier_name: 'Karthik Iyer' },
  { id: 'pa-6', source_name: 'Water Consumption Report', module: 'ESG Metrics', scope: '', period_name: 'Q1 2024', activity_value: 12500, status: 'submitted', created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'sunita.reddy@company.com', assigned_verifier_id: 'user-2', assigned_verifier_name: 'Priya Sharma' },
  { id: 'pa-7', source_name: 'Environmental Policy Doc', module: 'ESMS', scope: '', period_name: 'February 2024', activity_value: 0, status: 'submitted', created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'neha.gupta@company.com', assigned_verifier_id: 'user-5', assigned_verifier_name: 'Vikram Singh' },
  { id: 'pa-8', source_name: 'SDG 13 - Climate Action', module: 'SDG', scope: '', period_name: 'Q1 2024', activity_value: 0, status: 'submitted', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'meera.nair@company.com', assigned_verifier_id: 'user-1', assigned_verifier_name: 'Rajesh Kumar' },
  { id: 'pa-9', source_name: 'Waste Disposal', module: 'GHG', scope: 'Scope 3', period_name: 'January 2024', activity_value: 450, status: 'submitted', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'amit.patel@company.com', assigned_verifier_id: 'user-7', assigned_verifier_name: 'Karthik Iyer' },
  { id: 'pa-10', source_name: 'Water Treatment', module: 'GHG', scope: 'Scope 1', period_name: 'February 2024', activity_value: 1200, status: 'submitted', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), collector_email: 'sunita.reddy@company.com', assigned_verifier_id: 'user-2', assigned_verifier_name: 'Priya Sharma' },
];

const VerifierAdminPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithVerifierStatus[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [assigningVerifier, setAssigningVerifier] = useState<string | null>(null);
  const [useDemoData, setUseDemoData] = useState(false);
  const [selectedVerifier, setSelectedVerifier] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  // Use demo data if no real data is loaded
  useEffect(() => {
    if (!loading && users.length === 0 && pendingApprovals.length === 0) {
      setUseDemoData(true);
      setUsers(DEMO_USERS);
      setPendingApprovals(DEMO_PENDING_APPROVALS);
    }
  }, [loading, users.length, pendingApprovals.length]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchPendingApprovals()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Get all user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, email, full_name, role');

      if (profileError) throw profileError;

      // Get user roles with can_approve_actions
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, can_approve_actions');

      if (rolesError) throw rolesError;

      const rolesMap = new Map(roles?.map(r => [r.user_id, r.can_approve_actions]) || []);

      const usersWithStatus: UserWithVerifierStatus[] = (profiles || []).map(p => ({
        user_id: p.user_id,
        email: p.email,
        full_name: p.full_name,
        role: p.role,
        can_approve_actions: rolesMap.get(p.user_id) ?? false,
      }));

      setUsers(usersWithStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from('ghg_activity_data')
        .select(`
          id,
          period_name,
          activity_value,
          status,
          created_at,
          collected_by,
          ghg_sources!inner (
            source_name,
            scope
          )
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get collector emails
      const collectorIds = [...new Set((data || []).map(d => d.collected_by).filter(Boolean))];
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('user_id, email')
        .in('user_id', collectorIds);

      const emailMap = new Map(profiles?.map(p => [p.user_id, p.email]) || []);

      const approvals: PendingApproval[] = (data || []).map((d: any) => ({
        id: d.id,
        source_name: d.ghg_sources?.source_name || 'Unknown',
        module: 'GHG',
        scope: d.ghg_sources?.scope || 'Unknown',
        period_name: d.period_name,
        activity_value: d.activity_value,
        status: d.status,
        created_at: d.created_at,
        collector_email: emailMap.get(d.collected_by) || 'Unknown',
      }));

      setPendingApprovals(approvals);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    }
  };

  const toggleVerifierStatus = async (userId: string, currentStatus: boolean) => {
    setUpdating(userId);
    try {
      // Check if user_role entry exists
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('user_roles')
          .update({ can_approve_actions: !currentStatus })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'verifier',
            can_approve_actions: !currentStatus,
            can_make_actions: true,
          });

        if (error) throw error;
      }

      setUsers(prev =>
        prev.map(u =>
          u.user_id === userId ? { ...u, can_approve_actions: !currentStatus } : u
        )
      );

      toast({
        title: 'Verifier Status Updated',
        description: !currentStatus
          ? 'User can now approve submissions.'
          : 'Verifier permissions revoked.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleAssignVerifier = (approvalId: string, verifierId: string) => {
    setAssigningVerifier(approvalId);
    
    // Find the verifier name
    const verifier = verifiers.find(v => v.user_id === verifierId);
    
    // Update local state (in demo mode or real mode)
    setPendingApprovals(prev =>
      prev.map(a =>
        a.id === approvalId
          ? { ...a, assigned_verifier_id: verifierId, assigned_verifier_name: verifier?.full_name || verifier?.email || 'Unknown' }
          : a
      )
    );
    
    toast({
      title: 'Verifier Assigned',
      description: `${verifier?.full_name || verifier?.email} has been assigned as the verifier.`,
    });
    
    setAssigningVerifier(null);
  };

  const handleNavigateToApproval = (approval: PendingApproval) => {
    const link = getApprovalDeepLink({
      module: approval.module,
      type: approval.module.toLowerCase(),
      id: approval.id,
      scope: approval.scope,
    });
    navigate(link);
  };

  const getModuleBadge = (module: string) => {
    const colors: Record<string, string> = {
      'GHG': 'bg-orange-100 text-orange-800 border-orange-200',
      'ESG Metrics': 'bg-green-100 text-green-800 border-green-200',
      'ESMS': 'bg-blue-100 text-blue-800 border-blue-200',
      'ESG DD': 'bg-purple-100 text-purple-800 border-purple-200',
      'SDG': 'bg-teal-100 text-teal-800 border-teal-200',
    };
    return <Badge variant="outline" className={colors[module] || 'bg-gray-100 text-gray-800'}>{module}</Badge>;
  };

  const verifierCount = users.filter(u => u.can_approve_actions).length;
  const verifiers = users.filter(u => u.can_approve_actions);
  
  // Filter pending approvals by selected verifier
  const filteredApprovals = selectedVerifier === 'all' 
    ? pendingApprovals 
    : pendingApprovals.filter(a => a.assigned_verifier_id === selectedVerifier);

  if (loading) {
    return (
      <div className="w-full px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Demo Mode Banner */}
      {useDemoData && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Demo Mode: Showing sample data for demonstration purposes</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Verifier Administration</h1>
          <p className="text-muted-foreground">Manage verifier assignments and view pending approvals</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="h-10 w-10 text-primary" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Shield className="h-10 w-10 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{verifierCount}</p>
                <p className="text-sm text-muted-foreground">Active Verifiers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ClipboardCheck className="h-10 w-10 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{pendingApprovals.length}</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="pending">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Pending Approvals ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Verification Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Verifier Assignments</CardTitle>
              <CardDescription>
                Toggle verifier status for users. Verifiers can approve submitted data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found in the system.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Verifier Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(u => (
                      <TableRow key={u.user_id}>
                        <TableCell className="font-medium">
                          {u.full_name || 'Unnamed User'}
                        </TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{u.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {u.can_approve_actions ? (
                            <Badge className="bg-green-100 text-green-800">Verifier</Badge>
                          ) : (
                            <Badge variant="secondary">Standard</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-muted-foreground">
                              {u.can_approve_actions ? 'Enabled' : 'Disabled'}
                            </span>
                            <Switch
                              checked={u.can_approve_actions}
                              onCheckedChange={() => toggleVerifierStatus(u.user_id, u.can_approve_actions)}
                              disabled={updating === u.user_id}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Pending Approvals</CardTitle>
                  <CardDescription>
                    Overview of all submissions awaiting verification across the organization.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedVerifier} onValueChange={setSelectedVerifier}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Filter by Verifier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Verifiers</SelectItem>
                      {verifiers.map(v => (
                        <SelectItem key={v.user_id} value={v.user_id}>
                          {v.full_name || v.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredApprovals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending approvals {selectedVerifier !== 'all' ? 'for this verifier' : 'at this time'}.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">S.No</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Assign Verifier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovals.map((a, index) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{a.source_name}</TableCell>
                        <TableCell>{getModuleBadge(a.module)}</TableCell>
                        <TableCell>
                          {a.scope ? <Badge variant="outline">{a.scope}</Badge> : '-'}
                        </TableCell>
                        <TableCell>{a.period_name}</TableCell>
                        <TableCell>{a.collector_email}</TableCell>
                        <TableCell>
                          <Select
                            value={a.assigned_verifier_id || 'unassigned'}
                            onValueChange={(value) => handleAssignVerifier(a.id, value)}
                            disabled={assigningVerifier === a.id}
                          >
                            <SelectTrigger className="w-[160px]">
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-3 w-3" />
                                <SelectValue placeholder="Assign" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {verifiers.map(v => (
                                <SelectItem key={v.user_id} value={v.user_id}>
                                  {v.full_name || v.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleNavigateToApproval(a)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {filteredApprovals.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredApprovals.length} of {pendingApprovals.length} pending approvals
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <VerificationSettingsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerifierAdminPage;
