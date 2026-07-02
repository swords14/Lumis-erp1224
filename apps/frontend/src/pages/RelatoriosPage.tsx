import { motion } from 'framer-motion';
import {
  TrendingUp, FileText, Download, Calendar, Filter, BarChart3, PieChart, ShoppingCart, DollarSign, Users, Package
} from 'lucide-react';

export function RelatoriosPage() {
  const reports = [
    { label: 'Vendas por Período', icon: ShoppingCart, desc: 'Relatório detalhado de vendas', color: 'from-blue-500 to-indigo-500' },
    { label: 'Fluxo de Caixa', icon: DollarSign, desc: 'Entradas e saídas financeiras', color: 'from-emerald-500 to-teal-500' },
    { label: 'Clientes Ativos', icon: Users, desc: 'Base de clientes e movimentação', color: 'from-violet-500 to-purple-500' },
    { label: 'Estoque', icon: Package, desc: 'Produtos, giro e reposição', color: 'from-amber-500 to-orange-500' },
    { label: 'Produtos Mais Vendidos', icon: BarChart3, desc: 'Ranking de performance', color: 'from-pink-500 to-rose-500' },
    { label: 'Resumo Financeiro', icon: PieChart, desc: 'Receitas vs Despesas', color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visualize e exporte relatórios do sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20 bg-white/40 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/10 transition-all">
            <Calendar size={15} />
            <span>Últimos 30 dias</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20 bg-white/40 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/10 transition-all">
            <Filter size={15} />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, i) => (
          <motion.div
            key={report.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-6 group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <report.icon size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{report.label}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{report.desc}</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/3 dark:bg-white/5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                <Download size={13} />
                Exportar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}