
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, HelpCircle, Search, User, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOverlay } from '@/context/OverlayContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOverlayActive, toggleOverlay } = useOverlay();
  
  // Only show overlay toggle for company admin role
  const isCompanyAdmin = user?.role === 'admin';
  
  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Left side with sidebar trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>

        {/* Search and Right Actions */}
        <div className="ml-auto flex items-center gap-4">
          {/* Overlay Toggle - Only for Company Admin */}
          {/* {isCompanyAdmin && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-card">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Features</span>
              <Switch
                checked={!isOverlayActive}
                onCheckedChange={() => toggleOverlay()}
                className="ml-2"
              />
              <span className="text-xs text-muted-foreground">
                {isOverlayActive ? 'Inactive' : 'Active'}
              </span>
            </div>
          )} */}

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
            <DropdownMenuContent align="end" className="w-80 z-20">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <div className="max-h-[300px] overflow-auto">
                <div className="p-3 hover:bg-muted">
                  <p className="text-sm font-medium">BRSR Report Due Soon</p>
                  <p className="text-xs text-muted-foreground">3 days remaining for submission</p>
                </div>
                <div className="p-3 hover:bg-muted">
                  <p className="text-sm font-medium">EHS Training Update</p>
                  <p className="text-xs text-muted-foreground">New chemical safety module available</p>
                </div>
              </div> */}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-20">
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
            </DropdownMenu>
          ) : (
            <Button variant="default" asChild>
              <Link to="/">Log In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
