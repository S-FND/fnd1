
// import React from 'react';
// import { useSocket } from '@/context/SocketContext';
// import { Bell, Clock, CheckCircle } from 'lucide-react';
// import { format } from 'date-fns';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

// const NotificationsPage: React.FC = () => {
//   const { notifications, markAsRead } = useSocket();

//   const handleMarkAsRead = (notificationId: string) => {
//     markAsRead(notificationId);
//   };

//   const handleMarkAllAsRead = () => {
//     notifications.forEach(notification => {
//       if (!notification.isRead) {
//         markAsRead(notification._id);
//       }
//     });
//   };

//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   return (
//     <div className="container mx-auto p-6 max-w-4xl">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <Bell className="h-8 w-8" />
//           <h1 className="text-3xl font-bold">Notifications</h1>
//           {unreadCount > 0 && (
//             <Badge variant="secondary" className="ml-2">
//               {unreadCount} unread
//             </Badge>
//           )}
//         </div>
//         {unreadCount > 0 && (
//           <button
//             onClick={handleMarkAllAsRead}
//             className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
//           >
//             <CheckCircle className="h-4 w-4" />
//             Mark all as read
//           </button>
//         )}
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Notifications</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {notifications.length === 0 ? (
//             <div className="text-center py-12 text-muted-foreground">
//               <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
//               <p>No notifications yet</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {notifications.map((notification) => (
//                 <div
//                   key={notification._id}
//                   className={`p-4 rounded-lg border ${
//                     !notification.isRead ? 'bg-muted/50 border-primary/20' : 'bg-card'
//                   }`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{notification.message}</p>
//                       <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
//                         <Clock className="h-3 w-3" />
//                         <span>{format(new Date(notification.createdAt), 'PPP pp')}</span>
//                       </div>
//                     </div>
//                     {!notification.isRead && (
//                       <button
//                         onClick={() => handleMarkAsRead(notification._id)}
//                         className="ml-4 p-2 text-primary hover:bg-primary/10 rounded-md"
//                         title="Mark as read"
//                       >
//                         <CheckCircle className="h-4 w-4" />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default NotificationsPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '@/lib/httpClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCheck, Clock, Bell, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';

interface Notification {
    _id: string;
    sendFrom: {
        _id: string;
        name: string;
        email: string;
    };
    message: string;
    description: string;
    isRead: boolean;
    redirectUrl: string;
    createdAt: string;
    changedFields?: string[];
}

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response: any = await httpClient.get('notification');
            if (response.status === 200 && response.data?.status) {
                setNotifications(response.data.data || []);
            } else {
                toast.error('Failed to load notifications');
            }
        } catch (error) {
            toast.error('Error loading notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // ✅ Use PUT (not PATCH)
    const markAsRead = async (id: string) => {
        try {
            await httpClient.put('notification', { _id: id, isRead: true });
            setNotifications(prev =>
                prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    // ✅ Mark all by calling PUT for each unread
    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
            await Promise.all(
                unreadIds.map(id => httpClient.put('notification', { _id: id, isRead: true }))
            );
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
    
        if (notification.redirectUrl) {
            navigate(notification.redirectUrl, {
                state: {
                    changedFields: notification.changedFields || [],
                },
            });
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const sortedNotifications = [...notifications].sort((a, b) => {
        if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1; // unread (false) before read (true)
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (loading) {
        return (
            <UnifiedSidebarLayout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-8 w-8" />
                </div>
            </UnifiedSidebarLayout>
        );
    }

    const formatFieldName = (field: string) => {
        return field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };

    return (
        <UnifiedSidebarLayout>
            <div className=" mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/esg-dd/cap")}
                className="hover:bg-[#10b77f]/10 hover:text-[#10b77f] hover:border-[#10b77f]"
                >
                <ArrowLeft className="h-4 w-4" />
                </Button>

                <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                    <p className="text-sm text-gray-500">
                    {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                    </p>
                )}
                </div>
            </div>

            {unreadCount > 0 && (
                <Button
                variant="outline"
                onClick={markAllAsRead}
                className="flex items-center gap-2 hover:bg-[#10b77f]/10 hover:text-[#10b77f] hover:border-[#10b77f]"
                >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
                </Button>
            )}
            </div>

                {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-muted-foreground">No notifications yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedNotifications.map((notif) => (
                            <Card
                                key={notif._id}
                                className={`cursor-pointer transition-all hover:shadow-md ${!notif.isRead
                                        ? "border-l-4 border-l-[#10b77f] bg-[#10b77f]/10"
                                        : ""
                                    }`}

                                onClick={() => handleNotificationClick(notif)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-sm line-clamp-2">
                                                    {notif.message}
                                                </span>

                                                {!notif.isRead && (
                                                    <Badge variant="default" className="bg-[#10b77f] text-white text-xs">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* <p className="mt-1 text-left text-sm text-gray-600 line-clamp-3 break-words">
                                                {notif.description}
                                            </p> */}

                                            {notif.changedFields && notif.changedFields.length > 0 && (
                                                <div className="mt-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {notif.changedFields.map((field) => (
                                                            <Badge
                                                                key={field}
                                                                variant="outline"
                                                                className="text-xs bg-green-50 text-green-700 border-green-200"
                                                            >
                                                                {formatFieldName(field)}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(notif.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </div>
                                        </div>
                                        {!notif.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-[#10b77f] hover:bg-[#10b77f]/10 hover:text-[#10b77f]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notif._id);
                                                }}
                                            >
                                                Mark read
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </UnifiedSidebarLayout>
    );
};

export default NotificationsPage;