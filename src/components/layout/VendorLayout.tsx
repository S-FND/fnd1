
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "./Navbar";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VendorLayoutProps {
  children: React.ReactNode;
}

export const VendorLayout: React.FC<VendorLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "Available Trainings", href: "/vendor/trainings", icon: Calendar },
    { name: "My Bids", href: "/vendor/bids", icon: FileText },
    { name: "Profile", href: "/vendor/profile", icon: User },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block w-64 border-r h-[calc(100vh-64px)] fixed">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <div className="font-medium mb-2">{user?.vendorInfo?.companyName}</div>
              <div className="text-xs text-muted-foreground">Vendor Portal</div>
            </div>
            <div className="flex-1 px-3 py-2">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Button
                      key={item.name}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        !isActive && "hover:bg-muted"
                      )}
                      asChild
                    >
                      <Link to={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            </div>
            <div className="p-4 border-t">
              <div className="text-xs text-muted-foreground">
                <p>Logged in as:</p>
                <p className="font-medium">{user?.name}</p>
              </div>
            </div>
          </div>
        </div>
        <main className="lg:pl-64 w-full">
          <div className="container p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
