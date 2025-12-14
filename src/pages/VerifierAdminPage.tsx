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
import { Shield, Users, ClipboardCheck, Settings } from 'lucide-react';

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
  scope: string;
  period_name: string;
  activity_value: number;
  status: string;
  created_at: string;
  collector_email: string;
}

const VerifierAdminPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithVerifierStatus[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

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

  const verifierCount = users.filter(u => u.can_approve_actions).length;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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
              <CardTitle>All Pending Approvals</CardTitle>
              <CardDescription>
                Overview of all submissions awaiting verification across the organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending approvals at this time.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.source_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{a.scope}</Badge>
                        </TableCell>
                        <TableCell>{a.period_name}</TableCell>
                        <TableCell>{a.activity_value.toFixed(2)}</TableCell>
                        <TableCell>{a.collector_email}</TableCell>
                        <TableCell>
                          {new Date(a.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerifierAdminPage;
