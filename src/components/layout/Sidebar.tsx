
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, ClipboardCheck, GraduationCap, LayoutDashboard, LineChart, Settings, Users } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent } from '@/components/ui/sidebar';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'ESG Management', href: '/esg', icon: BarChart3 },
  { name: 'GHG Accounting', href: '/ghg', icon: LineChart },
  { name: 'Compliance', href: '/compliance', icon: ClipboardCheck },
  { name: 'LMS', href: '/lms', icon: GraduationCap },
  { name: 'Team Management', href: '/team', icon: Users, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: Settings },
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
              <span className="text-white">E</span>
            </div>
            <span>EcoNexus</span>
          </Link>
        </div>
        
        <nav className="space-y-1.5">
          {navigationItems
            .filter(item => !item.adminOnly || role === 'admin')
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
