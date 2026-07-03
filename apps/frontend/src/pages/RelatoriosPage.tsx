import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Download, Calendar, Filter, BarChart3, PieChart, ShoppingCart, DollarSign, Users, Package,
  ChevronDown, ChevronRight, X, Eye, FileText, Printer, RefreshCw, Clock, AlertTriangle, CheckCircle, Star
} from 'lucide-react';
import { vendasService, financeiroService, clientesService, produtosService } from '@/lib/services';
import { DataTable } from '@/components/ui/DataTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { format, subDays, startOfMonth } from 'date-fns';
import { useI18nStore } from '@/stores/i18n.store';
import toast from 'react-hot-toast';

type ReportId = 'vendas' | 'financeiro' | 'clientes' | 'produtos' | 'estoque' | 'fluxo';
type Period = '7d' | '30d' | 'mes' | 'todos';

export function RelatoriosPage() {
  const { t } = useI18nStore();
  const [activeReport, setActiveReport] = useState<ReportId | null>(null);
  const [period, setPeriod] = useState<Period>('30d');
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [clientesData, setClientesData] = useState<any[]>([]);
  const [produtosData, setProdutosData] = useState<any[]>([]);

  const periodLabel: Record<Period, string> = { '7d': t('week'), '30d': t('month30'), 'mes': t('month'), 'todos': t('allPeriods') };

  const loadReport = async (id: ReportId) => {
    setActiveReport(activeReport === id ? null : id);
    setLoading(true);
    try {
      const now = new Date();
      let since: Date | null = null;
      if (period === '7d') since = subDays(now, 7);
      else if (period === '30d') since = subDays(now, 30);
      else if (period === 'mes') since = startOfMonth(now);

      if (id === 'vendas') { const r = await vendasService.list(); let d = r.data || []; if (since) d = d.filter((s: any) => new Date(s.createdAt) >= since!); setSalesData(d); }
      if (id === 'financeiro') { const r = await financeiroService.list(); let d = r.data || []; if (since) d = d.filter((t: any) => new Date(t.dueDate || t.createdAt) >= since!); setFinanceData(d); }
      if (id === 'clientes') { const r = await clientesService.list({ isCustomer: 'true' }); let d = r.data || []; if (since) d = d.filter((c: any) => new Date(c.createdAt) >= since!); setClientesData(d); }
      if (id === 'produtos' || id === 'estoque') { const r = await produtosService.list(); let d = r.data || []; setProdutosData(d); }
    } catch { toast.error(t('errorLoading')); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (activeReport) loadReport(activeReport); }, [period]);

  const handleExport = () => {
    let csv = '';
    const data = activeReport === 'vendas' ? salesData : activeReport === 'financeiro' ? financeData : activeReport === 'clientes' ? clientesData : activeReport === 'produtos' || activeReport === 'estoque' ? produtosData : [];
    if (data.length === 0) { toast.error(t('reportExported')); return; }
    const keys = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'tenantId');
    csv = keys.join(';') + '\n';
    data.forEach((row: any) => { csv += keys.map(k => typeof row[k] === 'object' ? '' : row[k]?.toString().replace(/;/g, ',') || '').join(';') + '\n'; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${activeReport}_${format(new Date(), 'yyyyMMdd')}.csv`; a.click();
    toast.success(t('reportExported'));
  };

  const reports = [
    { id: 'vendas' as ReportId, label: t('salesByPeriod'), desc: t('salesDesc'), icon: ShoppingCart, color: 'from-blue-500 to-indigo-500' },
    { id: 'financeiro' as ReportId, label: t('financialFlow'), desc: t('financialDesc'), icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { id: 'clientes' as ReportId, label: t('activeClientsReport'), desc: t('clientsDesc'), icon: Users, color: 'from-violet-500 to-purple-500' },
    { id: 'produtos' as ReportId, label: t('productCatalog'), desc: t('productsDesc'), icon: Package, color: 'from-amber-500 to-orange-500' },
    { id: 'estoque' as ReportId, label: t('criticalStock'), desc: t('stockDesc'), icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
  ];

  const salesChart = useMemo(() => {
    const days: any[] = [];
    for (let i = 29; i >= 0; i--) { const d = subDays(new Date(), i); const k = format(d, 'dd/MM'); const ds = salesData.filter((s: any) => format(new Date(s.createdAt), 'dd/MM') === k); days.push({ date: k, value: ds.reduce((sum: number, s: any) => sum + s.total, 0) / 100, count: ds.length }); }
    return days;
  }, [salesData]);

  const financeChart = useMemo(() => {
    const days: any[] = [];
    for (let i = 29; i >= 0; i--) { const d = subDays(new Date(), i); const k = format(d, 'dd/MM'); const ds = financeData.filter((t: any) => format(new Date(t.dueDate || t.createdAt), 'dd/MM') === k); days.push({ date: k, receita: ds.filter((t: any) => t.category === 'receita').reduce((s: number, t: any) => s + t.amount, 0) / 100, despesa: ds.filter((t: any) => t.category === 'despesa').reduce((s: number, t: any) => s + t.amount, 0) / 100 }); }
    return days;
  }, [financeData]);

  const salesColumns = [
    { key: 'number', label: t('orders'), sortable: true, render: (i: any) => <span className="font-mono text-xs font-semibold text-blue-600">{i.number}</span> },
    { key: 'customer', label: t('customer'), render: (i: any) => <span className="text-xs">{i.customer?.name || '—'}</span> },
    { key: 'total', label: t('total'), align: 'right' as const, format: (v: number) => `R$ ${(v / 100).toFixed(2)}` },
    { key: 'status', label: t('status'), render: (i: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${i.status === 'pendente' ? 'bg-amber-50 text-amber-700' : i.status === 'aprovado' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-600'}`}>{i.status}</span> },
    { key: 'createdAt', label: t('date'), format: (v: string) => new Date(v).toLocaleDateString('pt-BR') },
  ];

  const financeColumns = [
    { key: 'description', label: t('description'), sortable: true, render: (i: any) => <span className="text-sm font-medium">{i.description}</span> },
    { key: 'category', label: t('type'), render: (i: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${i.category === 'receita' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{i.category}</span> },
    { key: 'amount', label: t('value'), align: 'right' as const, format: (v: number) => <span className={`font-semibold ${v > 0 ? 'text-emerald-600' : 'text-red-600'}`}>R$ {(Math.abs(v) / 100).toFixed(2)}</span> },
    { key: 'status', label: t('status'), render: (i: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i.status === 'pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{i.status}</span> },
  ];

  const clientesColumns = [
    { key: 'name', label: t('name'), sortable: true, render: (i: any) => <span className="text-sm font-medium">{i.name}</span> },
    { key: 'type', label: t('type'), render: (i: any) => <span className="text-xs text-gray-500">{i.type === 'fisica' ? 'PF' : 'PJ'}</span> },
    { key: 'status', label: t('status'), render: (i: any) => <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${i.status === 'ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-600'}`}>{i.status}</span> },
    { key: 'createdAt', label: t('registration'), format: (v: string) => new Date(v).toLocaleDateString('pt-BR') },
  ];

  const produtosColumns = [
    { key: 'code', label: t('code'), sortable: true, render: (i: any) => <span className="font-mono text-xs text-gray-500">{i.code}</span> },
    { key: 'name', label: t('name'), sortable: true, render: (i: any) => <span className="text-sm font-medium">{i.name}</span> },
    { key: 'sellingPrice', label: t('price'), align: 'right' as const, format: (v: number) => `R$ ${(v / 100).toFixed(2)}` },
    { key: 'currentStock', label: t('stock'), align: 'center' as const, render: (i: any) => <span className={`text-xs font-bold ${i.currentStock <= i.minStock ? 'text-red-500' : 'text-emerald-500'}`}>{i.currentStock} {i.unitOfMeasure}</span> },
  ];

  const estoqueColumns = [
    { key: 'code', label: t('code'), sortable: true, render: (i: any) => <span className="font-mono text-xs text-gray-500">{i.code}</span> },
    { key: 'name', label: t('product'), sortable: true, render: (i: any) => <div className="flex items-center gap-2"><AlertTriangle size={12} className="text-red-400" /><span className="text-sm font-medium text-red-600">{i.name}</span></div> },
    { key: 'currentStock', label: t('current'), align: 'center' as const, render: (i: any) => <span className="text-red-500 font-bold">{i.currentStock}</span> },
    { key: 'minStock', label: t('minimum'), align: 'center' as const, render: (i: any) => <span className="text-xs text-gray-500">{i.minStock}</span> },
    { key: 'suggested', label: t('reorder'), align: 'right' as const, render: (i: any) => <span className="text-amber-600 font-semibold">{Math.max(0, i.minStock - i.currentStock + Math.ceil(i.minStock * 0.5))}</span> },
  ];

  const printReport = () => { window.print(); };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{t('reportsTitle')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('viewExportReports')}</p>
        </div>
        <div className="flex items-center gap-2">
          {activeReport && (
            <>
              <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10 text-xs text-gray-600 dark:text-gray-400 hover:bg-black/[0.06] transition-all">
                <Download size={14} /> {t('exportCSV')}
              </button>
              <button onClick={printReport} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10 text-xs text-gray-600 dark:text-gray-400 hover:bg-black/[0.06] transition-all">
                <Printer size={14} /> {t('printReport')}
              </button>
              <button onClick={() => setShowChart(!showChart)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${showChart ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' : 'bg-black/[0.03] dark:bg-white/[0.03] border-white/10 text-gray-500'}`}>
                <BarChart3 size={13} /> {showChart ? t('activeChart') : t('tableOnly')}
              </button>
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
                {Object.entries(periodLabel).map(([k, v]) => (
                  <button key={k} onClick={() => setPeriod(k as Period)} className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${period === k ? 'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>{v}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, i) => (
          <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div onClick={() => loadReport(report.id)}
              className={`glass-card p-5 cursor-pointer transition-all duration-300 ${activeReport === report.id ? 'ring-2 ring-blue-500 shadow-xl bg-blue-500/[0.02]' : 'hover:scale-[1.01]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center shadow-lg`}>
                    <report.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{report.label}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{report.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeReport === report.id && <Eye size={16} className="text-blue-500" />}
                  <ChevronRight size={16} className={`text-gray-400 transition-transform ${activeReport === report.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {activeReport === report.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-3 space-y-4">

                    {report.id === 'vendas' && (
                      <>
                        <div className="grid grid-cols-4 gap-2">
                          {[{ l: t('orders'), v: salesData.length }, { l: t('billing'), v: `R$ ${(salesData.filter((s: any) => s.status !== 'cancelado').reduce((sum: number, s: any) => sum + s.total, 0) / 100).toFixed(2)}` }, { l: t('pending'), v: salesData.filter((s: any) => s.status === 'pendente').length }, { l: t('approved'), v: salesData.filter((s: any) => s.status === 'aprovado').length }].map((s, i) => (
                            <div key={i} className="glass-card p-3 text-center"><p className="text-[10px] text-gray-500">{s.l}</p><p className="text-lg font-bold text-gray-900 dark:text-white">{s.v}</p></div>
                          ))}
                        </div>
                        {showChart && <div className="glass-card p-4"><h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">{t('dailyBilling')}</h4><div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={salesChart}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#9ca3af" /><YAxis tick={{ fontSize: 9 }} stroke="#9ca3af" /><Tooltip contentStyle={{ borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.95)' }} formatter={(v: number) => `R$ ${v.toFixed(2)}`} /><Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name={t('billing')} /></BarChart></ResponsiveContainer></div></div>}
                        <DataTable columns={salesColumns} data={salesData} loading={loading} emptyMessage={t('noSalesPeriod')} keyExtractor={i => i.id} searchable={false} pageSize={10} />
                      </>
                    )}

                    {report.id === 'financeiro' && (
                      <>
                        <div className="grid grid-cols-4 gap-2">
                          {[{ l: t('revenues'), v: `R$ ${(financeData.filter((t: any) => t.category === 'receita').reduce((s: number, t: any) => s + t.amount, 0) / 100).toFixed(2)}` }, { l: t('expenses'), v: `R$ ${(financeData.filter((t: any) => t.category === 'despesa').reduce((s: number, t: any) => s + t.amount, 0) / 100).toFixed(2)}` }, { l: t('balance'), v: `R$ ${((financeData.filter((t: any) => t.category === 'receita').reduce((s: number, t: any) => s + t.amount, 0) - financeData.filter((t: any) => t.category === 'despesa').reduce((s: number, t: any) => s + t.amount, 0)) / 100).toFixed(2)}` }, { l: t('pending'), v: financeData.filter((t: any) => t.status === 'pendente').length }].map((s, i) => (
                            <div key={i} className="glass-card p-3 text-center"><p className="text-[10px] text-gray-500">{s.l}</p><p className="text-lg font-bold text-gray-900 dark:text-white">{s.v}</p></div>
                          ))}
                        </div>
                        {showChart && <div className="glass-card p-4"><h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">{t('financialFlowChart')}</h4><div className="h-48"><ResponsiveContainer width="100%" height="100%"><AreaChart data={financeChart}><defs><linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient><linearGradient id="ef" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} /><XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#9ca3af" /><YAxis tick={{ fontSize: 9 }} stroke="#9ca3af" /><Tooltip contentStyle={{ borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.95)' }} formatter={(v: number) => `R$ ${v.toFixed(2)}`} /><Area type="monotone" dataKey="receita" stroke="#10b981" fill="url(#rf)" strokeWidth={2} /><Area type="monotone" dataKey="despesa" stroke="#f43f5e" fill="url(#ef)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></div>}
                        <DataTable columns={financeColumns} data={financeData} loading={loading} emptyMessage={t('noTransPeriod')} keyExtractor={i => i.id} searchable={false} pageSize={10} />
                      </>
                    )}

                    {report.id === 'clientes' && (
                      <>
                        <div className="grid grid-cols-4 gap-2">
                          {[{ l: t('total'), v: clientesData.length }, { l: t('active'), v: clientesData.filter((c: any) => c.status === 'ativo').length }, { l: 'PF', v: clientesData.filter((c: any) => c.type === 'fisica').length }, { l: 'PJ', v: clientesData.filter((c: any) => c.type === 'juridica').length }].map((s, i) => (
                            <div key={i} className="glass-card p-3 text-center"><p className="text-[10px] text-gray-500">{s.l}</p><p className="text-lg font-bold text-gray-900 dark:text-white">{s.v}</p></div>
                          ))}
                        </div>
                        <DataTable columns={clientesColumns} data={clientesData} loading={loading} emptyMessage={t('noClientsPeriod')} keyExtractor={i => i.id} searchable={false} pageSize={10} />
                      </>
                    )}

                    {report.id === 'produtos' && (
                      <>
                        <div className="grid grid-cols-4 gap-2">
                          {[{ l: t('total'), v: produtosData.length }, { l: t('active'), v: produtosData.filter((p: any) => p.isActive).length }, { l: t('stockValue'), v: `R$ ${(produtosData.reduce((s: number, p: any) => s + p.sellingPrice * p.currentStock, 0) / 100).toFixed(2)}` }, { l: t('avgMargin'), v: `${(produtosData.filter((p: any) => p.sellingPrice > 0).reduce((s: number, p: any) => s + (p.sellingPrice - p.costPrice) / p.sellingPrice * 100, 0) / (produtosData.filter((p: any) => p.sellingPrice > 0).length || 1)).toFixed(1)}%` }].map((s, i) => (
                            <div key={i} className="glass-card p-3 text-center"><p className="text-[10px] text-gray-500">{s.l}</p><p className="text-lg font-bold text-gray-900 dark:text-white">{s.v}</p></div>
                          ))}
                        </div>
                        <DataTable columns={produtosColumns} data={produtosData} loading={loading} emptyMessage={t('noProduct')} keyExtractor={i => i.id} searchable={false} pageSize={10} />
                      </>
                    )}

                    {report.id === 'estoque' && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ l: t('lowStock'), v: produtosData.filter((p: any) => p.currentStock <= p.minStock).length }, { l: t('zeroItems'), v: produtosData.filter((p: any) => p.currentStock === 0).length }, { l: t('reorderCost'), v: `R$ ${(produtosData.filter((p: any) => p.currentStock <= p.minStock).reduce((s: number, p: any) => s + p.costPrice * Math.max(0, p.minStock - p.currentStock + Math.ceil(p.minStock * 0.5)), 0) / 100).toFixed(2)}` }].map((s, i) => (
                            <div key={i} className="glass-card p-3 text-center"><p className="text-[10px] text-gray-500">{s.l}</p><p className="text-lg font-bold text-red-600">{s.v}</p></div>
                          ))}
                        </div>
                        <DataTable columns={estoqueColumns} data={produtosData.filter((p: any) => p.currentStock <= p.minStock)} loading={loading} emptyMessage={t('noProductStock')} keyExtractor={i => i.id} searchable={false} pageSize={10} />
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}