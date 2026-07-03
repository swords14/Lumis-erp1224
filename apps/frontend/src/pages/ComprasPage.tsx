import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Search, LayoutGrid, List, Truck, DollarSign, Calendar, CheckCircle, Clock, XCircle, ChevronRight, Edit3, Trash2, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { vendasService } from '@/lib/services';
import { useI18nStore } from '@/stores/i18n.store';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

type ViewMode = 'cards'|'table';
export function ComprasPage() {
  const { t } = useI18nStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ supplier:'', description:'', quantity:1, unitPrice:0, method:'dinheiro', dueDate:format(new Date(),'yyyy-MM-dd') });

  const loadData = async()=>{setLoading(true);try{const r=await vendasService.list();setData(r.data||[]);}catch{toast.error(t('errorLoading'));}finally{setLoading(false);}};
  useEffect(()=>{loadData();},[]);

  const filtered=data.filter((p:any)=>!search||p.number?.toLowerCase().includes(search.toLowerCase())||p.customer?.name?.toLowerCase().includes(search.toLowerCase()));
  const handleSave=async()=>{const total=form.quantity*form.unitPrice;try{await vendasService.create({items:[{description:form.description,quantity:form.quantity,unitPrice:form.unitPrice}],payments:[{method:form.method,amount:total}],notes:form.supplier}as any);toast.success(t('purchaseCreated'));setModalOpen(false);loadData();}catch{toast.error(t('errorSaving'));}};
  const handleStatus=async(id:string,status:string)=>{try{await vendasService.update(id,{status}as any);toast.success(status==='aprovado'?t('saleApproved'):t('saleCancelled'));loadData();}catch{toast.error(t('errorSaving'));}};
  const getStatusBadge=(s:string)=>s==='pendente'?'bg-amber-50 text-amber-700':s==='aprovado'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700';

  return(
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-400 font-medium">{t('purchases')}</span><ChevronRight size={12} className="text-gray-400"/><span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{t('purchaseOrders')}</span></div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('purchases')}</h1>
          <p className="text-sm text-gray-500 mt-1">{data.length} {t('purchaseOrders')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10">
            {['cards','table'].map(m=><button key={m} onClick={()=>setViewMode(m as ViewMode)} className={`p-2 rounded-lg transition-all ${viewMode===m?'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white':'text-gray-400'}`}>{m==='cards'?<LayoutGrid size={16}/>:<List size={16}/>}</button>)}
          </div>
          <button onClick={()=>setModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/25"><Plus size={16}/>{t('newPurchase')}</button>
        </div>
      </div>
      <div className="glass-card p-3"><div className="relative flex-1 max-w-sm"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('searchPurchase')} className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/>{search&&<button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14}/></button>}</div></div>
      <AnimatePresence mode="wait">
        {viewMode==='cards'&&<motion.div key="cards" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>{filtered.slice(0,30).map((item,i)=>(<motion.div key={item.id} layout initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} transition={{delay:i*0.02}} className="glass-card p-5 cursor-pointer group">
            <div className="flex items-start justify-between mb-3"><div><p className="text-xs font-mono font-semibold text-orange-600 dark:text-orange-400">{item.number}</p><p className="text-[11px] text-gray-400 mt-0.5">{item.notes||t('supplier')}</p></div><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(item.status)}`}>{item.status}</span></div>
            <div className="flex items-center justify-between"><span className="text-lg font-bold text-gray-900 dark:text-white">R$ {(item.total/100).toFixed(2)}</span><span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span></div>
            {item.status==='pendente'&&<button onClick={e=>{e.stopPropagation();handleStatus(item.id,'aprovado');}} className="mt-2 w-full text-center py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold hover:bg-emerald-500/20">{t('markAsReceived')} ✓</button>}
          </motion.div>))}</AnimatePresence>{filtered.length===0&&<div className="col-span-3 flex flex-col items-center py-20 text-gray-400"><ShoppingBag size={36} className="mb-3 opacity-30"/><p className="text-sm">{t('noPurchase')}</p></div>}</motion.div>}
        {viewMode==='table'&&<motion.div key="table" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10 bg-black/[0.01]"><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('purchaseOrder')}</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('supplier')}</th><th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('total')}</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('status')}</th></tr></thead><tbody>{filtered.map(item=>(<tr key={item.id} className="border-b border-white/5 hover:bg-black/[0.02]"><td className="px-4 py-3"><p className="text-sm font-mono font-semibold text-orange-600">{item.number}</p></td><td className="px-4 py-3 hidden md:table-cell"><p className="text-xs text-gray-500">{item.notes||'—'}</p></td><td className="px-4 py-3 text-right"><p className="text-sm font-bold">R$ {(item.total/100).toFixed(2)}</p></td><td className="px-4 py-3 text-center"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(item.status)}`}>{item.status}</span></td></tr>))}</tbody></table></div></motion.div>}
      </AnimatePresence>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={t('newPurchaseOrder')}><div className="space-y-4">
        <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('supplier')}</label><input value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} className="glass-input" placeholder={t('supplierName')}/></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('description')}</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="glass-input"/></div><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('quantity')}</label><input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:+e.target.value})} className="glass-input"/></div></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('unitPriceCents')}</label><input type="number" value={form.unitPrice} onChange={e=>setForm({...form,unitPrice:+e.target.value})} className="glass-input"/></div><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('dueDate')}</label><input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} className="glass-input"/></div></div>
        <div className="glass-card p-4 text-center"><p className="text-xs text-gray-500 mb-1">{t('total').toUpperCase()}</p><p className="text-3xl font-bold text-orange-600">R$ {(form.quantity*form.unitPrice/100).toFixed(2)}</p></div>
        <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-3">{t('createPurchaseOrder')}</button></div></Modal>
    </motion.div>
  );
}