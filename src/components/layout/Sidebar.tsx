
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, Building2, Building, ClipboardCheck, GraduationCap, LayoutDashboard, LineChart, Settings, Users, FileCheck, BookOpen } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent } from '@/components/ui/sidebar';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee', 'unit_admin'] },
  { name: 'Materiality', href: '/materiality', icon: BarChart3, roles: ['admin', 'manager', 'unit_admin'] },
  { name: 'ESG Management', href: '/esg', icon: BarChart3, roles: ['admin', 'manager', 'unit_admin'] },
  { name: 'GHG Accounting', href: '/ghg-accounting', icon: LineChart, roles: ['admin', 'manager'] },
  { name: 'Unit GHG Data', href: '/unit/ghg-accounting', icon: LineChart, roles: ['unit_admin'] },
  { name: 'Personal Carbon', href: '/personal-ghg', icon: LineChart, roles: ['employee'] },
  { name: 'Compliance', href: '/compliance', icon: ClipboardCheck, roles: ['admin', 'manager', 'unit_admin'] },
  { name: 'Supplier Audits', href: '/audit', icon: FileCheck, roles: ['admin', 'manager'] },
  { name: 'EHS Trainings', href: '/ehs-trainings', icon: BookOpen, roles: ['admin', 'manager', 'unit_admin'] },
  { name: 'LMS', href: '/lms', icon: GraduationCap, roles: ['admin', 'manager', 'employee', 'unit_admin'] },
  { name: 'Units Management', href: '/units', icon: Building2, roles: ['admin'] },
  { name: 'Team Management', href: '/team', icon: Users, roles: ['admin', 'manager', 'unit_admin'] },
  { name: 'Company Profile', href: '/company', icon: Building, roles: ['admin', 'manager'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'manager', 'employee', 'unit_admin'] },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <div className="flex h-16 items-center justify-between px-4 md:px-6 border-b">
            <SidebarTrigger />
          </div>
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || 'employee';

  return (
    <Sidebar>
      <SidebarContent className="p-2">
        <div className="mb-10 px-4 py-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
              <span className="text-white">F</span>
            </div>
            <span>Fandoro</span>
          </Link>
          {user?.role === 'unit_admin' && user?.unitId && (
            <div className="mt-2 text-xs text-muted-foreground">
              {user.units ? user.units.find(unit => unit.id === user.unitId)?.name : 'Unit Admin'}
            </div>
          )}
        </div>
        
        <nav className="space-y-1.5">
          {navigationItems
            .filter(item => item.roles.includes(role))
            .map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  location.pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};
