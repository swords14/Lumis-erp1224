import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Plus, Search, Calendar, Filter, X, ChevronRight,
  CheckCircle, Clock, AlertCircle, CreditCard, Banknote, Wallet, ArrowUpCircle, ArrowDownCircle,
  BarChart3, PieChart, SlidersHorizontal, Download, Upload, LayoutGrid, List, Sparkles
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { financeiroService } from '@/lib/services';
import { useI18nStore } from '@/stores/i18n.store';
import toast from 'react-hot-toast';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

type ViewMode = 'cards' | 'table';
type FilterCategory = 'todas' | 'receita' | 'despesa';
type FilterPeriod = 'todos' | 'hoje' | 'semana' | 'mes';

export function FinanceiroPage() {
  const { t } = useI18nStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filterCat, setFilterCat] = useState<FilterCategory>('todas');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('todos');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [form, setForm] = useState({ description: '', amount: 0, category: 'despesa', subcategory: '', dueDate: format(new Date(), 'yyyy-MM-dd'), accountId: '', status: 'pendente' });
  const [stats, setStats] = useState({ balance: 0, revenue: 0, expenses: 0 });
  const [chartTab, setChartTab] = useState<'fluxo' | 'categorias'>('fluxo');

  const loadData = async () => { setLoading(true); try { const [r, s] = await Promise.all([financeiroService.list(), financeiroService.getStats()]); setData(r.data || []); setStats(s); } catch { toast.error(t('errorLoading')); } finally { setLoading(false); } };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    let d = data;
    if (filterCat !== 'todas') d = d.filter(t => t.category === filterCat);
    if (search) d = d.filter(t => t.description?.toLowerCase().includes(search.toLowerCase()));
    const now = new Date();
    if (filterPeriod === 'hoje') d = d.filter(t => format(new Date(t.dueDate || t.createdAt), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd'));
    if (filterPeriod === 'semana') { const w = subDays(now, 7); d = d.filter(t => new Date(t.dueDate || t.createdAt) >= w); }
    if (filterPeriod === 'mes') { const ms = startOfMonth(now); d = d.filter(t => new Date(t.dueDate || t.createdAt) >= ms); }
    return d;
  }, [data, filterCat, filterPeriod, search]);

  const filteredStats = useMemo(() => {
    const r = filtered.filter(t => t.category === 'receita').reduce((s, t) => s + t.amount, 0);
    const e = filtered.filter(t => t.category === 'despesa').reduce((s, t) => s + t.amount, 0);
    return { revenue: r, expenses: e, balance: r - e, pendingCount: filtered.filter(t => t.status === 'pendente').length, paidCount: filtered.filter(t => t.status === 'pago').length };
  }, [filtered]);

  const toggleSelect = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSave = async () => { try { await financeiroService.create(form as any); toast.success(form.category === 'receita' ? t('revenueType') + ' registrado! 💰' : t('expenseType') + ' registrada! 📋'); setModalOpen(false); setForm({ description: '', amount: 0, category: 'despesa', subcategory: '', dueDate: format(new Date(), 'yyyy-MM-dd'), accountId: '', status: 'pendente' }); loadData(); } catch { toast.error(t('errorSaving')); } };

  const handlePay = async (id: string) => { try { await financeiroService.update(id, { status: 'pago', paidAt: new Date().toISOString() } as any); toast.success(t('markAsPaid') + '!'); loadData(); } catch { toast.error(t('errorSaving')); } };

  const chartData = useMemo(() => {
    const days: any[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const key = format(d, 'dd/MM');
      const dayTx = filtered.filter(t => format(new Date(t.dueDate || t.createdAt), 'dd/MM') === key);
      days.push({ date: key, receita: dayTx.filter(t => t.category === 'receita').reduce((s, t) => s + t.amount, 0) / 100, despesa: dayTx.filter(t => t.category === 'despesa').reduce((s, t) => s + t.amount, 0) / 100 });
    }
    return days;
  }, [filtered]);

  const categoryPie = useMemo(() => {
    const cats: Record<string, number> = {};
    filtered.forEach(t => { const key = t.subcategory || t.category; cats[key] = (cats[key] || 0) + t.amount; });
    const colors = ['#10b981', '#f43f5e', '#6366f1', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6'];
    return Object.entries(cats).map(([k, v], i) => ({ name: k, value: v / 100, color: colors[i % colors.length] }));
  }, [filtered]);

  const monthlyBalance = useMemo(() => {
    const months: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = subMonths(new Date(), i);
      const key = format(m, 'MMM/yy');
      const mTx = data.filter(t => format(new Date(t.dueDate || t.createdAt), 'MM/yy') === format(m, 'MM/yy'));
      const rev = mTx.filter(t => t.category === 'receita').reduce((s, t) => s + t.amount, 0) / 100;
      const exp = mTx.filter(t => t.category === 'despesa').reduce((s, t) => s + t.amount, 0) / 100;
      months.push({ month: key, receita: rev, despesa: exp, saldo: rev - exp });
    }
    return months;
  }, [data]);

  const getStatusBadge = (status: string) => status === 'pago' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : status === 'atrasado' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-400 font-medium">{t('financial')}</span><ChevronRight size={12} className="text-gray-400" /><span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{t('transactions')}</span></div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('financial')}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">{data.length} {t('transactions')}</span><span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-emerald-600 font-semibold">{t('balance')}: R$ {(stats.balance / 100).toFixed(2)}</span><span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-sm text-amber-600">{filteredStats.pendingCount} {t('pending')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10">
            {(['cards', 'table'] as ViewMode[]).map(m => (<button key={m} onClick={() => setViewMode(m)} className={`p-2 rounded-lg transition-all ${viewMode === m ? 'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400'}`}>{m === 'cards' ? <LayoutGrid size={16} /> : <List size={16} />}</button>))}
          </div>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25"><Plus size={16} /> {t('newTransaction')}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { label: t('totalBalance'), value: `R$ ${(stats.balance / 100).toFixed(2)}`, icon: Wallet, color: 'from-emerald-500 to-teal-500' },
          { label: t('revenues'), value: `R$ ${(stats.revenue / 100).toFixed(2)}`, icon: ArrowUpCircle, color: 'from-blue-500 to-indigo-500' },
          { label: t('expenses'), value: `R$ ${(stats.expenses / 100).toFixed(2)}`, icon: ArrowDownCircle, color: 'from-red-500 to-rose-500' },
          { label: t('pending'), value: filteredStats.pendingCount, icon: Clock, color: 'from-amber-500 to-orange-500', action: () => setFilterCat('todas') },
          { label: t('paid'), value: filteredStats.paidCount, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
          { label: t('periodRevenues'), value: `R$ ${(filteredStats.revenue / 100).toFixed(2)}`, icon: TrendingUp, color: 'from-violet-500 to-purple-500', action: () => setFilterCat('receita') },
          { label: t('periodExpenses'), value: `R$ ${(filteredStats.expenses / 100).toFixed(2)}`, icon: TrendingDown, color: 'from-pink-500 to-rose-500', action: () => setFilterCat('despesa') },
        ].map((s, i) => (<motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={s.action}
          className="glass-card p-3 flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-transform">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${s.color}`}><s.icon size={14} className="text-white" /></div>
          <div><p className="text-[10px] text-gray-500">{s.label}</p><p className="text-sm font-bold text-gray-900 dark:text-white">{s.value}</p></div>
        </motion.div>))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('cashFlow')}</h3>
            <div className="flex gap-1 p-0.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02]">
              {[{ label: '30 ' + t('days'), value: 'fluxo' as const }, { label: t('monthly'), value: 'categorias' as const }].map(tb => (
                <button key={tb.value} onClick={() => setChartTab(tb.value)} className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all ${chartTab === tb.value ? 'bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>{tb.label}</button>
              ))}
            </div>
          </div>
          <div className="h-56"><ResponsiveContainer width="100%" height="100%">
            {chartTab === 'fluxo' ? <AreaChart data={chartData}><defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient><linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9ca3af" /><YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }} formatter={(v: number) => `R$ ${v.toFixed(2)}`} /><Area type="monotone" dataKey="receita" stroke="#10b981" fill="url(#rev)" strokeWidth={2} name={t('revenues')} /><Area type="monotone" dataKey="despesa" stroke="#f43f5e" fill="url(#exp)" strokeWidth={2} name={t('expenses')} /></AreaChart>
            : <BarChart data={monthlyBalance}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" /><YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }} formatter={(v: number) => `R$ ${v.toFixed(2)}`} /><Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} name={t('revenues')} /><Bar dataKey="despesa" fill="#f43f5e" radius={[4, 4, 0, 0]} name={t('expenses')} /></BarChart>}
          </ResponsiveContainer></div>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('byCategory')}</h3>
          <div className="h-56 flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><RePieChart><Pie data={categoryPie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">{categoryPie.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }} formatter={(v: number) => `R$ ${v.toFixed(2)}`} /></RePieChart></ResponsiveContainer></div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">{categoryPie.slice(0, 6).map(e => <div key={e.name} className="flex items-center gap-1 text-[10px] text-gray-500"><div className="w-2 h-2 rounded-full" style={{ background: e.color }} />{e.name}</div>)}</div>
        </div>
      </div>

      <div className="glass-card p-3"><div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchTransactions')} className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />{search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14} /></button>}</div>
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
          {[{ label: t('all'), value: 'todas' as FilterCategory }, { label: t('revenues'), value: 'receita' }, { label: t('expenses'), value: 'despesa' }].map(f => (<button key={f.value} onClick={() => setFilterCat(f.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === f.value ? 'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>{f.label}</button>))}
        </div>
        <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value as FilterPeriod)} className="text-xs px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-white/10"><option value="todos">{t('allPeriods')}</option><option value="hoje">{t('today')}</option><option value="semana">{t('week')}</option><option value="mes">{t('month')}</option></select>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} {t('transactions')}</span>
      </div></div>

      <AnimatePresence mode="wait">
        {viewMode === 'cards' && (<motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>{filtered.slice(0, 30).map((item, i) => (<motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.02 }}
            className={`glass-card p-5 cursor-pointer group relative overflow-hidden ${selectedIds.includes(item.id) ? 'ring-2 ring-blue-500' : ''} ${item.category === 'receita' ? 'border-l-2 border-l-emerald-500' : 'border-l-2 border-l-red-500'}`}>
            <div className="flex items-start justify-between mb-3">
              <div><p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{item.description}</p><p className="text-xs text-gray-400 mt-1">{new Date(item.dueDate || item.createdAt).toLocaleDateString('pt-BR')}</p></div>
              <div className={`text-lg font-bold ${item.category === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>{item.category === 'receita' ? '+' : '-'}R$ {(item.amount / 100).toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(item.status)}`}>{item.status}</span><span className={`text-xs px-2 py-0.5 rounded-full ${item.category === 'receita' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{item.category}</span></div>
            {item.status === 'pendente' && (<button onClick={e => { e.stopPropagation(); handlePay(item.id); }} className="mt-2 w-full text-center py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold hover:bg-emerald-500/20 transition-colors">{t('markAsPaid')}</button>)}
          </motion.div>))}</AnimatePresence>
          {filtered.length === 0 && <div className="col-span-3 flex flex-col items-center py-20 text-gray-400"><DollarSign size={36} className="mb-3 opacity-30" /><p className="text-sm">{t('noTransaction')}</p><button onClick={() => setModalOpen(true)} className="mt-4 btn-primary text-xs">{t('newTransaction')}</button></div>}
        </motion.div>)}

        {viewMode === 'table' && (<motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10 bg-black/[0.01]"><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('description')}</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('type')}</th><th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('value')}</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('dueDate')}</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('status')}</th></tr></thead><tbody>{filtered.map(item => (<tr key={item.id} onClick={() => { setSelectedTx(item); setDetailOpen(true); }} className="border-b border-white/5 hover:bg-black/[0.02] cursor-pointer">
          <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900 dark:text-white">{item.description}</p></td>
          <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${item.category === 'receita' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{item.category}</span></td>
          <td className="px-4 py-3 text-right"><p className={`text-sm font-bold ${item.category === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>R$ {(item.amount / 100).toFixed(2)}</p></td>
          <td className="px-4 py-3 hidden md:table-cell"><p className="text-xs text-gray-400">{new Date(item.dueDate || item.createdAt).toLocaleDateString('pt-BR')}</p></td>
          <td className="px-4 py-3 text-center"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(item.status)}`}>{item.status}</span></td>
        </tr>))}</tbody></table></div></motion.div>)}
      </AnimatePresence>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t('newTransactionModal')}><div className="space-y-4">
        <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('descriptionRequired')}</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="glass-input" placeholder="Ex: Pagamento de aluguel" /></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('amountCents')}</label><input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: +e.target.value })} className="glass-input" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('typeRequired')}</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="glass-input"><option value="receita">📈 {t('revenueType')}</option><option value="despesa">📉 {t('expenseType')}</option></select></div></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('dueDate')}</label><input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="glass-input" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('category')}</label><input value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} className="glass-input" placeholder="Ex: aluguel, vendas..." /></div></div>
        <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-3">{t('registerTransaction')}</button></div>
      </Modal>

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={selectedTx?.description || t('detail')}><div className="space-y-4">
        {selectedTx && (<>
          <div className="grid grid-cols-2 gap-3"><div className="glass-card p-3"><p className="text-[11px] text-gray-500">{t('value')}</p><p className={`text-lg font-bold ${selectedTx.category === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>R$ {(selectedTx.amount / 100).toFixed(2)}</p></div>
            <div className="glass-card p-3"><p className="text-[11px] text-gray-500">{t('dueDate')}</p><p className="text-sm font-semibold">{new Date(selectedTx.dueDate || selectedTx.createdAt).toLocaleDateString('pt-BR')}</p></div>
            <div className="glass-card p-3"><p className="text-[11px] text-gray-500">{t('type')}</p><span className={`text-xs px-2 py-0.5 rounded-full ${selectedTx.category === 'receita' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{selectedTx.category}</span></div>
            <div className="glass-card p-3"><p className="text-[11px] text-gray-500">{t('status')}</p><span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(selectedTx.status)}`}>{selectedTx.status}</span></div></div>
          {selectedTx.status === 'pendente' && <button onClick={() => { handlePay(selectedTx.id); setDetailOpen(false); }} className="btn-primary w-full justify-center text-sm py-3 bg-emerald-500 hover:bg-emerald-600">{t('markAsPaid')} ✓</button>}
        </>)}
      </div></Modal>
    </motion.div>
  );
}