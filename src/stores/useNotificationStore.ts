// dev/src/stores/useNotificationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotificationData } from "@/types/apis/notification";

type NotificationState = {
  notifications: NotificationData[];
  unreadCount: number;
  currentToast: NotificationData | null;
  highlightRebuttalId: number | null;
  
  addNotification: (notification: NotificationData) => void;
  showToast: (notification: NotificationData) => void;
  hideToast: () => void;
  setHighlightRebuttal: (id: number | null) => void;
  markAsRead: (timestamp: number) => void;
  removeNotification: (timestamp: number) => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      currentToast: null,
      highlightRebuttalId: null,

      addNotification: (notification) =>
        set((state) => ({
          notifications: [{ ...notification, isRead: false }, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),

      showToast: (notification) =>
        set({ currentToast: notification }),

      hideToast: () =>
        set({ currentToast: null }),

      setHighlightRebuttal: (id) =>
        set({ highlightRebuttalId: id }),

      markAsRead: (timestamp) =>
        set((state) => {
          const notification = state.notifications.find(n => n.timestamp === timestamp);
          if (notification && !notification.isRead) {
            return {
              notifications: state.notifications.map(n =>
                n.timestamp === timestamp ? { ...n, isRead: true } : n
              ),
              unreadCount: Math.max(0, state.unreadCount - 1),
            };
          }
          return state;
        }),

      removeNotification: (timestamp) =>
        set((state) => {
          const notification = state.notifications.find(n => n.timestamp === timestamp);
          const wasUnread = notification && !notification.isRead;
          
          return {
            notifications: state.notifications.filter(n => n.timestamp !== timestamp),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          };
        }),

      clearNotifications: () =>
        set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "notification-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);