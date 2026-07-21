import { useState, useEffect, useCallback } from 'react';
import { getActiveEmail } from '../utils/workspaceStorage.js';
import { getNotifications, addNotification, markNotificationRead, markAllNotificationsRead, getUnreadCount } from '../utils/notificationStorage.js';

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const refreshNotifications = useCallback(() => {
    const email = getActiveEmail();
    if (email) {
      const list = getNotifications(email);
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.read).length);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const createNotification = useCallback((notification) => {
    const email = getActiveEmail();
    if (email) {
      addNotification(email, notification);
      refreshNotifications();
    }
  }, [refreshNotifications]);

  const markAsRead = useCallback((notifId) => {
    const email = getActiveEmail();
    if (email) {
      markNotificationRead(email, notifId);
      refreshNotifications();
    }
  }, [refreshNotifications]);

  const markAllAsRead = useCallback(() => {
    const email = getActiveEmail();
    if (email) {
      markAllNotificationsRead(email);
      refreshNotifications();
    }
  }, [refreshNotifications]);

  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    notifications,
    unreadCount,
    isOpen,
    togglePanel,
    markAsRead,
    markAllAsRead,
    createNotification,
  };
}
