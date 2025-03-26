"use client";

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '@/components/notification-center';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number; // Maximum number of notifications to store
  localStorageKey?: string; // Key for localStorage persistence
}

export function NotificationProvider({
  children,
  maxNotifications = 50,
  localStorageKey = 'neurolog_notifications',
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedNotifications = localStorage.getItem(localStorageKey);
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          // Convert string timestamps back to Date objects
          const processedNotifications = parsedNotifications.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
          setNotifications(processedNotifications);
        }
      } catch (error) {
        console.error('Failed to load notifications from localStorage:', error);
      }
    }
  }, [localStorageKey]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && notifications.length > 0) {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(notifications));
      } catch (error) {
        console.error('Failed to save notifications to localStorage:', error);
      }
    }
  }, [notifications, localStorageKey]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const id = uuidv4();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => {
      // Add new notification and limit the total number
      const updated = [newNotification, ...prev].slice(0, maxNotifications);
      return updated;
    });

    return id;
  }, [maxNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(localStorageKey);
    }
  }, [localStorageKey]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
