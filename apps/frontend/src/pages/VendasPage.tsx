import { motion } from 'framer-motion';
import { ShoppingCart, Plus, TrendingUp, DollarSign } from 'lucide-react';

export function VendasPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie suas vendas e pedidos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25">
          <Plus size={16} />
          Nova Venda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Vendas Hoje', value: '0', icon: ShoppingCart, color: 'from-blue-500 to-indigo-500' },
          { label: 'Faturamento', value: 'R$ 0,00', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
          { label: 'Ticket Médio', value: 'R$ 0,00', icon: TrendingUp, color: 'from-violet-500 to-purple-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-glass p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-glass overflow-hidden">
        <div className="p-8 text-center text-gray-400 dark:text-gray-500">
          <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma venda registrada</p>
          <p className="text-xs mt-1">Clique em "Nova Venda" para começar</p>
        </div>
      </div>
    </motion.div>
  );
}