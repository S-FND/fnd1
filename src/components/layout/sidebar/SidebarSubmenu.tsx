
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
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
    <>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={onToggle}
          isActive={isActive}
          tooltip={name}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <Icon className="mr-2 h-4 w-4" />
            <span>{name}</span>
          </div>
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "rotate-90"
          )} />
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isExpanded && (
        <div className="ml-6 space-y-1">
          {children}
        </div>
      )}
    </>
  );
};
