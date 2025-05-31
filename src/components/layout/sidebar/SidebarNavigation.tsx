
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarNavItem } from './SidebarNavItem';
import { StakeholdersSubmenu } from './StakeholdersSubmenu';
import { ESGDDSubmenu } from './ESGDDSubmenu';
import { ReportsSubmenu } from './ReportsSubmenu';
import { getNavigationItems } from './navigationData';
import { useFeatures } from '@/context/FeaturesContext';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu
} from '@/components/ui/sidebar';

interface SidebarNavigationProps {
  role: string;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (menuKey: string) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  role,
  expandedMenus,
  toggleMenu
}) => {
  const location = useLocation();
  const { isFeatureActive } = useFeatures();
  const navigationItems = getNavigationItems(role);
  
  // Filter navigation items based on active features
  const filteredItems = navigationItems.filter(item => {
    if (!item.featureId) return true;
    return isFeatureActive(item.featureId);
  });
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredItems.map((item) => {
            // Handle stakeholders submenu separately
            if (item.name === 'Stakeholders' && (role === 'admin' || role === 'manager')) {
              return (
                <StakeholdersSubmenu
                  key="stakeholders"
                  isExpanded={expandedMenus.stakeholders || false}
                  onToggle={() => toggleMenu('stakeholders')}
                  role={role}
                />
              );
            }
            
            // Handle ESG DD submenu separately
            if (item.name === 'ESG DD' && (role === 'admin' || role === 'manager')) {
              return (
                <ESGDDSubmenu
                  key="esgdd"
                  isExpanded={expandedMenus.esgdd || false}
                  onToggle={() => toggleMenu('esgdd')}
                />
              );
            }
            
            // Handle Reports submenu separately
            if (item.name === 'Reports' && (role === 'admin' || role === 'manager')) {
              return (
                <ReportsSubmenu
                  key="reports"
                  isExpanded={expandedMenus.reports || false}
                  onToggle={() => toggleMenu('reports')}
                />
              );
            }
            
            // Regular navigation items
            return (
              <SidebarNavItem
                key={item.name}
                icon={item.icon}
                label={item.name}
                href={item.href}
                isActive={location.pathname === item.href || location.pathname.startsWith(item.href + '/')}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
