import { motion } from 'framer-motion';
import { Package, Search, Plus, Barcode, Tag } from 'lucide-react';

export function ProdutosPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produtos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie seu catálogo</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/25">
          <Plus size={16} />
          Novo Produto
        </button>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-glass overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        <div className="p-8 text-center text-gray-400 dark:text-gray-500">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum produto cadastrado</p>
          <p className="text-xs mt-1">Clique em "Novo Produto" para começar</p>
        </div>
      </div>
    </motion.div>
  );
}