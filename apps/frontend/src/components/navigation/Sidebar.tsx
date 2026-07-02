import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Command,
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
  { label: 'Relatórios', icon: TrendingUp, path: '/relatorios' },
  { label: 'Configurações', icon: Settings, path: '/configuracoes' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="h-screen bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col relative z-20"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Command className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm tracking-tight">Ferramenta</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pt-4">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Search size={14} />
            <span>Buscar (Ctrl+K)</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <MenuSection items={mainMenu} collapsed={collapsed} />
        <div className="my-3 border-t border-gray-100 dark:border-gray-800" />
        <MenuSection items={secondaryMenu} collapsed={collapsed} />
      </nav>

      {/* User */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

function MenuSection({
  items,
  collapsed,
}: {
  items: typeof mainMenu;
  collapsed: boolean;
}) {
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
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