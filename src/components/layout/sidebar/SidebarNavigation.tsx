
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';
import { getNavigationItems } from './navigationData';
import { StakeholdersSubmenu } from './StakeholdersSubmenu';
import { ESGDDSubmenu } from './ESGDDSubmenu';
import { ReportsSubmenu } from './ReportsSubmenu';

interface SidebarNavigationProps {
  role?: string;
  expandedMenus?: Record<string, boolean>;
  toggleMenu?: (menuKey: string) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  role: propRole,
  expandedMenus: propExpandedMenus,
  toggleMenu: propToggleMenu
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const [localExpandedSubmenus, setLocalExpandedSubmenus] = useState<Record<string, boolean>>({});

  if (!user) return null;

  // Use props if provided, otherwise use local state and user role
  const role = propRole || user.role;
  const expandedMenus = propExpandedMenus || localExpandedSubmenus;
  const toggleMenu = propToggleMenu || ((name: string) => {
    setLocalExpandedSubmenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  });

  const navigationItems = getNavigationItems(role);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        {navigationItems.map((item) => {
          // Handle Stakeholders submenu - only show for admin/manager
          if (item.name === 'Stakeholders' && (role === 'admin' || role === 'manager')) {
            return (
              <StakeholdersSubmenu
                key={item.name}
                isExpanded={expandedMenus['stakeholders'] || false}
                onToggle={() => toggleMenu('stakeholders')}
                role={role}
              />
            );
          }

          // Handle ESG DD submenu
          if (item.name === 'ESG DD') {
            return (
              <ESGDDSubmenu
                key={item.name}
                isExpanded={expandedMenus['esgdd'] || false}
                onToggle={() => toggleMenu('esgdd')}
              />
            );
          }

          // Handle Reports submenu
          if (item.name === 'Reports') {
            return (
              <ReportsSubmenu
                key={item.name}
                isExpanded={expandedMenus['reports'] || false}
                onToggle={() => toggleMenu('reports')}
              />
            );
          }

          // Skip Stakeholders for non-admin/manager roles to prevent empty space
          if (item.name === 'Stakeholders' && !(role === 'admin' || role === 'manager')) {
            return null;
          }

          // Regular navigation items
          const isActive = location.pathname === item.href;
          const isExternalLink = item.href.startsWith('http');

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                {isExternalLink ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </a>
                ) : (
                  <Link to={item.href} className="flex items-center w-full">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
