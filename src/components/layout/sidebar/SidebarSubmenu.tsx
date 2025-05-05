
import React from 'react';
import { Link } from 'react-router-dom';
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
    <React.Fragment>
      <SidebarMenuItem>
        <div 
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all cursor-pointer",
            isActive ? "text-accent-foreground" : "text-muted-foreground"
          )}
          onClick={onToggle}
        >
          <Icon className="h-5 w-5" />
          <span className="flex-1">{name}</span>
          <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </SidebarMenuItem>
      
      {isExpanded && (
        <div className="ml-4 pl-4 border-l border-muted">
          {children}
        </div>
      )}
    </React.Fragment>
  );
};
