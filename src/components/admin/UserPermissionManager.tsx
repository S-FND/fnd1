import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';
import { DetailedNavigationItem, getDetailedNavigationStructure, flattenNavigationItems } from '@/data/navigation/detailedNavigation';
import { supabase } from '@/integrations/supabase/client';
import { Eye, User, Settings2, Save, RotateCcw } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  role: string;
}

interface UserPermissionManagerProps {
  targetUser: UserProfile;
}

const UserPermissionManager: React.FC<UserPermissionManagerProps> = ({ targetUser }) => {
  console.log('UserPermissionManager rendering with targetUser:', targetUser);
  const { toast } = useToast();
  const { profile } = usePortfolioAuth();
  const { getPermissionsTree, updatePermissions, loading } = useUserPermissions(targetUser.user_id);
  
  console.log('UserPermissionManager - loading:', loading, 'profile:', profile);
  
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize selected permissions
  useEffect(() => {
    if (loading) return; // Don't initialize until permissions are loaded
    
    const permissionsTree = getPermissionsTree();
    const initialPermissions: Record<string, boolean> = {};
    
    const collectPermissions = (items: (DetailedNavigationItem & { hasPermission: boolean })[]) => {
      items.forEach(item => {
        initialPermissions[item.id] = item.hasPermission;
        if (item.children) {
          collectPermissions(item.children as (DetailedNavigationItem & { hasPermission: boolean })[]);
        }
      });
    };
    
    collectPermissions(permissionsTree);
    setSelectedPermissions(initialPermissions);
  }, [targetUser.user_id, loading, getPermissionsTree]);

  // Check if there are unsaved changes
  useEffect(() => {
    if (loading) return; // Don't check changes until permissions are loaded
    
    const permissionsTree = getPermissionsTree();
    const currentPermissions: Record<string, boolean> = {};
    
    const collectCurrentPermissions = (items: (DetailedNavigationItem & { hasPermission: boolean })[]) => {
      items.forEach(item => {
        currentPermissions[item.id] = item.hasPermission;
        if (item.children) {
          collectCurrentPermissions(item.children as (DetailedNavigationItem & { hasPermission: boolean })[]);
        }
      });
    };
    
    collectCurrentPermissions(permissionsTree);
    
    const changed = Object.keys(selectedPermissions).some(
      key => selectedPermissions[key] !== currentPermissions[key]
    );
    
    setHasChanges(changed);
  }, [selectedPermissions, loading, getPermissionsTree]);

  const handlePermissionChange = (menuItemId: string, granted: boolean) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [menuItemId]: granted
    }));

    // Auto-grant parent permissions if child is granted
    if (granted) {
      const navigationStructure = getDetailedNavigationStructure();
      const allItems = flattenNavigationItems(navigationStructure);
      const item = allItems.find(i => i.id === menuItemId);
      
      if (item?.parentId) {
        setSelectedPermissions(prev => ({
          ...prev,
          [item.parentId!]: true
        }));
      }
    }

    // Auto-revoke child permissions if parent is revoked
    if (!granted) {
      const navigationStructure = getDetailedNavigationStructure();
      const allItems = flattenNavigationItems(navigationStructure);
      const children = allItems.filter(i => i.parentId === menuItemId);
      
      const updates: Record<string, boolean> = {};
      children.forEach(child => {
        updates[child.id] = false;
        // Recursively revoke grandchildren
        const grandchildren = allItems.filter(i => i.parentId === child.id);
        grandchildren.forEach(gc => {
          updates[gc.id] = false;
        });
      });
      
      setSelectedPermissions(prev => ({
        ...prev,
        ...updates
      }));
    }
  };

  const handleSave = async () => {
    if (!profile?.portfolio_company_id) {
      toast({
        title: "Error",
        description: "Unable to save permissions. Company information missing.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      const permissionUpdates = Object.entries(selectedPermissions).map(([menu_item_id, granted]) => ({
        menu_item_id,
        granted
      }));

      await updatePermissions(permissionUpdates);
      
      toast({
        title: "Success",
        description: `Permissions updated for ${targetUser.full_name || targetUser.email}`,
      });
      
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive"
      });
      console.error('Error updating permissions:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const permissionsTree = getPermissionsTree();
    const resetPermissions: Record<string, boolean> = {};
    
    const collectPermissions = (items: (DetailedNavigationItem & { hasPermission: boolean })[]) => {
      items.forEach(item => {
        resetPermissions[item.id] = item.hasPermission;
        if (item.children) {
          collectPermissions(item.children as (DetailedNavigationItem & { hasPermission: boolean })[]);
        }
      });
    };
    
    collectPermissions(permissionsTree);
    setSelectedPermissions(resetPermissions);
  };

  const renderNavigationTree = (items: DetailedNavigationItem[], level: number = 0) => {
    return items.map((item) => {
      const isSelected = selectedPermissions[item.id] ?? false;
      const indent = level * 24;
      
      return (
        <div key={item.id} className="space-y-2">
          <div className="flex items-center space-x-3" style={{ marginLeft: `${indent}px` }}>
            <Checkbox
              id={item.id}
              checked={isSelected}
              onCheckedChange={(checked) => handlePermissionChange(item.id, !!checked)}
            />
            <div className="flex items-center space-x-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                {item.name}
              </label>
              <Badge variant={item.level === 'main' ? 'default' : item.level === 'submenu' ? 'secondary' : 'outline'}>
                {item.level}
              </Badge>
            </div>
          </div>
          
          {item.children && item.children.length > 0 && (
            <div className="ml-6">
              {renderNavigationTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const getPreviewNavigation = () => {
    const navigationStructure = getDetailedNavigationStructure();
    
    const filterItems = (items: DetailedNavigationItem[]): DetailedNavigationItem[] => {
      return items.filter(item => {
        const hasPermission = selectedPermissions[item.id] ?? false;
        
        if (!hasPermission) return false;

        if (item.children && item.children.length > 0) {
          const filteredChildren = filterItems(item.children);
          if (filteredChildren.length === 0 && !item.href) return false;
          
          return {
            ...item,
            children: filteredChildren
          };
        }

        return true;
      }).map(item => {
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: filterItems(item.children)
          };
        }
        return item;
      });
    };

    return filterItems(navigationStructure);
  };

  const renderPreviewTree = (items: DetailedNavigationItem[], level: number = 0) => {
    return items.map((item) => {
      const indent = level * 16;
      
      return (
        <div key={item.id} className="space-y-1">
          <div className="flex items-center space-x-2 py-1" style={{ marginLeft: `${indent}px` }}>
            {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm">{item.name}</span>
            <Badge variant="outline" className="text-xs">
              {item.level}
            </Badge>
          </div>
          
          {item.children && item.children.length > 0 && (
            <div>
              {renderPreviewTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading permissions...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const navigationStructure = getDetailedNavigationStructure();
  const previewNavigation = getPreviewNavigation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Manage Permissions: {targetUser.full_name || targetUser.email}
        </CardTitle>
        <CardDescription>
          Assign specific page and feature access to this team member. Changes will be applied immediately after saving.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="permissions" value={previewMode ? "preview" : "permissions"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="permissions" onClick={() => setPreviewMode(false)}>
              <Settings2 className="h-4 w-4 mr-2" />
              Configure Permissions
            </TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview Navigation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="permissions" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Select the pages and features this user can access
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={saving || !hasChanges}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[600px] border rounded-md p-4">
              <div className="space-y-4">
                {renderNavigationTree(navigationStructure)}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Preview of how the navigation will appear for this user
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation Preview</CardTitle>
                <CardDescription>
                  This is how the sidebar navigation will look for {targetUser.full_name || targetUser.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {previewNavigation.length > 0 ? (
                    <div className="space-y-2">
                      {renderPreviewTree(previewNavigation)}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No accessible pages selected. User will only see the dashboard.
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPermissionManager;