"use client";

import { NotificationCenter } from "./notification-center";
import { useNotifications } from "@/context/notification-context";

export function AppNotifications() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <NotificationCenter
        initialNotifications={notifications}
        onNotificationRead={markAsRead}
        onAllNotificationsRead={markAllAsRead}
        onClearNotifications={clearNotifications}
      />
    </div>
  );
}
