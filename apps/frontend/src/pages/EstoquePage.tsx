import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Plus, Search, ArrowDown, ArrowUp, Clock, Package, ChevronRight, Filter, X, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '@/lib/api';

type MovementType = 'todos' | 'entrada' | 'saida';
export function EstoquePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<MovementType>('todos');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ productId:'', type:'entrada', quantity:0, reason:'', unitPrice:0 });

  const loadData = async () => {
    setLoading(true);
    try { const r = await api.get('/stock/movements'); setData(r.data.data || r.data || []); } catch { }
    finally { setLoading(false); }
  };
  useEffect(()=>{loadData()},[]);

  const filtered = useMemo(() => {
    let d = data;
    if (filterType !== 'todos') d = d.filter((m:any) => m.type === filterType);
    if (search) d = d.filter((m:any) => m.reason?.toLowerCase().includes(search.toLowerCase()) || m.product?.name?.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [data, filterType, search]);

  const handleSave = async () => {
    try { await api.post('/stock/movements', form); toast.success('Movimentação registrada!'); setModalOpen(false); loadData(); } catch { toast.error('Erro'); }
  };

  const stats = { entrada: data.filter((m:any)=>m.type==='entrada').reduce((s:number,m:any)=>s+m.quantity,0), saida: data.filter((m:any)=>m.type==='saida').reduce((s:number,m:any)=>s+m.quantity,0) };

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-400 font-medium">Estoque</span><ChevronRight size={12} className="text-gray-400"/><span className="text-xs text-gray-600 font-semibold">Movimentações</span></div><h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Estoque</h1><p className="text-sm text-gray-500 mt-1">{data.length} movimentações</p></div>
        <button onClick={()=>setModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/25"><Plus size={16}/>Nova Movimentação</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[{label:'Entradas',value:stats.entrada,icon:ArrowUp,color:'from-emerald-500 to-teal-500'},{label:'Saídas',value:stats.saida,icon:ArrowDown,color:'from-red-500 to-rose-500'}].map((s,i)=>(<motion.div key={s.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="glass-card p-4 flex items-center gap-3"><div className={`p-2 rounded-xl bg-gradient-to-br ${s.color}`}><s.icon size={15} className="text-white"/></div><div><p className="text-[11px] text-gray-500">{s.label}</p><p className="text-lg font-bold">{s.value} itens</p></div></motion.div>))}
      </div>
      <div className="glass-card p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-white/10 text-sm"/>{search&&<button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14}/></button>}</div>
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
          {[{label:'Todas',value:'todos'},{label:'Entradas',value:'entrada'},{label:'Saídas',value:'saida'}].map(f=><button key={f.value} onClick={()=>setFilterType(f.value as MovementType)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType===f.value?'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white':'text-gray-500'}`}>{f.label}</button>)}
        </div>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} movimentações</span>
      </div>
      <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10 bg-black/[0.01]"><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produto</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qtd</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Motivo</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th></tr></thead><tbody>{filtered.map((m:any)=>(<tr key={m.id} className="border-b border-white/5 hover:bg-black/[0.02]"><td className="px-4 py-3"><p className="text-sm font-medium">{m.product?.name||'Produto'}</p></td><td className="px-4 py-3 text-center"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${m.type==='entrada'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700'}`}>{m.type}</span></td><td className="px-4 py-3 text-center"><span className={`text-sm font-bold ${m.type==='entrada'?'text-emerald-600':'text-red-600'}`}>{m.type==='entrada'?'+':'-'}{m.quantity}</span></td><td className="px-4 py-3 hidden md:table-cell"><p className="text-xs text-gray-500">{m.reason||'—'}</p></td><td className="px-4 py-3"><p className="text-xs text-gray-400">{format(new Date(m.createdAt),'dd/MM/yy HH:mm')}</p></td></tr>))}</tbody></table></div>{filtered.length===0&&<div className="text-center py-16 text-gray-400"><Box size={36} className="mx-auto mb-3 opacity-30"/><p className="text-sm">Nenhuma movimentação</p></div>}</div>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Nova Movimentação"><div className="space-y-4">
        <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Tipo</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="glass-input"><option value="entrada">📥 Entrada</option><option value="saida">📤 Saída</option></select></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Quantidade</label><input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:+e.target.value})} className="glass-input"/></div><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Preço unitário</label><input type="number" value={form.unitPrice} onChange={e=>setForm({...form,unitPrice:+e.target.value})} className="glass-input"/></div></div>
        <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Motivo</label><input value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} className="glass-input" placeholder="Ex: Compra, venda, ajuste..."/></div>
        <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-3">Registrar Movimentação</button></div></Modal>
    </motion.div>
  );
}