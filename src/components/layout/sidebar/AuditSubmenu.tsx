
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, FileText, Users, Shield, Building } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AuditSubmenuProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const AuditSubmenu: React.FC<AuditSubmenuProps> = ({
  isExpanded,
  onToggle
}) => {
  const location = useLocation();

  const submenuItems = [
    { name: "Supplier Audits", href: "/audit/supplier", icon: Users },
    { name: "EHS Audits", href: "/audit/ehs", icon: Shield },
    { name: "Internal Audits", href: "/audit/internal", icon: Building }
  ];

  return (
    <SidebarMenuItem>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Audit</span>
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
            {submenuItems.map((item) => {
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
