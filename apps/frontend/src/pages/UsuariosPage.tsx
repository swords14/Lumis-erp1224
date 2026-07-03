import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Plus, Search, Shield, Mail, Clock, CheckCircle, XCircle, X, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useI18nStore } from '@/stores/i18n.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function UsuariosPage() {
  const { t } = useI18nStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'operador' });

  const loadData = async () => { setLoading(true); try { const r = await api.get('/users'); setData(r.data.data || r.data || []); } catch { toast.error(t('errorLoading')); } finally { setLoading(false); } };
  useEffect(()=>{loadData();},[]);

  const filtered = data.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    try { await api.post('/users', form); toast.success(t('userCreated')); setModalOpen(false); setForm({ name:'', email:'', password:'', role:'operador' }); loadData(); } catch { toast.error(t('errorSaving')); }
  };

  const handleToggleStatus = async (id: string, current: string) => {
    try { await api.put(`/users/${id}`, { status: current === 'ativo' ? 'inativo' : 'ativo' }); toast.success('Status ' + t('updated')); loadData(); } catch { toast.error(t('errorSaving')); }
  };

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-400 font-medium">{t('admin')}</span><ChevronRight size={12} className="text-gray-400"/><span className="text-xs text-gray-600 font-semibold">{t('userManagement')}</span></div><h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('userManagement')}</h1><p className="text-sm text-gray-500 mt-1">{data.length} {t('usersInSystem')}</p></div>
        <button onClick={()=>setModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25"><Plus size={16}/> {t('newUser')}</button>
      </div>
      <div className="glass-card p-3"><div className="relative max-w-sm"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('searchUser')} className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/[0.02] border border-white/10 text-sm"/></div></div>
      <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10 bg-black/[0.01]"><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('users')}</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('email')}</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('profile')}</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('status')}</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">{t('lastAccess')}</th></tr></thead><tbody>{filtered.map(u=>(<tr key={u.id} className="border-b border-white/5 hover:bg-black/[0.02]"><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)}</div><div><p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p><p className="text-[11px] text-gray-400">{u.role}</p></div></div></td><td className="px-4 py-3 hidden md:table-cell"><p className="text-xs text-gray-500">{u.email}</p></td><td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">{u.role}</span></td><td className="px-4 py-3 text-center"><button onClick={()=>handleToggleStatus(u.id, u.status)} className={`text-xs px-2.5 py-1 rounded-full font-semibold cursor-pointer transition-colors ${u.status==='ativo'?'bg-emerald-50 text-emerald-700 hover:bg-emerald-100':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{u.status}</button></td><td className="px-4 py-3 hidden xl:table-cell"><p className="text-xs text-gray-400">{u.lastLoginAt?new Date(u.lastLoginAt).toLocaleString('pt-BR'):t('never')}</p></td></tr>))}</tbody></table></div>{filtered.length===0&&<div className="text-center py-16 text-gray-400"><User size={36} className="mx-auto mb-3 opacity-30"/><p className="text-sm">{t('noUser')}</p></div>}</div>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={t('newUserModal')}><div className="space-y-4">
        <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('nameRequired')}</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="glass-input"/></div>
        <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('email')} *</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="glass-input"/></div>
        <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('password')} *</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="glass-input"/></div>
        <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('profile')}</label><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="glass-input"><option value="admin">{t('admin')}</option><option value="gerente">Gerente</option><option value="operador">Operador</option><option value="leitura">Leitura</option></select></div>
        <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-3">{t('createUser')}</button></div></Modal>
    </motion.div>
  );
}