import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePortfolioAuth } from './usePortfolioAuth';
import { DetailedNavigationItem, flattenNavigationItems, getDetailedNavigationStructure } from '@/data/navigation/detailedNavigation';

export interface UserMenuPermission {
  id: string;
  user_id: string;
  portfolio_company_id: string;
  menu_item_id: string;
  granted: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useUserPermissions = (targetUserId?: string) => {
  const { user, profile } = usePortfolioAuth();
  const [permissions, setPermissions] = useState<UserMenuPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log('useUserPermissions called with targetUserId:', targetUserId, 'user:', user, 'profile:', profile);

  const userId = targetUserId || user?.id;
  const companyId = profile?.portfolio_company_id;

  // Fetch user permissions from database
  const fetchPermissions = async () => {
    if (!userId || !companyId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_menu_permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('portfolio_company_id', companyId);

      if (error) throw error;
      setPermissions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [userId, companyId]);

  // Check if user has permission for a specific menu item
  const hasPermission = (menuItemId: string): boolean => {
    // If no specific permissions set, use role-based defaults
    if (permissions.length === 0) {
      return getDefaultPermission(menuItemId);
    }

    const permission = permissions.find(p => p.menu_item_id === menuItemId);
    return permission?.granted ?? getDefaultPermission(menuItemId);
  };

  // Get default permission based on role and navigation structure
  const getDefaultPermission = (menuItemId: string): boolean => {
    if (!profile?.role) return false;

    const navigationStructure = getDetailedNavigationStructure();
    const allItems = flattenNavigationItems(navigationStructure);
    const item = allItems.find(i => i.id === menuItemId);

    if (!item) return false;

    // Check if user's role is allowed for this item
    return item.allowedRoles?.includes(profile.role) ?? false;
  };

  // Update permissions for a user (admin only)
  const updatePermissions = async (permissionUpdates: Array<{ menu_item_id: string; granted: boolean }>) => {
    if (!userId || !companyId || !user?.id) {
      throw new Error('Missing required data for permission update');
    }

    try {
      // Prepare upsert data
      const upsertData = permissionUpdates.map(update => ({
        user_id: userId,
        portfolio_company_id: companyId,
        menu_item_id: update.menu_item_id,
        granted: update.granted,
        created_by: user.id
      }));

      const { error } = await supabase
        .from('user_menu_permissions')
        .upsert(upsertData, { 
          onConflict: 'user_id,portfolio_company_id,menu_item_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      // Refresh permissions
      await fetchPermissions();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update permissions');
    }
  };

  // Get filtered navigation structure based on user permissions
  const getFilteredNavigation = (): DetailedNavigationItem[] => {
    const navigationStructure = getDetailedNavigationStructure();
    
    const filterItems = (items: DetailedNavigationItem[]): DetailedNavigationItem[] => {
      return items.filter(item => {
        const hasItemPermission = hasPermission(item.id);
        
        if (!hasItemPermission) return false;

        // If item has children, filter them too
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterItems(item.children);
          // Only include parent if it has accessible children or is directly accessible
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

  // Get all available menu items for permission assignment
  const getAllMenuItems = (): DetailedNavigationItem[] => {
    const navigationStructure = getDetailedNavigationStructure();
    return flattenNavigationItems(navigationStructure);
  };

  // Get permissions grouped by navigation structure for admin interface
  const getPermissionsTree = () => {
    const navigationStructure = getDetailedNavigationStructure();
    
    const addPermissionInfo = (items: DetailedNavigationItem[]): (DetailedNavigationItem & { hasPermission: boolean })[] => {
      return items.map(item => ({
        ...item,
        hasPermission: hasPermission(item.id),
        children: item.children ? addPermissionInfo(item.children) : undefined
      }));
    };

    return addPermissionInfo(navigationStructure);
  };

  return {
    permissions,
    loading,
    error,
    hasPermission,
    updatePermissions,
    getFilteredNavigation,
    getAllMenuItems,
    getPermissionsTree,
    refetch: fetchPermissions
  };
};