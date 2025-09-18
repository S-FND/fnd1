import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';
import { supabase } from '@/integrations/supabase/client';
import UserPermissionManager from './UserPermissionManager';
import { Users, Settings, Search, Filter } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const TeamPermissionsPage: React.FC = () => {
  const { toast } = useToast();
  const { profile } = usePortfolioAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      
      // If no portfolio company ID, use mock data for testing
      if (!profile?.portfolio_company_id) {
        const mockUsers: UserProfile[] = [
          {
            id: 'mock-1',
            user_id: 'mock-user-1',
            full_name: 'John Admin',
            email: 'admin@example.com',
            role: 'portfolio_company_admin',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-2',
            user_id: 'mock-user-2',
            full_name: 'Sarah Editor',
            email: 'editor@example.com',
            role: 'portfolio_team_editor',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-3',
            user_id: 'mock-user-3',
            full_name: 'Mike Viewer',
            email: 'viewer@example.com',
            role: 'portfolio_team_viewer',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-4',
            user_id: 'mock-user-4',
            full_name: 'Jane Supplier',
            email: 'supplier@example.com',
            role: 'supplier',
            is_active: true,
            created_at: new Date().toISOString()
          }
        ];
        setUsers(mockUsers);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('portfolio_company_id', profile.portfolio_company_id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If no real users found, use mock data for testing
      if (!data || data.length === 0) {
        const mockUsers: UserProfile[] = [
          {
            id: 'mock-1',
            user_id: 'mock-user-1',
            full_name: 'John Admin',
            email: 'admin@example.com',
            role: 'portfolio_company_admin',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-2',
            user_id: 'mock-user-2',
            full_name: 'Sarah Editor',
            email: 'editor@example.com',
            role: 'portfolio_team_editor',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-3',
            user_id: 'mock-user-3',
            full_name: 'Mike Viewer',
            email: 'viewer@example.com',
            role: 'portfolio_team_viewer',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-4',
            user_id: 'mock-user-4',
            full_name: 'Jane Supplier',
            email: 'supplier@example.com',
            role: 'supplier',
            is_active: true,
            created_at: new Date().toISOString()
          }
        ];
        setUsers(mockUsers);
      } else {
        setUsers(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive"
      });
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [profile?.portfolio_company_id]);

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleManagePermissions = (user: UserProfile) => {
    setSelectedUser(user);
    setPermissionDialogOpen(true);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'portfolio_company_admin':
        return 'default';
      case 'portfolio_team_editor':
        return 'secondary';
      case 'portfolio_team_viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatRoleName = (role: string) => {
    switch (role) {
      case 'portfolio_company_admin':
        return 'Admin';
      case 'portfolio_team_editor':
        return 'Editor';
      case 'portfolio_team_viewer':
        return 'Viewer';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Permissions</h1>
          <p className="text-muted-foreground">
            Loading team members...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Permissions</h1>
        <p className="text-muted-foreground">
          Assign specific page and feature access to team members with granular control over navigation and functionality.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="portfolio_company_admin">Admin</SelectItem>
                <SelectItem value="portfolio_team_editor">Editor</SelectItem>
                <SelectItem value="portfolio_team_viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {user.full_name || 'Unnamed User'}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {user.email}
                  </CardDescription>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {formatRoleName(user.role)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  Member since: {new Date(user.created_at).toLocaleDateString()}
                </div>
                
                <Dialog open={permissionDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                  setPermissionDialogOpen(open);
                  if (!open) setSelectedUser(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleManagePermissions(user)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Permissions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                      <DialogTitle>Manage User Permissions</DialogTitle>
                      <DialogDescription>
                        Configure page and feature access for team members with preview functionality.
                      </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                      <div className="overflow-y-auto">
                        <UserPermissionManager targetUser={selectedUser} />
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No team members found</h3>
            <p className="text-muted-foreground text-sm">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'No team members have been added to your company yet'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamPermissionsPage;