import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ShoppingCart, Package, DollarSign, TrendingUp,
  Settings, ChevronLeft, ChevronRight, Search, Command,
  BarChart3, Bell
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

const mainMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Clientes', icon: Users, path: '/clientes' },
  { label: 'Produtos', icon: Package, path: '/produtos' },
  { label: 'Vendas', icon: ShoppingCart, path: '/vendas' },
  { label: 'Financeiro', icon: DollarSign, path: '/financeiro' },
];

const secondaryMenu = [
  { label: 'Relatórios', icon: BarChart3, path: '/relatorios' },
  { label: 'Configurações', icon: Settings, path: '/configuracoes' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      className="h-screen glass-panel flex flex-col relative z-20 rounded-none border-l-0 border-t-0 border-b-0"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/10">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Command className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white">
                Ferramenta
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pt-4">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 dark:text-gray-500 bg-black/[0.03] dark:bg-white/[0.03] rounded-xl hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors border border-white/10">
            <Search size={14} />
            <span>Buscar (Ctrl+K)</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-black/[0.06] dark:bg-white/[0.06] text-gray-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        <p className={`text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-2 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '···' : 'Principal'}
        </p>
        <MenuSection items={mainMenu} collapsed={collapsed} />
        <div className="my-4 mx-2 border-t border-white/10" />
        <p className={`text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-2 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '···' : 'Sistema'}
        </p>
        <MenuSection items={secondaryMenu} collapsed={collapsed} />
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-lg shadow-purple-500/25">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

function MenuSection({ items, collapsed }: { items: typeof mainMenu; collapsed: boolean }) {
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
            } ${collapsed ? 'justify-center' : ''}`
          }
          title={collapsed ? item.label : undefined}
        >
          <item.icon size={18} />
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </>
  );
}