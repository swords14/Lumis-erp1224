import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, TrendingUp, DollarSign } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { vendasService } from '@/lib/services';
import toast from 'react-hot-toast';

export function VendasPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [form, setForm] = useState({ customerId: '', items: [{ productId: '', quantity: 1, unitPrice: 0 }], payments: [{ method: 'dinheiro', amount: 0 }] });

  const loadData = async () => {
    setLoading(true);
    try { const res = await vendasService.list(); setData(res.data || []); } catch { toast.error('Erro ao carregar vendas'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    const total = form.items.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0);
    try {
      await vendasService.create({ ...form, payments: [{ method: form.payments[0].method, amount: total }] } as any);
      toast.success('Venda criada!');
      setModalOpen(false);
      loadData();
    } catch { toast.error('Erro ao criar venda'); }
  };

  const columns = [
    { key: 'number', label: 'Pedido', sortable: true, render: (item: any) => <span className="font-medium text-gray-900 dark:text-white">{item.number}</span> },
    { key: 'customer', label: 'Cliente', render: (item: any) => <span className="text-xs text-gray-500">{item.customer?.name || '—'}</span> },
    { key: 'total', label: 'Total', align: 'right' as const, format: (v: number) => `R$ ${(v / 100).toFixed(2)}` },
    { key: 'status', label: 'Status', render: (item: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status === 'pendente' ? 'bg-amber-500/10 text-amber-600' : item.status === 'aprovado' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-500'}`}>{item.status}</span> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendas</h1><p className="text-sm text-gray-500 mt-1">{data.length} vendas registradas</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"><Plus size={16} /> Nova Venda</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ label: 'Vendas Totais', value: data.length, icon: ShoppingCart, color: 'from-blue-500 to-indigo-500' }, { label: 'Faturamento', value: `R$ ${(data.reduce((s: number, v: any) => s + v.total, 0) / 100).toFixed(2)}`, icon: DollarSign, color: 'from-emerald-500 to-teal-500' }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-glass p-5">
            <div className="flex items-center gap-3"><div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color}`}><s.icon size={18} className="text-white" /></div><div><p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p><p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p></div></div>
          </motion.div>
        ))}
      </div>

      <DataTable columns={columns} data={data} loading={loading} emptyMessage="Nenhuma venda registrada" keyExtractor={(item) => item.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Venda">
        <div className="space-y-3">
          <input placeholder="Quantidade" type="number" value={form.items[0].quantity} onChange={e => setForm({ ...form, items: [{ ...form.items[0], quantity: +e.target.value }] })} className="glass-input" />
          <input placeholder="Preço unitário (centavos)" type="number" value={form.items[0].unitPrice} onChange={e => setForm({ ...form, items: [{ ...form.items[0], unitPrice: +e.target.value }], payments: [{ method: 'dinheiro', amount: form.items[0].quantity * +e.target.value }] })} className="glass-input" />
          <input placeholder="Método pgto" value={form.payments[0].method} onChange={e => setForm({ ...form, payments: [{ ...form.payments[0], method: e.target.value }] })} className="glass-input" />
          <button onClick={handleSave} className="btn-primary w-full justify-center">Criar Venda</button>
        </div>
      </Modal>
    </motion.div>
  );
}