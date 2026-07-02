import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { produtosService } from '@/lib/services';
import toast from 'react-hot-toast';

export function ProdutosPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: '', name: '', unitOfMeasure: 'un', costPrice: 0, sellingPrice: 0, currentStock: 0, minStock: 0 });

  const loadData = async () => {
    setLoading(true);
    try { const res = await produtosService.list(); setData(res.data || []); } catch { toast.error('Erro ao carregar produtos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      if (editing) { await produtosService.update(editing.id, form as any); toast.success('Produto atualizado!'); }
      else { await produtosService.create(form as any); toast.success('Produto criado!'); }
      setModalOpen(false); setEditing(null); setForm({ code: '', name: '', unitOfMeasure: 'un', costPrice: 0, sellingPrice: 0, currentStock: 0, minStock: 0 });
      loadData();
    } catch { toast.error('Erro ao salvar'); }
  };

  const columns = [
    { key: 'code', label: 'Código', sortable: true, render: (item: any) => <span className="font-mono text-xs text-gray-500">{item.code}</span> },
    { key: 'name', label: 'Nome', sortable: true, render: (item: any) => <span className="font-medium text-gray-900 dark:text-white">{item.name}</span> },
    { key: 'sellingPrice', label: 'Preço', align: 'right' as const, format: (v: number) => `R$ ${(v / 100).toFixed(2)}` },
    { key: 'currentStock', label: 'Estoque', align: 'center' as const, render: (item: any) => <span className={`text-xs font-medium ${item.currentStock <= item.minStock ? 'text-red-500' : 'text-emerald-500'}`}>{item.currentStock} {item.unitOfMeasure}</span> },
    { key: 'isActive', label: 'Ativo', align: 'center' as const, render: (item: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-500/10 text-gray-500'}`}>{item.isActive ? 'Sim' : 'Não'}</span> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produtos</h1><p className="text-sm text-gray-500 mt-1">{data.length} produtos no catálogo</p></div>
        <button onClick={() => { setEditing(null); setForm({ code: '', name: '', unitOfMeasure: 'un', costPrice: 0, sellingPrice: 0, currentStock: 0, minStock: 0 }); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/25">
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} emptyMessage="Nenhum produto cadastrado" keyExtractor={(item) => item.id}
        onRowClick={(item) => { setEditing(item); setForm({ code: item.code, name: item.name, unitOfMeasure: item.unitOfMeasure || 'un', costPrice: item.costPrice, sellingPrice: item.sellingPrice, currentStock: item.currentStock, minStock: item.minStock }); setModalOpen(true); }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Produto' : 'Novo Produto'}>
        <div className="space-y-3">
          <input placeholder="Código" value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="glass-input" />
          <input placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="glass-input" />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Preço custo (centavos)" type="number" value={form.costPrice} onChange={e => setForm({...form, costPrice: +e.target.value})} className="glass-input" />
            <input placeholder="Preço venda (centavos)" type="number" value={form.sellingPrice} onChange={e => setForm({...form, sellingPrice: +e.target.value})} className="glass-input" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Estoque atual" type="number" value={form.currentStock} onChange={e => setForm({...form, currentStock: +e.target.value})} className="glass-input" />
            <input placeholder="Estoque mínimo" type="number" value={form.minStock} onChange={e => setForm({...form, minStock: +e.target.value})} className="glass-input" />
          </div>
          <button onClick={handleSave} className="btn-primary w-full justify-center">Salvar</button>
        </div>
      </Modal>
    </motion.div>
  );
}