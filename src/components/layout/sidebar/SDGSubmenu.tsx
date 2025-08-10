import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Target, FileText } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SDGSubmenuProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const SDGSubmenu: React.FC<SDGSubmenuProps> = ({
  isExpanded,
  onToggle
}) => {
  const location = useLocation();

  const submenuItems = [
    { name: "Overview", href: "/sdg", icon: Target },
    { name: "Strategy Setting", href: "/sdg/strategy", icon: FileText }
  ];

  return (
    <SidebarMenuItem>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>SDG</span>
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