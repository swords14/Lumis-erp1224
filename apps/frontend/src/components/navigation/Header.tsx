import { useState } from 'react';
import { Bell, Moon, Sun, LogOut, X, Settings } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { useNotificationStore } from '@/stores/notification.store';
import { useI18nStore } from '@/stores/i18n.store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const { t } = useI18nStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-white/10 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.tenantName}</h2>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 transition-colors"
          title={isDark ? 'Modo claro' : 'Modo escuro'}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 transition-colors"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white dark:ring-gray-900">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notificações</h3>
                  <button onClick={() => setNotifOpen(false)} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400">
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`flex items-start gap-3 p-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] border-b border-white/5 last:border-0 cursor-pointer transition-colors ${!n.read ? 'bg-blue-500/[0.03] dark:bg-blue-500/[0.05]' : ''}`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${!n.read ? 'bg-blue-500 animate-pulse' : n.type === 'success' ? 'bg-emerald-400' : n.type === 'warning' ? 'bg-amber-400' : 'bg-gray-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{n.time}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { setNotifOpen(false); navigate('/configuracoes'); }}
                  className="w-full p-3 text-xs font-medium text-blue-500 hover:bg-blue-500/5 border-t border-white/10 flex items-center justify-center gap-1.5"
                >
                  <Settings size={12} />
                  {t('settings')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 bg-black/5 dark:bg-white/10 mx-1.5" />

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="p-2 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
          title={t('logout')}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}