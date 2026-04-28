// services/notificationService.ts

export interface Notification {
    _id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }
  
  let listeners: Function[] = [];
  let notifications: Notification[] = [];
  
  export const subscribeNotifications = (cb: Function) => {
    listeners.push(cb);
    cb(notifications);
  
    return () => {
      listeners = listeners.filter(l => l !== cb);
    };
  };
  
  const notifyAll = () => {
    listeners.forEach(cb => cb([...notifications]));
  };
  
  export const addNotifications = (newNotifications: Notification[]) => {
    const existingIds = new Set(notifications.map(n => n._id));
  
    const filtered = newNotifications.filter(n => !existingIds.has(n._id));
  
    notifications = [...filtered, ...notifications];
    notifyAll();
  };
  
  export const markNotificationRead = (id: string) => {
    notifications = notifications.map(n =>
      n._id === id ? { ...n, isRead: true } : n
    );
    notifyAll();
  };