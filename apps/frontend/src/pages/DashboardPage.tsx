import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, ArrowUpRight, ArrowDownRight, Plus, CheckCircle, Loader2 } from 'lucide-react';
import { dashboardService } from '@/lib/services';
import { useI18nStore } from '@/stores/i18n.store';
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useI18nStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const d = await dashboardService.getStats();
        setStats(d);
      } catch {
        toast.error('Erro ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (<div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-gray-400" /></div>);

  const revenue = stats?.revenue || 0;
  const salesCount = stats?.salesCount || 0;
  const customersCount = stats?.customersCount || 0;
  const productsCount = stats?.productsCount || 0;
  const recentSales = stats?.recentSales || [];
  const recentCustomers = stats?.recentCustomers || [];

  const statCards = [
    { label: t('revenue'), value: `R$ ${(revenue / 100).toFixed(2)}`, change: '+12.5%', up: true, icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { label: t('sales'), value: salesCount.toString(), change: '+8.2%', up: true, icon: ShoppingCart, color: 'from-blue-500 to-indigo-500' },
    { label: t('clients'), value: customersCount.toString(), change: '+5.1%', up: true, icon: Users, color: 'from-violet-500 to-purple-500' },
    { label: t('products'), value: productsCount.toString(), change: t('active'), up: true, icon: Package, color: 'from-amber-500 to-orange-500' },
  ];

  const chartData = [
    { name: 'Seg', value: 400 }, { name: 'Ter', value: 600 }, { name: 'Qua', value: 800 },
    { name: 'Qui', value: 700 }, { name: 'Sex', value: 900 }, { name: 'Sáb', value: 500 }, { name: 'Dom', value: 300 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{t('dashboard')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('overview')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card p-5 group cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden"
            onClick={() => {
              if (stat.label === 'Clientes') navigate('/clientes');
              else if (stat.label === 'Produtos') navigate('/produtos');
              else if (stat.label === 'Vendas') navigate('/vendas');
              else navigate('/financeiro');
            }}>
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.up ? <ArrowUpRight size={13} className="text-emerald-500" /> : <ArrowDownRight size={13} className="text-red-500" />}
                  <span className={`text-xs font-semibold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change}</span>
                  <span className="text-xs text-gray-400">{t('vsPrevious')}</span>
                </div>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t('weeklyRevenue')}</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }} formatter={(v: number) => `R$ ${(v).toFixed(2)}`} />
                <Bar dataKey="value" fill="#0071e3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t('quickActions')}</h2>
          <div className="space-y-2">
            {[
              { label: t('newSale'), icon: ShoppingCart, color: 'bg-blue-500', action: () => navigate('/vendas') },
              { label: t('newClient'), icon: Users, color: 'bg-violet-500', action: () => navigate('/clientes') },
              { label: t('newProduct'), icon: Package, color: 'bg-amber-500', action: () => navigate('/produtos') },
              { label: t('newTransaction'), icon: DollarSign, color: 'bg-emerald-500', action: () => navigate('/financeiro') },
              { label: t('reports'), icon: TrendingUp, color: 'bg-pink-500', action: () => navigate('/relatorios') },
            ].map((action) => (
              <button key={action.label} onClick={action.action}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200 group">
                <div className={`w-9 h-9 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                  <action.icon size={16} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{action.label}</span>
                <Plus size={14} className="ml-auto text-gray-400 group-hover:text-gray-600" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t('lastSales')}</h2>
          <div className="space-y-2">{recentSales.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">{t('noSales')}</p> : recentSales.map((s: any, i: number) => (
            <div key={s.id || i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/40 dark:bg-white/5 text-sm cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 transition-colors" onClick={() => navigate('/vendas')}>
              <div className="flex items-center gap-2.5"><CheckCircle size={14} className="text-emerald-400" /><span className="font-medium text-gray-700 dark:text-gray-300">{s.number}</span><span className="text-xs text-gray-400">{s.customer || t('casual')}</span></div>
              <span className="text-xs font-semibold text-emerald-600">R$ {(s.total / 100).toFixed(2)}</span>
            </div>))}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t('newCustomers')}</h2>
          <div className="space-y-2">{recentCustomers.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">{t('noClients')}</p> : recentCustomers.map((c: any, i: number) => (
            <div key={c.id || i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/40 dark:bg-white/5 text-sm cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 transition-colors" onClick={() => navigate('/clientes')}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{c.name?.charAt(0)}</div>
              <div><p className="text-xs font-medium text-gray-900 dark:text-white">{c.name}</p>{c.email && <p className="text-[11px] text-gray-400">{c.email}</p>}</div>
            </div>))}</div>
        </motion.div>
      </div>
    </motion.div>
  );
}