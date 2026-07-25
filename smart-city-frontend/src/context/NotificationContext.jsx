import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { getNotifications } from '../api/complaints';
import { ROLES } from '../utils/constants';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const { subscribe, events } = useSocket();
  const [notifications, setNotifications] = useState([]);

  const refresh = useCallback(async () => {
    if (!user || user.role !== ROLES.CITIZEN) return;
    try {
      const data = await getNotifications({ userId: user._id });
      setNotifications(data);
    } catch {
      // notification fetch failing shouldn't break the app
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user || user.role !== ROLES.CITIZEN) return;
    const unsubscribe = subscribe(events.STATUS_UPDATED, (complaint) => {
      if (complaint.userId !== user._id) return;
      setNotifications((prev) => [
        {
          _id: `n-live-${Date.now()}`,
          userId: user._id,
          message: `Your complaint ${complaint._id} is now ${complaint.status}.`,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    });
    return unsubscribe;
  }, [user, subscribe, events]);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
