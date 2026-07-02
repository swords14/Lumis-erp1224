import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { financeiroService } from '@/lib/services';
import toast from 'react-hot-toast';

export function FinanceiroPage() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, expenses: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ description: '', amount: 0, category: 'despesa', dueDate: new Date().toISOString().slice(0, 10) });

  const loadData = async () => {
    setLoading(true);
    try {
      const [res, s] = await Promise.all([financeiroService.list(), financeiroService.getStats!()]);
      setData(res.data || []);
      setStats(s);
    } catch { toast.error('Erro ao carregar dados financeiros'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      await financeiroService.create(form as any);
      toast.success('Transação criada!');
      setModalOpen(false);
      loadData();
    } catch { toast.error('Erro ao salvar'); }
  };

  const columns = [
    { key: 'description', label: 'Descrição', sortable: true, render: (item: any) => <span className="font-medium text-gray-900 dark:text-white">{item.description}</span> },
    { key: 'category', label: 'Tipo', render: (item: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.category === 'receita' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>{item.category}</span> },
    { key: 'amount', label: 'Valor', align: 'right' as const, format: (v: number) => `R$ ${(v / 100).toFixed(2)}` },
    { key: 'status', label: 'Status', render: (item: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status === 'pago' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{item.status}</span> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financeiro</h1><p className="text-sm text-gray-500 mt-1">{data.length} transações</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"><Plus size={16} /> Nova Transação</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ label: 'Saldo', value: `R$ ${(stats.balance / 100).toFixed(2)}`, icon: DollarSign, color: 'from-emerald-500 to-teal-500' }, { label: 'Receitas', value: `R$ ${(stats.revenue / 100).toFixed(2)}`, icon: TrendingUp, color: 'from-blue-500 to-indigo-500' }, { label: 'Despesas', value: `R$ ${(stats.expenses / 100).toFixed(2)}`, icon: TrendingDown, color: 'from-red-500 to-rose-500' }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-glass p-5">
            <div className="flex items-center gap-3"><div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color}`}><s.icon size={18} className="text-white" /></div><div><p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p><p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p></div></div>
          </motion.div>
        ))}
      </div>

      <DataTable columns={columns} data={data} loading={loading} emptyMessage="Nenhuma transação registrada" keyExtractor={(item) => item.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Transação">
        <div className="space-y-3">
          <input placeholder="Descrição" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="glass-input" />
          <input placeholder="Valor (centavos)" type="number" value={form.amount} onChange={e => setForm({...form, amount: +e.target.value})} className="glass-input" />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="glass-input">
            <option value="receita">Receita</option><option value="despesa">Despesa</option>
          </select>
          <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="glass-input" />
          <button onClick={handleSave} className="btn-primary w-full justify-center">Salvar</button>
        </div>
      </Modal>
    </motion.div>
  );
}