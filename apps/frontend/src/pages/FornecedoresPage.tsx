import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Plus, Search, LayoutGrid, List, Mail, Phone, MapPin, Edit3, Trash2, ChevronRight, CheckCircle, X, SlidersHorizontal, Building2, Star, Package } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { clientesService } from '@/lib/services';
import { useI18nStore } from '@/stores/i18n.store';
import toast from 'react-hot-toast';

type ViewMode = 'cards' | 'table';
export function FornecedoresPage() {
  const { t } = useI18nStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [form, setForm] = useState({ name: '', type: 'juridica' as 'fisica'|'juridica', document: '', email: '', phone: '', notes: '', isSupplier: true, isCustomer: false });

  const loadData = async () => { setLoading(true); try { const r = await clientesService.list({ isSupplier: 'true' }); setData(r.data || []); } catch { toast.error(t('errorLoading')); } finally { setLoading(false); } };
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => data.filter(f => !search || f.name?.toLowerCase().includes(search.toLowerCase()) || f.documents?.[0]?.value?.includes(search)), [data, search]);

  const handleSave = async () => {
    try {
      const payload = { name: form.name, type: form.type, isSupplier: true, isCustomer: false, notes: form.notes, contacts: [form.email ? { type: 'email', value: form.email, isDefault: true } : null, form.phone ? { type: 'celular', value: form.phone, isDefault: true } : null].filter(Boolean), documents: form.document ? [{ type: 'cnpj', value: form.document }] : [] };
      if (editing) { await clientesService.update(editing.id, payload); toast.success(t('supplierUpdated')); }
      else { await clientesService.create(payload); toast.success(t('supplierCreated')); }
      setModalOpen(false); setEditing(null); setForm({ name: '', type: 'juridica', document: '', email: '', phone: '', notes: '', isSupplier: true, isCustomer: false }); loadData();
    } catch { toast.error(t('errorSaving')); }
  };

  const handleDelete = (id: string) => {
    setConfirmTitle(t('remove'));
    setConfirmMessage(t('confirmRemoveSuppliers'));
    setConfirmAction(() => async () => {
      try { await clientesService.delete(id); toast.success(t('supplierRemoved')); loadData(); } catch { toast.error(t('errorSaving')); }
      finally { setConfirmOpen(false); }
    });
    setConfirmOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-400 font-medium">{t('purchases')}</span><ChevronRight size={12} className="text-gray-400" /><span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{t('supplierManagement')}</span></div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('supplierManagement')}</h1>
          <p className="text-sm text-gray-500 mt-1">{data.length} {t('registeredSuppliers')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10">
            {(['cards','table'] as ViewMode[]).map(m=><button key={m} onClick={()=>setViewMode(m)} className={`p-2 rounded-lg transition-all ${viewMode===m?'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white':'text-gray-400'}`}>{m==='cards'?<LayoutGrid size={16}/>:<List size={16}/>}</button>)}
          </div>
          <button onClick={()=>{setEditing(null);setModalOpen(true)}} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"><Plus size={16}/> {t('newSupplier')}</button>
        </div>
      </div>
      <div className="glass-card p-3"><div className="relative flex-1 max-w-sm"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('searchSupplier')} className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/>{search&&<button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14}/></button>}</div></div>
      <AnimatePresence mode="wait">
        {viewMode==='cards'&&<motion.div key="cards" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>{filtered.slice(0,30).map((item,i)=>(<motion.div key={item.id} layout initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} transition={{delay:i*0.02}} className="glass-card p-5 cursor-pointer group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">{item.name?.charAt(0)}</div><div><h3 className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</h3><div className="flex items-center gap-1.5 mt-0.5"><span className="text-[11px] text-gray-400">{item.type==='fisica'?t('pf'):t('pj')}</span><span className={`w-1.5 h-1.5 rounded-full ${item.status==='ativo'?'bg-emerald-400':'bg-gray-300'}`}/><span className="text-[11px] text-gray-400">{item.status}</span></div></div></div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5"><button onClick={e=>{e.stopPropagation();setEditing(item);setForm({name:item.name,type:item.type||'juridica',document:item.documents?.[0]?.value||'',email:item.contacts?.find((c:any)=>c.type==='email')?.value||'',phone:item.contacts?.find((c:any)=>c.type==='celular')?.value||'',notes:item.notes||'',isSupplier:true,isCustomer:false});setModalOpen(true)}} className="p-1.5 rounded-lg hover:bg-black/5 text-gray-400"><Edit3 size={13}/></button><button onClick={e=>{e.stopPropagation();handleDelete(item.id)}} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13}/></button></div></div>
            <div className="space-y-1.5">{item.contacts?.find((c:any)=>c.type==='email')?.value&&<div className="flex items-center gap-2 text-xs text-gray-500"><Mail size={11} className="text-gray-400 shrink-0"/><span className="truncate">{item.contacts.find((c:any)=>c.type==='email')?.value}</span></div>}{item.contacts?.find((c:any)=>c.type==='celular')?.value&&<div className="flex items-center gap-2 text-xs text-gray-500"><Phone size={11} className="text-gray-400 shrink-0"/>{item.contacts.find((c:any)=>c.type==='celular')?.value}</div>}</div>
          </motion.div>))}</AnimatePresence>{filtered.length===0&&<div className="col-span-3 flex flex-col items-center py-20 text-gray-400"><Truck size={36} className="mb-3 opacity-30"/><p className="text-sm font-medium">{t('noSupplier')}</p><button onClick={()=>{setEditing(null);setModalOpen(true)}} className="mt-4 btn-primary text-xs">{t('registerSupplier')}</button></div>}</motion.div>}
        {viewMode==='table'&&<motion.div key="table" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10 bg-black/[0.01]"><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('supplierManagement')}</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('contact')}</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">CNPJ</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('status')}</th><th className="w-10 px-4 py-3"></th></tr></thead><tbody>{filtered.map(item=>(<tr key={item.id} className="border-b border-white/5 hover:bg-black/[0.02] cursor-pointer"><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">{item.name?.charAt(0)}</div><div><p className="text-sm font-medium">{item.name}</p><p className="text-[11px] text-gray-400">{item.type==='fisica'?t('pf'):t('pj')}</p></div></div></td><td className="px-4 py-3 hidden md:table-cell"><p className="text-xs text-gray-500">{item.contacts?.find((c:any)=>c.type==='email')?.value||item.contacts?.find((c:any)=>c.type==='celular')?.value||'—'}</p></td><td className="px-4 py-3 hidden lg:table-cell"><p className="text-xs text-gray-400 font-mono">{item.documents?.[0]?.value||'—'}</p></td><td className="px-4 py-3 text-center"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${item.status==='ativo'?'bg-emerald-50 text-emerald-700':'bg-gray-100 text-gray-600'}`}>{item.status}</span></td><td className="px-4 py-3" onClick={e=>e.stopPropagation()}><div className="flex items-center gap-1"><button onClick={()=>{setEditing(item);setForm({name:item.name,type:item.type||'juridica',document:item.documents?.[0]?.value||'',email:item.contacts?.find((c:any)=>c.type==='email')?.value||'',phone:item.contacts?.find((c:any)=>c.type==='celular')?.value||'',notes:item.notes||'',isSupplier:true,isCustomer:false});setModalOpen(true)}} className="p-1.5 rounded-lg hover:bg-black/5 text-gray-400"><Edit3 size={13}/></button><button onClick={()=>handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13}/></button></div></td></tr>))}</tbody></table></div></motion.div>}
      </AnimatePresence>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editing?t('editSupplier'):t('newSupplierModal')} size="md"><div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div className="sm:col-span-2"><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('nameRequired')}</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="glass-input" placeholder={t('tradingName')}/></div><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('type')}</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value as any})} className="glass-input"><option value="juridica">{t('legalPerson')}</option><option value="fisica">{t('physicalPerson')}</option></select></div><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('cpfCnpj')}</label><input value={form.document} onChange={e=>setForm({...form,document:e.target.value})} className="glass-input"/></div></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('email')}</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="glass-input"/></div><div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('phone')}</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="glass-input"/></div></div>
        <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('observations')}</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} className="glass-input"/></div>
        <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-3">{editing?t('saveChanges'):t('registerSupplier')}</button></div></Modal>
      <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmAction} title={confirmTitle} message={confirmMessage} confirmLabel={t('remove')} cancelLabel={t('cancel')} />
    </motion.div>
  );
}
