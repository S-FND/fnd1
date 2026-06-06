import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, HelpCircle, Search, User, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOverlay } from '@/context/OverlayContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { socketConnect } from '@/context/SocketContext';
import { toast } from 'sonner';
import { logger } from '@/hooks/logger';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, ArrowRightLeft } from 'lucide-react';

interface NavbarProps {
  hideSidebarTrigger?: boolean; // Add prop to hide sidebar trigger
}

interface Notification {
  _id: string;
  createdBy: string;
  sendTo: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const Navbar: React.FC<NavbarProps> = ({ hideSidebarTrigger = false }) => {
  const { user, logout } = useAuth();
  const { isOverlayActive, toggleOverlay } = useOverlay();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams(); // ← ADD this line

  const navigate = useNavigate(); // ← ADD
  
  // Detect current module from route
  const currentType: "mis" | "escap" | null = 
    location.pathname.startsWith('/mis') ? 'mis' :
    location.pathname.startsWith('/esg-dd') || location.pathname.startsWith('/escap') ? 'escap' :
    null;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down & past a threshold -> hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Only show overlay toggle for company admin role
  const isCompanyAdmin = user?.role === 'admin';

  const assessmentConfig = {
    mis: { 
      label: "MIS", 
      color: "text-green-700 bg-green-50 border-green-200 hover:bg-green-100", 
      icon: <LayoutGrid className="h-3.5 w-3.5" />,
      description: "Management Information System"
    },
    escap: { 
      label: "ESCAP", 
      color: "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100", 
      icon: <Shield className="h-3.5 w-3.5" />,
      description: "ESG Corrective Action Plan"
    },
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    // debugger;
    if (token && user) {
      try {
        const socket = socketConnect(JSON.parse(token));

        socket.on("connect", () => {
          logger.log("✅ Socket connected successfully!");
          sessionStorage.setItem('socketId', socket.id);
        });

        socket.on("disconnect", (reason) => {
          logger.log('❌ Socket disconnected. Reason:', reason);
        });

        socket.on("connect_error", (error) => {
          logger.error('🔥 Socket connection error:', error.message);
        });

        // Handle notifications
        socket.on('notification', (data: any) => {
          logger.log('📨 Received notification:', data);
          if (data?.data?.data) {
            const newNotifications = data.data.data;
            setNotifications(prev => [...newNotifications, ...prev]);
          }
        });

        socket.on('toast/notification', (data: any) => {
          logger.log('💬 Received toast notification:', data);
          if (data?.data?.message) {
            toast.info(data.data.message);
          }
        });

        // Cleanup on unmount
        return () => {
          socket.disconnect();
        };
      } catch (error) {
        logger.error('💥 Failed to create socket:', error);
      }
    }
  }, [user]);

  // Update unread count whenever notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification._id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    // You can add navigation logic here based on notification type
  };

   const openAssessmentDialog = () => {
    setSearchParams((prev) => {
      prev.set("dialog", "assessment");
      if (currentType) prev.set("type", currentType);
      return prev;
    });
  };
  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="flex h-8 items-center px-4 md:px-6">
        {/* Left side with sidebar trigger - Hide when needed */}
        <div className="flex items-center gap-4">
          {!hideSidebarTrigger && <SidebarTrigger />}
        </div>

        {/* Search and Right Actions */}
        <div className="ml-auto flex items-center gap-4">
        {user?.misCompanyId && (
          <button
              onClick={openAssessmentDialog}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold 
                transition-all duration-150 hover:shadow-sm active:scale-95 cursor-pointer
                ${currentType 
                  ? assessmentConfig[currentType]?.color 
                  : "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100"
                }
              `}
              title={currentType ? "Click to change module" : "Select module"}
            >
              {currentType ? assessmentConfig[currentType]?.icon : <LayoutGrid className="h-3.5 w-3.5" />}
              <span>Select Module</span>
              <ArrowRightLeft className="h-3 w-3 opacity-60" />
            </button>
          )}
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
          {/* <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input type="search" placeholder="Search..." className="rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm" />
          </div> */}

          {/* Notification */}
          <DropdownMenu>
            {/* <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger> */}
            <DropdownMenuContent align="end" className="w-80 z-50">
              <DropdownMenuLabel>
                Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-3 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-3 hover:bg-muted cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                      {!notification.isRead && (
                        <span className="text-xs text-blue-500">• New</span>
                      )}
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 5 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="text-center w-full text-sm">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          {/* <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button> */}

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
                <DropdownMenuLabel>
                  <div>
                    <p>{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role !== 'employee' && (
                  <DropdownMenuItem asChild>
                    <Link to="/company">Profile Settings</Link>
                  </DropdownMenuItem>
                )}
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