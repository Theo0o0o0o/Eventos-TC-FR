import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'registration' | 'event_update' | 'event_cancel';
  read: boolean;
  createdAt: Date;
  eventId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
  getUserNotifications: (userId: string) => Notification[];
}

let nextNotifId = 1;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    setNotifications((prev) => [
      { ...n, id: `notif-${nextNotifId++}`, read: false, createdAt: new Date() },
      ...prev,
    ]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback((userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, read: true } : n))
    );
  }, []);

  const getUnreadCount = useCallback(
    (userId: string) => notifications.filter((n) => n.userId === userId && !n.read).length,
    [notifications]
  );

  const getUserNotifications = useCallback(
    (userId: string) => notifications.filter((n) => n.userId === userId),
    [notifications]
  );

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, getUnreadCount, getUserNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
