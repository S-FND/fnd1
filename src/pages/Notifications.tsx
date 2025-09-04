
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