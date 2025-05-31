
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';
import { getNavigationItems } from './navigationData';
import { StakeholdersSubmenu } from './StakeholdersSubmenu';
import { ESGDDSubmenu } from './ESGDDSubmenu';
import { ReportsSubmenu } from './ReportsSubmenu';

export const SidebarNavigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const navigationItems = getNavigationItems(user.role);

  const toggleSubmenu = (name: string) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        {navigationItems.map((item) => {
          // Handle Stakeholders submenu
          if (item.name === 'Stakeholders') {
            return (
              <StakeholdersSubmenu
                key={item.name}
                isExpanded={expandedSubmenus['Stakeholders'] || false}
                onToggle={() => toggleSubmenu('Stakeholders')}
                role={user.role}
              />
            );
          }

          // Handle ESG DD submenu
          if (item.name === 'ESG DD') {
            return (
              <ESGDDSubmenu
                key={item.name}
                isExpanded={expandedSubmenus['ESG DD'] || false}
                onToggle={() => toggleSubmenu('ESG DD')}
                role={user.role}
              />
            );
          }

          // Handle Reports submenu
          if (item.name === 'Reports') {
            return (
              <ReportsSubmenu
                key={item.name}
                isExpanded={expandedSubmenus['Reports'] || false}
                onToggle={() => toggleSubmenu('Reports')}
                role={user.role}
              />
            );
          }

          // Regular navigation items
          const isActive = location.pathname === item.href;
          const isExternalLink = item.href.startsWith('http');

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                {isExternalLink ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="w-full">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </a>
                ) : (
                  <Link to={item.href} className="w-full">
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
