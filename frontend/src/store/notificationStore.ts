import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'LOW_STOCK' | 'WARRANTY_EXPIRY' | 'MAINTENANCE_DUE' | 'ASSIGNMENT';
  time: string;
  isRead: boolean;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'A4 Printing Paper is below minimum threshold (15 reams left).',
    type: 'LOW_STOCK',
    time: '2 hours ago',
    isRead: false,
    link: '/stock',
  },
  {
    id: '2',
    title: 'Warranty Expiry',
    message: 'Warranty for "Dell Projector - Lab 3" expires in 7 days.',
    type: 'WARRANTY_EXPIRY',
    time: '5 hours ago',
    isRead: false,
    link: '/assets',
  },
  {
    id: '3',
    title: 'Maintenance Completed',
    message: 'Repair request for "HP Laserjet" has been marked as completed.',
    type: 'MAINTENANCE_DUE',
    time: 'Yesterday',
    isRead: true,
    link: '/maintenance',
  },
  {
    id: '4',
    title: 'Asset Assigned',
    message: 'New asset "iMac 24" M3" has been assigned to Jane Smith.',
    type: 'ASSIGNMENT',
    time: '2 days ago',
    isRead: true,
    link: '/assets',
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      addNotification: (n) => {
        const newNotification: Notification = {
          ...n,
          id: Math.random().toString(36).substring(7),
          isRead: false,
          time: 'Just now',
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },
      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },
      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      clearAll: () => {
        set({ notifications: [] });
      },
      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);
