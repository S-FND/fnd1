
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, FileCheck, Building2, Calendar, 
  GraduationCap, LayoutDashboard, LineChart, 
  Settings, Users, BookOpen, Shield, AlertTriangle, 
  ClipboardCheck, ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider, 
  SidebarTrigger
} from '@/components/ui/sidebar';

interface SidebarNavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  icon: Icon, 
  label, 
  href,
  isActive
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <Link to={href} className="w-full">
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface EnhancedSidebarLayoutProps {
  children: React.ReactNode;
}

export const EnhancedSidebarLayout: React.FC<EnhancedSidebarLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <EnhancedSidebar />
        <div className="flex-1">
          <div className="flex h-16 items-center justify-between px-4 md:px-6 border-b">
            <SidebarTrigger />
            <div className="ml-auto flex items-center space-x-4">
              {/* Additional header components can go here */}
            </div>
          </div>
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const EnhancedSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const adminNavigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Materiality', href: '/materiality', icon: BarChart3 },
    { name: 'ESG Management', href: '/esg', icon: BarChart3 },
    { name: 'GHG Accounting', href: '/ghg', icon: LineChart },
    { name: 'Compliance', href: '/compliance', icon: ClipboardCheck },
    { name: 'Audit', href: '/audit', icon: FileCheck },
    { name: 'LMS', href: '/lms', icon: GraduationCap },
    { name: 'EHS Trainings', href: '/ehs-trainings', icon: BookOpen },
    { name: 'Unit Management', href: '/units', icon: Building2 },
    { name: 'Team', href: '/team', icon: Users },
  ];

  const employeeNavigationItems = [
    { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'Personal Carbon', href: '/personal-ghg', icon: LineChart },
    { name: 'Learning', href: '/lms', icon: GraduationCap },
    { name: 'Profile', href: '/profile', icon: Users },
  ];

  const navigationItems = role === 'admin' || role === 'manager' ? adminNavigationItems : employeeNavigationItems;

  return (
    <Sidebar>
      <SidebarHeader className="border-b pb-2">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl px-2">
          <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
            <span className="text-white">F</span>
          </div>
          <span>Fandoro</span>
        </Link>
        {user?.role === 'unit_admin' && user?.unitId && (
          <div className="mt-1 px-2 text-xs text-muted-foreground">
            {user.units ? user.units.find(unit => unit.id === user.unitId)?.name : 'Unit Admin'}
          </div>
        )}
        {user?.role === 'fandoro_admin' && (
          <div className="mt-1 px-2 text-xs font-semibold text-primary">
            Fandoro Admin
          </div>
        )}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <div className="mt-1 px-2 text-xs font-semibold text-primary">
            Company Admin
          </div>
        )}
        {user?.role === 'employee' && (
          <div className="mt-1 px-2 text-xs font-semibold text-muted-foreground">
            Employee
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarNavItem
                  key={item.name}
                  icon={item.icon}
                  label={item.name}
                  href={item.href}
                  isActive={location.pathname === item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {(role === 'admin' || role === 'manager') && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarNavItem
                  icon={Building2}
                  label="Company Profile"
                  href="/company"
                  isActive={location.pathname === '/company'}
                />
                <SidebarNavItem
                  icon={Settings}
                  label="Settings"
                  href="/settings"
                  isActive={location.pathname === '/settings'}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t">
        <div className="p-2">
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium">{user.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default EnhancedSidebar;
