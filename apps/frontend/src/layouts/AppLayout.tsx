import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth.store';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';

export function AppLayout() {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="p-6"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Status Bar (tipo Windows 11) */}
        <footer className="h-8 px-4 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span>{user?.tenantName}</span>
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span>Online</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{user?.name}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}