"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, Check, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  linkText?: string;
}

interface NotificationCenterProps {
  initialNotifications?: Notification[];
  onNotificationRead?: (id: string) => void;
  onAllNotificationsRead?: () => void;
  onClearNotifications?: () => void;
}

export function NotificationCenter({
  initialNotifications = [],
  onNotificationRead,
  onAllNotificationsRead,
  onClearNotifications,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    onNotificationRead?.(id);
  }, [onNotificationRead]);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    onAllNotificationsRead?.();
  }, [onAllNotificationsRead]);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
    onClearNotifications?.();
  }, [onClearNotifications]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getColorClass = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 hover:bg-green-50';
      case 'warning':
        return 'border-l-amber-500 hover:bg-amber-50';
      case 'error':
        return 'border-l-red-500 hover:bg-red-50';
      case 'info':
      default:
        return 'border-l-blue-500 hover:bg-blue-50';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          <div className="flex gap-2 text-sm">
            {notifications.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  Clear all
                </Button>
              </>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No notifications</h3>
              <p className="text-sm text-muted-foreground/70 mt-2">
                When you receive notifications, they will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "border-l-4 p-4 rounded-md transition-colors",
                  !notification.read ? "bg-muted/50" : "bg-background",
                  getColorClass(notification.type)
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {notification.title}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>

                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="flex items-center gap-1 text-sm mt-2 text-primary hover:underline"
                        >
                          {notification.linkText || 'View details'}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </div>

                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1 px-2 text-xs hover:bg-transparent hover:text-primary"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
