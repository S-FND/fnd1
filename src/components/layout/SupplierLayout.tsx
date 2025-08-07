
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Building, ClipboardCheck, FileText, Home, Leaf, Settings, User } from 'lucide-react';

export const SupplierLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: "Dashboard", href: "/supplier/dashboard", icon: Home },
    { name: "GHG Inventory", href: "/supplier/ghg-inventory", icon: Leaf },
    { name: "Sustainability Audit", href: "/supplier/audit", icon: ClipboardCheck },
    { name: "Documents", href: "/supplier/documents", icon: FileText },
    { name: "Company Profile", href: "/supplier/profile", icon: Building },
    { name: "Settings", href: "/supplier/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r bg-background">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
              <span className="text-white">F</span>
            </div>
            <span>Fandoro</span>
          </Link>
          <div className="mt-2 text-xs text-muted-foreground">
            Supplier Portal
          </div>
        </div>
        
        <nav className="p-4 space-y-1.5">
          {navigationItems.map((item) => (
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
        
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="truncate flex-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 border-b bg-background flex items-center px-6 justify-between">
          {/* Mobile menu button would be here */}
          <div className="lg:hidden">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
                <span className="text-white">F</span>
              </div>
              <span>Fandoro</span>
            </Link>
          </div>
          
          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto">
            <button 
              className="text-sm font-medium hover:underline"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
