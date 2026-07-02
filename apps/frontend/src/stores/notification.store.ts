import { create } from 'zustand';
import api from '@/lib/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    { id: '1', title: 'Bem-vindo! ✨', message: 'Sistema iniciado com sucesso. Explore os módulos na barra lateral.', time: 'Agora', type: 'success', read: false, createdAt: new Date().toISOString() },
    { id: '2', title: 'Dica rápida', message: 'Use Ctrl+K para abrir a busca rápida e navegar entre os módulos.', time: 'Agora', type: 'info', read: false, createdAt: new Date().toISOString() },
    { id: '3', title: 'Segurança', message: 'Configure o backup automático em Configurações > Backup.', time: '5 min', type: 'warning', read: false, createdAt: new Date().toISOString() },
  ],
  unreadCount: 3,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/notifications');
      const notifications = data.data || data;
      set({ notifications, unreadCount: notifications.filter((n: Notification) => !n.read).length });
    } catch {
      // fallback to local notifications
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: (id: string) => {
    set((s) => {
      const notifications = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    });
  },

  markAllAsRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
}));