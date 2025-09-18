
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, BarChart3, FileText, LineChart } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePermissionBasedNavigation } from '@/hooks/usePermissionBasedNavigation';

interface ESGManagementSubmenuProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const ESGManagementSubmenu: React.FC<ESGManagementSubmenuProps> = ({
  isExpanded,
  onToggle
}) => {
  const location = useLocation();
  const { hasPermission } = usePermissionBasedNavigation();

  const submenuItems = [
    { name: "Overview", href: "/esg", icon: BarChart3, permissionId: "esg-management.overview" },
    { name: "ESMS", href: "/esg/esms", icon: FileText, permissionId: "esg-management.esms" },
    { name: "ESG Metrics", href: "/esg/metrics", icon: LineChart, permissionId: "esg-management.metrics" }
  ];

  // Filter items based on permissions
  const accessibleItems = submenuItems.filter(item => hasPermission(item.permissionId));

  // Don't render if no accessible items
  if (accessibleItems.length === 0) {
    return null;
  }

  return (
    <SidebarMenuItem>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>ESG Management</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {accessibleItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuSubItem key={item.name}>
                  <SidebarMenuSubButton asChild isActive={isActive}>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};
