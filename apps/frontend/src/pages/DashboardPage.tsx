import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    label: 'Receita Hoje',
    value: 'R$ 0,00',
    change: '+12.5%',
    up: true,
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'Vendas',
    value: '0',
    change: '+8.2%',
    up: true,
    icon: ShoppingCart,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'Clientes',
    value: '0',
    change: '+5.1%',
    up: true,
    icon: Users,
    color: 'from-violet-500 to-purple-500',
  },
  {
    label: 'Produtos',
    value: '0',
    change: '-2.3%',
    up: false,
    icon: Package,
    color: 'from-amber-500 to-orange-500',
  },
];

export function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visão geral do seu negócio hoje
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-glass"
          >
            {/* Gradient accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
            />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.up ? (
                    <ArrowUpRight size={14} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.up ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-400">vs. ontem</span>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
              >
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 shadow-glass"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Atividade Recente
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nenhuma atividade recente
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 shadow-glass"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Nova Venda', icon: ShoppingCart, color: 'bg-blue-500' },
              { label: 'Novo Cliente', icon: Users, color: 'bg-violet-500' },
              { label: 'Novo Produto', icon: Package, color: 'bg-amber-500' },
              { label: 'Relatórios', icon: TrendingUp, color: 'bg-emerald-500' },
            ].map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200 group"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <action.icon size={18} className="text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}