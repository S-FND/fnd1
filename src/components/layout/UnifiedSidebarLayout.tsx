import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Bell, HelpCircle, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarHeaderComponent } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarAdminSettings } from './sidebar/SidebarAdminSettings';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';

// Get environment name & API URL from Vite env variables
const envName = import.meta.env.VITE_ENV_NAME || (import.meta.env.MODE === 'production' ? 'Production' : import.meta.env.MODE === 'development' ? 'Development' : import.meta.env.MODE);
const apiUrl = import.meta.env.VITE_API_URL;
interface UnifiedSidebarLayoutProps {
  children: React.ReactNode;
}
export const UnifiedSidebarLayout: React.FC<UnifiedSidebarLayoutProps> = ({
  children
}) => {
  const {
    user,
    logout
  } = useAuth();
  return <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <UnifiedSidebar />
        <div className="flex-1">
          {/* Unified Header with Navbar functionality */}
          <header className="border-b sticky top-0 z-50 bg-background">
            <div className="flex h-16 items-center px-4 md:px-6">
              <SidebarTrigger />
              
              <Link to="/" className="flex items-center gap-2 font-bold text-xl ml-4">
                
                
              </Link>

              {/* ENVIRONMENT NAME & API URL INDICATOR */}
              <div className="ml-6 flex items-center space-x-3">
                <span className={`text-xs px-2 py-1 rounded font-semibold ${envName === 'Production' ? 'bg-green-500 text-white' : envName === 'Staging' ? 'bg-yellow-400 text-black' : 'bg-gray-400 text-white'}`} title="Current environment">
                  {envName}
                </span>
                {apiUrl && <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground" title="API URL in use" style={{
                maxWidth: 220,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block'
              }}>
                    {apiUrl}
                  </span>}
              </div>

              {/* Search and Right Actions */}
              <div className="ml-auto flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input type="search" placeholder="Search..." className="rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm" />
                </div>
                
                {/* Notification */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-auto">
                      <div className="p-3 hover:bg-muted">
                        <p className="text-sm font-medium">BRSR Report Due Soon</p>
                        <p className="text-xs text-muted-foreground">3 days remaining for submission</p>
                      </div>
                      <div className="p-3 hover:bg-muted">
                        <p className="text-sm font-medium">EHS Training Update</p>
                        <p className="text-xs text-muted-foreground">New chemical safety module available</p>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Help */}
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
                
                {/* User Menu */}
                {user ? <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div>
                          <p>{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile">Profile Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> : <Button variant="default" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>}
              </div>
            </div>
          </header>
          
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
const UnifiedSidebar: React.FC = () => {
  const location = useLocation();
  const {
    user
  } = useAuth();
  const role = user?.role || 'employee';
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    esgdd: location.pathname.startsWith('/esg-dd'),
    reports: location.pathname.startsWith('/reports'),
    stakeholders: location.pathname.startsWith('/stakeholders')
  });
  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };
  return <Sidebar>
      <SidebarHeaderComponent user={user} />
      
      <SidebarContent>
        <SidebarNavigation role={role} expandedMenus={expandedMenus} toggleMenu={toggleMenu} />
        
        <SidebarAdminSettings role={role} />
      </SidebarContent>
      
      <SidebarUserProfile user={user} />
    </Sidebar>;
};

// Export the unified sidebar as the default layout
export const SidebarLayout = UnifiedSidebarLayout;
export default UnifiedSidebarLayout;