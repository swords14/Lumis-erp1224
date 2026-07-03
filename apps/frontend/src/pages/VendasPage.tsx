import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Plus, DollarSign, TrendingUp, Filter, Search, X, ChevronRight,
  CheckCircle, XCircle, Clock, Edit3, Trash2, Receipt, LayoutGrid, List,
  TrendingDown, CreditCard, Banknote, QrCode, Package, Users, Star, Sparkles,
  Calendar, ArrowUpRight, BarChart3, PieChart, SlidersHorizontal, Download, MoreHorizontal
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { vendasService } from '@/lib/services';
import toast from 'react-hot-toast';
import { format, subDays, startOfMonth } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

type ViewMode = 'cards' | 'table';
type FilterStatus = 'todos' | 'pendente' | 'aprovado' | 'cancelado';
type FilterPeriod = 'hoje' | 'semana' | 'mes' | 'todos';

export function VendasPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('todos');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [form, setForm] = useState({ customerId: '', items: [{ productId: '', description: 'Produto', quantity: 1, unitPrice: 0 }], payments: [{ method: 'dinheiro', amount: 0 }], notes: '' });

  const loadData = async () => { setLoading(true); try { const r = await vendasService.list(); setData(r.data || []); } catch { toast.error('Erro ao carregar'); } finally { setLoading(false); } };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    let d = data;
    if (filterStatus !== 'todos') d = d.filter(s => s.status === filterStatus);
    if (search) d = d.filter(s => s.number?.toLowerCase().includes(search.toLowerCase()) || s.customer?.name?.toLowerCase().includes(search.toLowerCase()));
    const now = new Date();
    if (filterPeriod === 'hoje') d = d.filter(s => format(new Date(s.createdAt), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd'));
    if (filterPeriod === 'semana') { const weekAgo = subDays(now, 7); d = d.filter(s => new Date(s.createdAt) >= weekAgo); }
    if (filterPeriod === 'mes') { const monthStart = startOfMonth(now); d = d.filter(s => new Date(s.createdAt) >= monthStart); }
    return d;
  }, [data, filterStatus, filterPeriod, search]);

  const stats = {
    total: data.length,
    pendente: data.filter(s => s.status === 'pendente').length,
    aprovado: data.filter(s => s.status === 'aprovado').length,
    cancelado: data.filter(s => s.status === 'cancelado').length,
    revenue: filtered.filter(s => s.status !== 'cancelado').reduce((sum, s) => sum + s.total, 0),
    avgTicket: filtered.filter(s => s.status !== 'cancelado').length ? filtered.filter(s => s.status !== 'cancelado').reduce((sum, s) => sum + s.total, 0) / filtered.filter(s => s.status !== 'cancelado').length : 0,
    todayRevenue: data.filter(s => format(new Date(s.createdAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && s.status !== 'cancelado').reduce((sum, s) => sum + s.total, 0),
    todayCount: data.filter(s => format(new Date(s.createdAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length,
  };

  const toggleSelect = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSave = async () => {
    const total = form.items.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0);
    try { await vendasService.create({ ...form, payments: [{ method: form.payments[0].method, amount: total }] } as any); toast.success('Venda criada! ✨'); setModalOpen(false); loadData(); } catch { toast.error('Erro'); }
  };

  const handleStatus = async (id: string, status: string) => { try { await vendasService.update(id, { status } as any); toast.success(`Venda ${status}`); loadData(); } catch { toast.error('Erro'); } };

  const handleBulkApprove = async () => { try { await Promise.all(selectedIds.map(id => vendasService.update(id, { status: 'aprovado' } as any))); toast.success(`${selectedIds.length} aprovadas`); setSelectedIds([]); loadData(); } catch { toast.error('Erro'); } };

  const openDetail = (sale: any) => { setSelectedSale(sale); setDetailOpen(true); };

  const chartData = useMemo(() => {
    const days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const key = format(d, 'dd/MM');
      const daySales = filtered.filter(s => format(new Date(s.createdAt), 'dd/MM') === key && s.status !== 'cancelado');
      days.push({ date: key, value: daySales.reduce((sum, s) => sum + s.total, 0) / 100, count: daySales.length });
    }
    return days;
  }, [filtered]);

  const paymentPie = useMemo(() => {
    const methods: Record<string, number> = {};
    filtered.filter(s => s.status === 'aprovado').forEach(s => s.payments?.forEach((p: any) => { methods[p.method] = (methods[p.method] || 0) + p.amount; }));
    return Object.entries(methods).map(([k, v]) => ({ name: k === 'dinheiro' ? 'Dinheiro' : k === 'pix' ? 'PIX' : k === 'cartao_credito' ? 'Cartão' : k, value: v / 100, color: k === 'dinheiro' ? '#10b981' : k === 'pix' ? '#6366f1' : '#f59e0b' }));
  }, [filtered]);

  const statusPie = useMemo(() => [
    { name: 'Pendentes', value: stats.pendente, color: '#f59e0b' },
    { name: 'Aprovadas', value: stats.aprovado, color: '#10b981' },
    { name: 'Canceladas', value: stats.cancelado, color: '#ef4444' },
  ], [stats]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { pendente: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', aprovado: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', cancelado: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' };
    return map[status] || 'bg-gray-50 text-gray-600';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 font-medium">Vendas</span>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">Pedidos</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Vendas</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">{stats.total} pedidos</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-amber-600 font-semibold">{stats.pendente} pendentes</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-emerald-600 font-semibold">{stats.aprovado} aprovadas</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-400">Hoje: R$ {(stats.todayRevenue / 100).toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={handleBulkApprove}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 shadow-lg">
              <CheckCircle size={15} /> Aprovar ({selectedIds.length})
            </motion.button>
          )}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10">
            {(['cards', 'table'] as ViewMode[]).map(m => (
              <button key={m} onClick={() => setViewMode(m)} className={`p-2 rounded-lg transition-all ${viewMode === m ? 'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                {m === 'cards' ? <LayoutGrid size={16} /> : <List size={16} />}
              </button>
            ))}
          </div>
          <button onClick={() => { setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25">
            <Plus size={16} /> Nova Venda
          </button>
        </div>
      </div>

      {/* Stats Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { label: 'Faturamento', value: `R$ ${(stats.revenue / 100).toFixed(2)}`, icon: DollarSign, color: 'from-emerald-500 to-teal-500', action: () => {} },
          { label: 'Ticket Médio', value: `R$ ${(stats.avgTicket / 100).toFixed(2)}`, icon: TrendingUp, color: 'from-blue-500 to-indigo-500', action: () => {} },
          { label: 'Pendentes', value: stats.pendente, icon: Clock, color: 'from-amber-500 to-orange-500', action: () => setFilterStatus('pendente') },
          { label: 'Aprovadas', value: stats.aprovado, icon: CheckCircle, color: 'from-emerald-500 to-teal-500', action: () => setFilterStatus('aprovado') },
          { label: 'Canceladas', value: stats.cancelado, icon: XCircle, color: 'from-red-500 to-rose-500', action: () => setFilterStatus('cancelado') },
          { label: 'Hoje', value: stats.todayCount, icon: Calendar, color: 'from-violet-500 to-purple-500', action: () => setFilterPeriod('hoje') },
          { label: 'Total', value: stats.total, icon: ShoppingCart, color: 'from-pink-500 to-rose-500', action: () => { setFilterStatus('todos'); setFilterPeriod('todos'); } },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            onClick={s.action} className="glass-card p-3 flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-transform">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${s.color}`}><s.icon size={14} className="text-white" /></div>
            <div><p className="text-[10px] text-gray-500">{s.label}</p><p className="text-sm font-bold text-gray-900 dark:text-white">{s.value}</p></div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Faturamento (7 dias)</h3>
          <div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" /><YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }} formatter={(v: number) => `R$ ${v.toFixed(2)}`} /><Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} name="Faturamento" /></BarChart></ResponsiveContainer></div>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Status das Vendas</h3>
          <div className="h-48 flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><RePieChart><Pie data={statusPie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">{statusPie.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }} /></RePieChart></ResponsiveContainer></div>
          <div className="flex justify-center gap-4 mt-1">{statusPie.map(e => <div key={e.name} className="flex items-center gap-1.5 text-[10px] text-gray-500"><div className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />{e.name}</div>)}</div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="glass-card p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar pedido ou cliente..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />{search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14} /></button>}</div>
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
            {[{ label: 'Todas', value: 'todos' as FilterStatus }, { label: 'Pendentes', value: 'pendente' }, { label: 'Aprovadas', value: 'aprovado' }, { label: 'Canceladas', value: 'cancelado' }].map(f => (
              <button key={f.value} onClick={() => setFilterStatus(f.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === f.value ? 'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>{f.label}</button>
            ))}
          </div>
          <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value as FilterPeriod)}
            className="text-xs px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-white/10 text-gray-600 dark:text-gray-400">
            <option value="todos">Todo período</option><option value="hoje">Hoje</option><option value="semana">Última semana</option><option value="mes">Este mês</option>
          </select>
          <span className="ml-auto text-xs text-gray-400">{filtered.length} vendas</span>
        </div>
      </div>

      {/* Card Grid View */}
      <AnimatePresence mode="wait">
        {viewMode === 'cards' && (
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.slice(0, 30).map((item, i) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.02 }}
                  onClick={() => openDetail(item)}
                  className={`glass-card p-5 cursor-pointer group relative overflow-hidden ${selectedIds.includes(item.id) ? 'ring-2 ring-blue-500' : ''} ${item.status === 'pendente' ? 'border-amber-500/20' : item.status === 'cancelado' ? 'border-red-500/20' : ''}`}>
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded border-gray-300 text-blue-500 cursor-pointer" /></div>
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400/60 to-teal-400/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">{item.number}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.customer?.name || 'Cliente avulso'}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(item.status)}`}>{item.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="glass-card p-2.5 text-center"><p className="text-[10px] text-gray-400 mb-0.5">TOTAL</p><p className="text-base font-bold text-emerald-600">R$ {(item.total / 100).toFixed(2)}</p></div>
                    <div className="glass-card p-2.5 text-center"><p className="text-[10px] text-gray-400 mb-0.5">ITENS</p><p className="text-base font-bold text-gray-900 dark:text-white">{item.items?.length || 0}</p></div>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.payments?.map((p: any, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] text-gray-500 capitalize">{p.method === 'dinheiro' ? '💵' : p.method === 'pix' ? '📱' : '💳'} {p.method.replace('_', ' ')}</span>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                    <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                    {item.status === 'pendente' && (
                      <button onClick={e => { e.stopPropagation(); handleStatus(item.id, 'aprovado'); }} className="text-emerald-500 hover:text-emerald-600 font-medium">Aprovar</button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <div className="col-span-3 flex flex-col items-center py-20 text-gray-400"><ShoppingCart size={36} className="mb-3 opacity-30" /><p className="text-sm">Nenhuma venda</p><button onClick={() => setModalOpen(true)} className="mt-4 btn-primary text-xs">Criar Venda</button></div>}
          </motion.div>
        )}

        {viewMode === 'table' && (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10 bg-black/[0.01]"><th className="w-10 px-4 py-3"></th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pedido</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Cliente</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Itens</th><th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Data</th></tr></thead><tbody>
              {filtered.map(item => (<tr key={item.id} onClick={() => openDetail(item)} className={`border-b border-white/5 hover:bg-black/[0.02] cursor-pointer ${selectedIds.includes(item.id) ? 'bg-blue-500/[0.03]' : ''}`}>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded border-gray-300 text-blue-500 cursor-pointer" /></td>
                <td className="px-4 py-3"><p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">{item.number}</p></td>
                <td className="px-4 py-3 hidden md:table-cell"><p className="text-xs text-gray-500">{item.customer?.name || '—'}</p></td>
                <td className="px-4 py-3 text-center hidden lg:table-cell"><p className="text-xs text-gray-500">{item.items?.length || 0}</p></td>
                <td className="px-4 py-3 text-right"><p className="text-sm font-bold text-gray-900 dark:text-white">R$ {(item.total / 100).toFixed(2)}</p></td>
                <td className="px-4 py-3 text-center"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                <td className="px-4 py-3 hidden xl:table-cell"><p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</p></td>
              </tr>))}</tbody></table></div>
            {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><ShoppingCart size={36} className="mx-auto mb-3 opacity-30" /><p className="text-sm">Nenhuma venda</p></div>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal - PDV */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Venda (PDV)" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2"><input placeholder="Descrição do item" value={form.items[0].description} onChange={e => setForm({ ...form, items: [{ ...form.items[0], description: e.target.value }] })} className="glass-input" /><input placeholder="Quantidade" type="number" value={form.items[0].quantity} onChange={e => setForm({ ...form, items: [{ ...form.items[0], quantity: +e.target.value }] })} className="glass-input" /></div>
          <div className="grid grid-cols-2 gap-2"><input placeholder="Preço unitário (centavos)" type="number" value={form.items[0].unitPrice} onChange={e => { const p = +e.target.value; setForm({ ...form, items: [{ ...form.items[0], unitPrice: p }], payments: [{ method: form.payments[0].method, amount: form.items[0].quantity * p }] }); }} className="glass-input" />
            <select value={form.payments[0].method} onChange={e => setForm({ ...form, payments: [{ ...form.payments[0], method: e.target.value }] })} className="glass-input"><option value="dinheiro">💵 Dinheiro</option><option value="pix">📱 PIX</option><option value="cartao_credito">💳 Cartão</option></select></div>
          <div className="glass-card p-4 text-center"><p className="text-xs text-gray-500 mb-1">TOTAL DA VENDA</p><p className="text-3xl font-bold text-emerald-600">R$ {(form.items[0].quantity * form.items[0].unitPrice / 100).toFixed(2)}</p></div>
          <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-3">Finalizar Venda</button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={selectedSale ? `Pedido ${selectedSale.number}` : ''} size="lg">
        {selectedSale && (
          <div className="space-y-5">
            <div className="flex items-start justify-between"><div><p className="text-xs text-gray-400 font-mono">{selectedSale.number}</p><h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{selectedSale.customer?.name || 'Cliente avulso'}</h2><p className="text-xs text-gray-500 mt-0.5">{new Date(selectedSale.createdAt).toLocaleString('pt-BR')}</p></div><span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(selectedSale.status)}`}>{selectedSale.status}</span></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card p-3"><p className="text-[11px] text-gray-500 mb-1">Total</p><p className="text-lg font-bold text-emerald-600">R$ {(selectedSale.total / 100).toFixed(2)}</p></div>
              <div className="glass-card p-3"><p className="text-[11px] text-gray-500 mb-1">Itens</p><p className="text-lg font-bold text-gray-900 dark:text-white">{selectedSale.items?.length || 0}</p></div>
              <div className="glass-card p-3"><p className="text-[11px] text-gray-500 mb-1">Pagamento</p><p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{selectedSale.payments?.[0]?.method?.replace('_', ' ') || '—'}</p></div>
            </div>
            <div><h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Itens do Pedido</h4><div className="space-y-1">{selectedSale.items?.map((item: any) => (<div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-black/[0.01] dark:bg-white/[0.02] text-sm"><span className="font-medium text-gray-700 dark:text-gray-300">{item.product?.name || 'Produto'} × {item.quantity}</span><span className="text-xs text-gray-400">{item.quantity} × R$ {(item.unitPrice / 100).toFixed(2)}</span><span className="font-semibold text-emerald-600">R$ {(item.total / 100).toFixed(2)}</span></div>))}</div></div>
            {selectedSale.payments?.map((p: any, i: number) => (<div key={i} className="glass-card p-3 flex items-center justify-between"><div className="flex items-center gap-2"><p className="text-xs text-gray-500">Pagamento:</p><p className="text-xs font-medium text-gray-700 capitalize">{p.method.replace('_', ' ')}</p>{p.installments > 1 && <span className="text-xs text-gray-400">({p.installments}x)</span>}</div><p className="text-sm font-bold text-emerald-600">R$ {(p.amount / 100).toFixed(2)}</p></div>))}
            {selectedSale.status === 'pendente' && (
              <div className="flex gap-2">
                <button onClick={() => { handleStatus(selectedSale.id, 'aprovado'); setDetailOpen(false); }} className="btn-primary flex-1 justify-center text-sm py-3 bg-emerald-500 hover:bg-emerald-600">✓ Aprovar</button>
                <button onClick={() => { handleStatus(selectedSale.id, 'cancelado'); setDetailOpen(false); }} className="flex-1 px-4 py-3 rounded-2xl border border-red-500/30 bg-red-500/5 text-red-600 text-sm font-semibold hover:bg-red-500/10 transition-all">✕ Cancelar</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}