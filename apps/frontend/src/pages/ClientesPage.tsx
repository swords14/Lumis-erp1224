import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Mail, Phone } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { clientesService } from '@/lib/services';
import toast from 'react-hot-toast';
import { formatCPF, formatCNPJ, formatPhone } from '@ferramenta/shared';

export function ClientesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', document: '', type: 'fisica', isCustomer: true });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await clientesService.list({ isCustomer: 'true' });
      setData(res.data || []);
    } catch { toast.error('Erro ao carregar clientes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await clientesService.update(editing.id, { name: form.name, contacts: [{ type: 'email', value: form.email, isDefault: true }, { type: 'celular', value: form.phone, isDefault: true }] });
        toast.success('Cliente atualizado!');
      } else {
        await clientesService.create({ ...form, contacts: [{ type: 'email', value: form.email, isDefault: true }, { type: 'celular', value: form.phone, isDefault: true }], documents: form.document ? [{ type: form.type === 'fisica' ? 'cpf' : 'cnpj', value: form.document }] : [] });
        toast.success('Cliente criado!');
      }
      setModalOpen(false); setEditing(null); setForm({ name: '', email: '', phone: '', document: '', type: 'fisica', isCustomer: true });
      loadData();
    } catch { toast.error('Erro ao salvar'); }
  };

  const columns = [
    { key: 'name', label: 'Nome', sortable: true, render: (item: any) => <span className="font-medium text-gray-900 dark:text-white">{item.name}</span> },
    { key: 'document', label: 'Documento', render: (item: any) => <span className="text-xs text-gray-500">{item.documents?.[0]?.value ? (item.type === 'fisica' ? formatCPF(item.documents[0].value) : formatCNPJ(item.documents[0].value)) : '—'}</span> },
    { key: 'email', label: 'Contato', render: (item: any) => <span className="text-xs text-gray-500">{item.contacts?.find((c: any) => c.type === 'email')?.value || '—'}</span> },
    { key: 'status', label: 'Status', render: (item: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gray-500/10 text-gray-500'}`}>{item.status}</span> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clientes</h1><p className="text-sm text-gray-500 mt-1">{data.length} clientes cadastrados</p></div>
        <button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', document: '', type: 'fisica', isCustomer: true }); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25">
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} emptyMessage="Nenhum cliente cadastrado" keyExtractor={(item) => item.id}
        onRowClick={(item) => { setEditing(item); setForm({ name: item.name, email: item.contacts?.find((c: any) => c.type === 'email')?.value || '', phone: item.contacts?.find((c: any) => c.type === 'celular')?.value || '', document: item.documents?.[0]?.value || '', type: item.type || 'fisica', isCustomer: true }); setModalOpen(true); }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Cliente' : 'Novo Cliente'}>
        <div className="space-y-3">
          <input placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="glass-input" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="glass-input" />
          <input placeholder="Telefone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="glass-input" />
          <input placeholder="CPF/CNPJ" value={form.document} onChange={e => setForm({...form, document: e.target.value})} className="glass-input" />
          <button onClick={handleSave} className="btn-primary w-full justify-center">Salvar</button>
        </div>
      </Modal>
    </motion.div>
  );
}