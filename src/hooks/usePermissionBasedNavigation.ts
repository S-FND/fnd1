import { useMemo } from 'react';
import { useUserPermissions } from './useUserPermissions';
import { NavigationItem } from '@/components/layout/sidebar/navigationData';
import { DetailedNavigationItem, getDetailedNavigationStructure } from '@/data/navigation/detailedNavigation';

export const usePermissionBasedNavigation = () => {
  const { getFilteredNavigation, hasPermission, loading } = useUserPermissions();

  // Convert detailed navigation to the format expected by the sidebar
  const convertToSidebarFormat = (detailedItems: DetailedNavigationItem[]): NavigationItem[] => {
    return detailedItems.map(item => ({
      name: item.name,
      href: item.href || '#',
      icon: item.icon,
      featureId: item.featureId,
      submenu: item.children ? convertToSidebarFormat(item.children) : undefined
    }));
  };

  // Get filtered navigation items based on user permissions
  const getFilteredNavigationItems = useMemo(() => {
    if (loading) return [];
    
    const filteredNavigation = getFilteredNavigation();
    return convertToSidebarFormat(filteredNavigation);
  }, [loading, getFilteredNavigation]);

  // Check if user can access a specific tab within a page
  const canAccessTab = (pageId: string, tabId: string): boolean => {
    const fullTabId = `${pageId}.${tabId}`;
    return hasPermission(fullTabId);
  };

  // Get accessible tabs for a specific page
  const getAccessibleTabs = (pageId: string): string[] => {
    const navigationStructure = getDetailedNavigationStructure();
    const allItems = navigationStructure.flatMap(item => 
      item.children?.flatMap(child => 
        child.children?.filter(grandchild => 
          grandchild.parentId === pageId && hasPermission(grandchild.id)
        ).map(grandchild => grandchild.id.split('.').pop() || '') || []
      ) || []
    );
    
    return allItems;
  };

  return {
    getFilteredNavigationItems,
    canAccessTab,
    getAccessibleTabs,
    hasPermission,
    loading
  };
};