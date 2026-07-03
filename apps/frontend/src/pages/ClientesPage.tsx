import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Plus, Mail, Phone, MapPin, Clock, LayoutGrid, List,
  ShoppingCart, DollarSign, Trash2, Edit3, Star, Filter, SlidersHorizontal,
  UserPlus, TrendingUp, MoreHorizontal, X, CheckCircle, AlertCircle, Download,
  ChevronDown, ChevronRight, Building2, Briefcase, Sparkles
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { clientesService, vendasService } from '@/lib/services';
import { useI18nStore } from '@/stores/i18n.store';
import toast from 'react-hot-toast';

type ViewMode = 'table' | 'cards';
type FilterStatus = 'todos' | 'ativo' | 'inativo';
type FilterType = 'todos' | 'fisica' | 'juridica';

export function ClientesPage() {
  const { t } = useI18nStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientSales, setClientSales] = useState<any[]>([]);
  const [clientStats, setClientStats] = useState({ totalSales: 0, totalSpent: 0, avgTicket: 0, lastPurchase: null as string | null });
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
  const [filterType, setFilterType] = useState<FilterType>('todos');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [form, setForm] = useState({ name: '', type: 'fisica' as 'fisica'|'juridica', document: '', email: '', phone: '', notes: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: 'SP', isCustomer: true, isSupplier: false });

  const loadData = async () => {
    setLoading(true);
    try { const res = await clientesService.list({ isCustomer: 'true' }); setData(res.data || []); }
    catch { toast.error(t('errorLoading')); } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => data.filter(item => {
    if (filterStatus !== 'todos' && item.status !== filterStatus) return false;
    if (filterType !== 'todos' && item.type !== filterType) return false;
    if (search && !item.name?.toLowerCase().includes(search.toLowerCase()) && !item.documents?.[0]?.value?.includes(search)) return false;
    return true;
  }), [data, filterStatus, filterType, search]);

  const stats = { total: data.length, ativos: data.filter(d => d.status === 'ativo').length, inativos: data.filter(d => d.status !== 'ativo').length, pf: data.filter(d => d.type === 'fisica').length, pj: data.filter(d => d.type === 'juridica').length };

  const openDetail = async (client: any) => {
    setSelectedClient(client);
    setDetailOpen(true);
    try {
      const res = await vendasService.list({ customerId: client.id });
      const sales = res.data || [];
      setClientSales(sales);
      const total = sales.reduce((s: number, v: any) => s + v.total, 0);
      setClientStats({ totalSales: sales.length, totalSpent: total, avgTicket: sales.length ? total / sales.length : 0, lastPurchase: sales[0]?.createdAt || null });
    } catch { setClientSales([]); }
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        name: form.name, type: form.type, isCustomer: form.isCustomer, isSupplier: form.isSupplier, notes: form.notes,
        contacts: [
          form.email ? { type: 'email', value: form.email, isDefault: true } : null,
          form.phone ? { type: 'celular', value: form.phone, isDefault: true } : null,
        ].filter(Boolean),
        documents: form.document ? [{ type: form.type === 'fisica' ? 'cpf' : 'cnpj', value: form.document }] : [],
        addresses: form.street ? [{ cep: form.cep, street: form.street, number: form.number, complement: form.complement, neighborhood: form.neighborhood, city: form.city, state: form.state, country: 'Brasil', type: 'comercial', isDefault: true }] : [],
      };
      if (editing) { await clientesService.update(editing.id, payload); toast.success(t('clientUpdated')); }
      else { await clientesService.create(payload); toast.success(t('clientCreated')); }
      setModalOpen(false); setEditing(null);
      setForm({ name: '', type: 'fisica', document: '', email: '', phone: '', notes: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: 'SP', isCustomer: true, isSupplier: false });
      loadData();
    } catch { toast.error(t('errorSaving')); }
  };

  const handleDelete = (id: string) => {
    setConfirmTitle(t('remove'));
    setConfirmMessage(t('confirmRemoveClients'));
    setConfirmAction(() => async () => {
      try { await clientesService.delete(id); toast.success(t('clientRemoved')); loadData(); } catch { toast.error(t('errorSaving')); }
      finally { setConfirmOpen(false); }
    });
    setConfirmOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({
      name: item.name, type: item.type || 'fisica',
      document: item.documents?.[0]?.value || '',
      email: item.contacts?.find((c: any) => c.type === 'email')?.value || '',
      phone: item.contacts?.find((c: any) => c.type === 'celular')?.value || '',
      notes: item.notes || '',
      street: item.addresses?.[0]?.street || '', number: item.addresses?.[0]?.number || '',
      complement: item.addresses?.[0]?.complement || '',
      neighborhood: item.addresses?.[0]?.neighborhood || '',
      city: item.addresses?.[0]?.city || '', state: item.addresses?.[0]?.state || 'SP',
      cep: item.addresses?.[0]?.cep || '',
      isCustomer: item.isCustomer, isSupplier: item.isSupplier,
    });
    setModalOpen(true);
  };

  const handleBulkDelete = () => {
    setConfirmTitle(t('remove'));
    setConfirmMessage(`${t('remove')} ${selectedIds.length} ${t('clients').toLowerCase()}?`);
    setConfirmAction(() => async () => {
      try { await Promise.all(selectedIds.map(id => clientesService.delete(id))); toast.success(`${selectedIds.length} ${t('removedClients')}`); setSelectedIds([]); loadData(); } catch { toast.error(t('errorSaving')); }
      finally { setConfirmOpen(false); }
    });
    setConfirmOpen(true);
  };

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 font-medium">{t('crm')}</span>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{t('clients')}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('clients')}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">{stats.total} {t('totalClients')}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{stats.ativos} {t('activeClients')}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-400">{stats.pf} {t('pf')} • {stats.pj} {t('pj')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all shadow-lg">
              <Trash2 size={15} /> {t('remove')} ({selectedIds.length})
            </motion.button>
          )}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10">
            {(['cards', 'table'] as ViewMode[]).map(m => (
              <button key={m} onClick={() => setViewMode(m)} className={`p-2 rounded-lg transition-all ${viewMode === m ? 'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                {m === 'cards' ? <LayoutGrid size={16} /> : <List size={16} />}
              </button>
            ))}
          </div>
          <button onClick={() => { setEditing(null); setForm({ name: '', type: 'fisica', document: '', email: '', phone: '', notes: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: 'SP', isCustomer: true, isSupplier: false }); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25">
            <UserPlus size={16} /> {t('newClient')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('active'), value: stats.ativos, icon: CheckCircle, color: 'bg-emerald-500' },
          { label: t('inactive'), value: stats.inativos, icon: AlertCircle, color: 'bg-gray-400' },
          { label: t('physicalPerson'), value: stats.pf, icon: UserPlus, color: 'bg-blue-500' },
          { label: t('legalPerson'), value: stats.pj, icon: Building2, color: 'bg-violet-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3 cursor-pointer" onClick={() => {
              if (s.label === t('active')) setFilterStatus('ativo');
              else if (s.label === t('inactive')) setFilterStatus('inativo');
              else if (s.label === t('physicalPerson')) setFilterType('fisica');
              else setFilterType('juridica');
            }}>
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}><s.icon size={17} className="text-white" /></div>
            <div><p className="text-xs text-gray-500">{s.label}</p><p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchByName')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
          </div>
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
            {[{ label: t('all'), value: 'todos' as FilterStatus }, { label: t('active'), value: 'ativo' }, { label: t('inactive'), value: 'inativo' }].map(f => (
              <button key={f.value} onClick={() => setFilterStatus(f.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === f.value ? 'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>{f.label}</button>
            ))}
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value as FilterType)}
            className="text-xs px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-white/10 text-gray-600 dark:text-gray-400 focus:outline-none">
            <option value="todos">{t('allTypes')}</option><option value="fisica">{t('physicalPerson')}</option><option value="juridica">{t('legalPerson')}</option>
          </select>
          <button onClick={() => { loadData(); }} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 transition-colors" title={t('refresh')}>
            <SlidersHorizontal size={15} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'cards' && (
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.slice(0, 30).map((item, i) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.02 }}
                  onClick={() => openDetail(item)}
                  className={`glass-card p-5 cursor-pointer group relative overflow-hidden ${selectedIds.includes(item.id) ? 'ring-2 ring-blue-500 bg-blue-500/[0.03]' : ''}`}>
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer" />
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400/60 to-indigo-400/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.type === 'fisica' ? 'from-blue-400 to-indigo-500' : 'from-violet-400 to-purple-500'} flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-500/20`}>
                        {item.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-gray-400">{item.type === 'fisica' ? t('pf') : t('pj')}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'ativo' ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                          <span className="text-[11px] text-gray-400">{item.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => { e.stopPropagation(); handleEdit(item); }} className="p-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-gray-400"><Edit3 size={13} /></button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {item.contacts?.find((c: any) => c.type === 'email')?.value && (
                      <div className="flex items-center gap-2 text-xs text-gray-500"><Mail size={11} className="text-gray-400 shrink-0" /><span className="truncate">{item.contacts.find((c: any) => c.type === 'email')?.value}</span></div>
                    )}
                    {item.contacts?.find((c: any) => c.type === 'celular')?.value && (
                      <div className="flex items-center gap-2 text-xs text-gray-500"><Phone size={11} className="text-gray-400 shrink-0" />{item.contacts.find((c: any) => c.type === 'celular')?.value}</div>
                    )}
                    {item.addresses?.[0] && (
                      <div className="flex items-center gap-2 text-xs text-gray-400"><MapPin size={11} className="text-gray-400 shrink-0" /><span className="truncate">{item.addresses[0].city}/{item.addresses[0].state}</span></div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-400">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                    {item.documents?.[0] && <span className="text-gray-400 font-mono text-[11px]">{item.documents[0].value}</span>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && !loading && (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                  <Users size={36} className="opacity-30" />
                </div>
                <p className="text-sm font-medium mb-1">{t('noClient')}</p>
                <p className="text-xs">{t('tryAdjustFilters')}</p>
                <button onClick={() => { setEditing(null); setModalOpen(true); }} className="mt-4 btn-primary text-xs">{t('createFirstClient')}</button>
              </div>
            )}
          </motion.div>
        )}

        {viewMode === 'table' && (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
                  <th className="w-10 px-4 py-3"></th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('clients')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('contact')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('document')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">{t('registration')}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('status')}</th>
                  <th className="w-10 px-4 py-3"></th>
                </tr></thead>
                <tbody>
                  {filtered.map(item => (
                    <tr key={item.id} onClick={() => openDetail(item)}
                      className={`border-b border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer ${selectedIds.includes(item.id) ? 'bg-blue-500/[0.03]' : ''}`}>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded border-gray-300 text-blue-500 cursor-pointer" /></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.type === 'fisica' ? 'from-blue-400 to-indigo-500' : 'from-violet-400 to-purple-500'} flex items-center justify-center text-white text-xs font-bold`}>{item.name?.charAt(0)}</div><div><p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p><p className="text-[11px] text-gray-400">{item.type === 'fisica' ? t('pf') : t('pj')}</p></div></div></td>
                      <td className="px-4 py-3 hidden md:table-cell"><p className="text-xs text-gray-500">{item.contacts?.find((c: any) => c.type === 'email')?.value || item.contacts?.find((c: any) => c.type === 'celular')?.value || '—'}</p></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><p className="text-xs text-gray-400 font-mono">{item.documents?.[0]?.value || '—'}</p></td>
                      <td className="px-4 py-3 hidden xl:table-cell"><p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</p></td>
                      <td className="px-4 py-3 text-center"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${item.status === 'ativo' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span></td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}><div className="flex items-center gap-1"><button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-black/5 text-gray-400"><Edit3 size={13} /></button><button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && !loading && <div className="text-center py-16 text-gray-400"><Users size={36} className="mx-auto mb-3 opacity-30" /><p className="text-sm font-medium">{t('noClient')}</p></div>}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('editClient') : t('newClientModal')} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('nameRequired')}</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="glass-input" placeholder={t('fullName')} /></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('type')}</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'fisica' | 'juridica' })} className="glass-input"><option value="fisica">{t('physicalPerson')}</option><option value="juridica">{t('legalPerson')}</option></select></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{form.type === 'fisica' ? 'CPF' : 'CNPJ'}</label><input value={form.document} onChange={e => setForm({ ...form, document: e.target.value })} className="glass-input" placeholder={form.type === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} /></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('email')}</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="glass-input" placeholder="email@exemplo.com" /></div>
          </div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('phone')}</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="glass-input" placeholder="(11) 99999-9999" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('observations')}</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="glass-input" placeholder={t('internalNotes')} /></div>
          <div className="pt-2 border-t border-white/10"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">{t('addressOptional')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div><input value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })} className="glass-input" placeholder={t('zipCode')} /></div>
              <div className="sm:col-span-3"><input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} className="glass-input" placeholder={t('street')} /></div>
              <div><input value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} className="glass-input" placeholder={t('number')} /></div>
              <div><input value={form.complement} onChange={e => setForm({ ...form, complement: e.target.value })} className="glass-input" placeholder={t('complement')} /></div>
              <div><input value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} className="glass-input" placeholder={t('neighborhood')} /></div>
              <div><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="glass-input" placeholder={t('city')} /></div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="checkbox" checked={form.isCustomer} onChange={e => setForm({ ...form, isCustomer: e.target.checked })} className="rounded" /> {t('isCustomer')}</label>
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="checkbox" checked={form.isSupplier} onChange={e => setForm({ ...form, isSupplier: e.target.checked })} className="rounded" /> {t('isSupplier')}</label>
          </div>
          <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-3 mt-2">{editing ? t('saveChanges') : t('registerClient')}</button>
        </div>
      </Modal>

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="" size="lg">
        {selectedClient && (
          <div className="space-y-5">
            <div className="flex items-start gap-5">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedClient.type === 'fisica' ? 'from-blue-400 to-indigo-500' : 'from-violet-400 to-purple-500'} flex items-center justify-center text-white text-2xl font-bold shadow-xl shrink-0`}>
                {selectedClient.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedClient.name}</h2>
                <p className="text-sm text-gray-500">{selectedClient.type === 'fisica' ? t('physicalPerson') : t('legalPerson')} • {t('registration')} {new Date(selectedClient.createdAt).toLocaleDateString('pt-BR')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${selectedClient.status === 'ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{selectedClient.status}</span>
                  {selectedClient.documents?.[0] && <span className="text-xs text-gray-400 font-mono">{selectedClient.documents[0].value}</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: t('purchases'), value: clientStats.totalSales, icon: ShoppingCart },
                { label: t('totalSpent'), value: `R$ ${(clientStats.totalSpent / 100).toFixed(2)}`, icon: DollarSign },
                { label: t('avgTicket'), value: `R$ ${(clientStats.avgTicket / 100).toFixed(2)}`, icon: TrendingUp },
                { label: t('lastPurchase'), value: clientStats.lastPurchase ? new Date(clientStats.lastPurchase).toLocaleDateString('pt-BR') : t('never'), icon: Clock },
              ].map((s, i) => (
                <div key={i} className="glass-card p-3"><p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1.5"><s.icon size={12} />{s.label}</p><p className="text-sm font-bold text-gray-900 dark:text-white">{s.value}</p></div>
              ))}
            </div>

            {selectedClient.contacts?.length > 0 && (
              <div className="glass-card p-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('contacts')}</h4>
                <div className="space-y-2">
                  {selectedClient.contacts.map((c: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-center">{c.type === 'email' ? <Mail size={14} className="text-blue-500" /> : <Phone size={14} className="text-emerald-500" />}</div><div><p className="text-xs text-gray-500">{c.type}</p><p className="text-sm font-medium text-gray-900 dark:text-white">{c.value}</p></div></div>
                  ))}
                </div>
              </div>
            )}

            {selectedClient.addresses?.[0] && (
              <div className="glass-card p-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('address')}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedClient.addresses[0].street}, {selectedClient.addresses[0].number}{selectedClient.addresses[0].complement ? ` - ${selectedClient.addresses[0].complement}` : ''} - {selectedClient.addresses[0].neighborhood}, {selectedClient.addresses[0].city}/{selectedClient.addresses[0].state} - CEP {selectedClient.addresses[0].cep}</p>
              </div>
            )}

            {clientSales.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('recentPurchases')}</h4>
                <div className="space-y-1.5">
                  {clientSales.slice(0, 8).map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-black/[0.01] dark:bg-white/[0.02] text-sm">
                      <div><span className="font-mono font-medium text-blue-600 dark:text-blue-400 text-xs">{s.number}</span><span className="text-xs text-gray-400 ml-2">{new Date(s.createdAt).toLocaleDateString('pt-BR')}</span></div>
                      <div className="flex items-center gap-3"><span className="text-xs text-gray-500">{s.items?.length || 0} {t('items')}</span><span className="text-sm font-semibold text-emerald-600">R$ {(s.total / 100).toFixed(2)}</span><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'pendente' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{s.status}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}