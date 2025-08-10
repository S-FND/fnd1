
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface SidebarSubmenuProps {
  name: string;
  icon: React.ElementType;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({
  name,
  icon: Icon,
  isExpanded,
  isActive,
  onToggle,
  children
}) => {
  return (
    <React.Fragment>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={onToggle}
          isActive={isActive}
          tooltip={name}
          className="w-full justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{name}</span>
          </div>
          <ChevronRight 
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isExpanded && "rotate-90"
            )} 
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isExpanded && (
        <SidebarMenuSub className="ml-4 border-l border-sidebar-border/50">
          {children}
        </SidebarMenuSub>
      )}
    </React.Fragment>
  );
};
