import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingCart, Package, DollarSign, Settings, ChevronLeft, ChevronRight, Search, Command, BarChart3, Truck, ShoppingBag, Box, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useI18nStore } from '@/stores/i18n.store';
import { openCommandPalette } from '@/components/assistant/CommandPalette';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();
  const { t } = useI18nStore();

  const mainMenu = [
    { label: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { label: t('clients'), icon: Users, path: '/clientes' },
    { label: t('suppliers'), icon: Truck, path: '/fornecedores' },
    { label: t('products'), icon: Package, path: '/produtos' },
    { label: t('sales'), icon: ShoppingCart, path: '/vendas' },
    { label: t('purchases'), icon: ShoppingBag, path: '/compras' },
    { label: t('financial'), icon: DollarSign, path: '/financeiro' },
    { label: t('stock'), icon: Box, path: '/estoque' },
  ];

  const secondaryMenu = [
    { label: t('reports'), icon: BarChart3, path: '/relatorios' },
    { label: t('users'), icon: ShieldCheck, path: '/usuarios' },
    { label: t('settings2'), icon: Settings, path: '/configuracoes' },
    { label: 'Auditoria', icon: ShieldCheck, path: '/auditoria' },
  ];

  return (
    <motion.aside animate={{ width: collapsed ? 76 : 260 }} transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      className="h-screen glass-panel flex flex-col relative z-20 rounded-none border-l-0 border-t-0 border-b-0">
      <div className="h-14 flex items-center px-4 border-b border-white/10">
        <AnimatePresence mode="wait">{!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25"><Command className="w-4 h-4 text-white" /></div>
            <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white">Ferramenta</span>
          </motion.div>)}</AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-400"><ChevronRight size={16} style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }} /></button>
      </div>
      {!collapsed && (<div className="px-3 pt-4">
        <button onClick={openCommandPalette} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 bg-black/[0.03] dark:bg-white/[0.03] rounded-xl hover:bg-black/[0.06] border border-white/10 cursor-pointer"><Search size={14} /><span>{t('search')}</span><kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-black/[0.06] dark:bg-white/[0.06] text-gray-400 font-mono">⌘K</kbd></button>
      </div>)}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        <p className={`text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-2 ${collapsed ? 'text-center' : ''}`}>{collapsed ? '···' : t('main')}</p>
        <MenuSection items={mainMenu} collapsed={collapsed} />
        <div className="my-4 mx-2 border-t border-white/10" />
        <p className={`text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-2 ${collapsed ? 'text-center' : ''}`}>{collapsed ? '···' : t('system')}</p>
        <MenuSection items={secondaryMenu} collapsed={collapsed} />
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-lg shadow-purple-500/25">{user?.name?.charAt(0)?.toUpperCase()}</div>
          {!collapsed && (<div className="min-w-0 flex-1"><p className="text-xs font-semibold truncate text-gray-900 dark:text-white">{user?.name}</p><p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user?.email}</p></div>)}
        </div>
      </div>
    </motion.aside>
  );
}

function MenuSection({ items, collapsed }: { items: { label: string; icon: any; path: string }[]; collapsed: boolean }) {
  return (<>{items.map((item) => (
    <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'} ${collapsed ? 'justify-center' : ''}`} title={collapsed ? item.label : undefined}><item.icon size={18} />{!collapsed && <span>{item.label}</span>}</NavLink>))}</>);
}