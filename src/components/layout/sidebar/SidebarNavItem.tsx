
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

interface SidebarNavItemProps {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  isActive: boolean;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon: Icon,
  label,
  href,
  isActive
}) => {
  // Check if it's an external link
  const isExternal = href.startsWith('http');
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        {isExternal ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="w-full">
            <Icon />
            <span>{label}</span>
          </a>
        ) : (
          <Link to={href} className="w-full">
            <Icon />
            <span>{label}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
