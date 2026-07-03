import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Bell, Shield, Palette, Database, HardDrive, Globe, User, Key, Save, Check, Moon, Sun, Monitor,
  Building2, Printer, FileText, LogOut, Loader2, RefreshCw, Download,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useI18nStore } from '@/stores/i18n.store';
import { userService, configService } from '@/lib/services';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type Tab = 'geral' | 'empresa' | 'notificacoes' | 'seguranca' | 'impressao' | 'backup';

export function ConfiguracoesPage() {
  const { theme, setTheme } = useUIStore();
  const { language, t, setLanguage } = useI18nStore();
  const [activeTab, setActiveTab] = useState<Tab>('geral');
  const [saving, setSaving] = useState(false);
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [backupHistory, setBackupHistory] = useState<any[]>([]);
  const [backupConfig, setBackupConfig] = useState({ frequency: 'diario', time: '02:00', retention: 30, autoBackup: false });

  // Password form
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Company form
  const [companyForm, setCompanyForm] = useState({ name: '', fantasyName: '', document: '', businessType: '', phone: '', email: '', street: '', number: '', neighborhood: '', city: '', state: 'SP', cep: '' });

  // Print config
  const [printConfig, setPrintConfig] = useState({ paperSize: 'A4', orientation: 'portrait', showLogo: true, fontSize: '12', printerName: '' });

  useEffect(() => {
    // Load tenant config
    configService.getTenantConfig().then((data: any) => {
      if (!data) return;
      setCompanyForm({
        name: data.name || '', fantasyName: data.fantasyName || '', document: data.document || '',
        businessType: data.businessType || '', phone: data.contacts?.[0]?.value || '',
        email: data.contacts?.find((c: any) => c.type === 'email')?.value || '',
        street: data.address?.street || '', number: data.address?.number || '',
        neighborhood: data.address?.neighborhood || '', city: data.address?.city || '',
        state: data.address?.state || 'SP', cep: data.address?.cep || '',
      });
    }).catch(() => {});
    // Load backups
    loadBackups();
  }, []);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'geral', label: t('general'), icon: Settings },
    { id: 'empresa', label: t('company'), icon: Building2 },
    { id: 'notificacoes', label: t('notifications'), icon: Bell },
    { id: 'seguranca', label: t('security'), icon: Shield },
    { id: 'impressao', label: t('printing'), icon: Printer },
    { id: 'backup', label: t('backup'), icon: Database },
  ];

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      if (section === 'password') {
        if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('Senhas não conferem'); return; }
        await userService.changePassword(pwdForm.currentPassword, pwdForm.newPassword);
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else if (section === 'company') {
        await configService.updateTenantConfig({
          name: companyForm.name, fantasyName: companyForm.fantasyName, document: companyForm.document,
          businessType: companyForm.businessType,
          contacts: [
            companyForm.phone ? { type: 'celular', value: companyForm.phone, isDefault: true } : null,
            companyForm.email ? { type: 'email', value: companyForm.email, isDefault: true } : null,
          ].filter(Boolean),
          address: companyForm.street ? { street: companyForm.street, number: companyForm.number, neighborhood: companyForm.neighborhood, city: companyForm.city, state: companyForm.state, cep: companyForm.cep, country: 'Brasil', type: 'comercial', isDefault: true } : null,
        });
      }
      toast.success(`${section} ${t('saved')}`);
    } catch { toast.error(`Erro ao salvar ${section}`); }
    finally { setSaving(false); }
  };

  const handleCreateBackup = async () => {
    setLoadingBackup(true);
    try {
      await api.post('/backup');
      toast.success('Backup criado com sucesso! 🎉');
      loadBackups();
    } catch { toast.error('Erro ao criar backup'); }
    finally { setLoadingBackup(false); }
  };

  const loadBackups = async () => {
    try {
      const r = await api.get('/backup');
      setBackupHistory(Array.isArray(r.data) ? r.data : (r.data?.data || []));
    } catch { setBackupHistory([]); }
  };

  const handleDownloadBackup = (id: string) => {
    api.get(`/backup/${id}/download`, { responseType: 'blob' }).then(r => {
      const url = URL.createObjectURL(r.data);
      const a = document.createElement('a'); a.href = url; a.download = `backup_${id}.sql`; a.click();
    }).catch(() => toast.error('Erro ao baixar backup'));
  };

  const handlePrintTest = () => {
    window.print();
    toast.success('Página de teste enviada para impressão');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie as preferências do sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-black/3 dark:bg-white/5 w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id ? 'bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* GERAL */}
      {activeTab === 'geral' && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center"><Palette size={17} className="text-white" /></div><div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t('theme')}</p><p className="text-xs text-gray-500">{t('themeDesc')}</p></div></div>
          <div className="grid grid-cols-3 gap-2">
            {[{ value: 'light' as const, label: t('light'), icon: Sun }, { value: 'dark' as const, label: t('dark'), icon: Moon }, { value: 'system' as const, label: t('system'), icon: Monitor }].map((opt) => (
              <button key={opt.value} onClick={() => setTheme(opt.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === opt.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-white/10 bg-white/30 dark:bg-white/5 hover:border-white/30'}`}>
                <opt.icon size={22} className={theme === opt.value ? 'text-blue-500' : 'text-gray-400'} />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><Globe size={17} className="text-white" /></div><div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t('language')}</p><p className="text-xs text-gray-500">{t('langDesc')}</p></div></div>
          <select value={language} onChange={e => setLanguage(e.target.value as any)} className="glass-input w-48">
            <option value="pt-BR">🇧🇷 Português (Brasil)</option>
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
          </select>
        </div>
      </motion.div>)}

      {/* EMPRESA */}
      {activeTab === 'empresa' && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 space-y-3">
        <div className="flex items-center gap-3 mb-2"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center"><Building2 size={17} className="text-white" /></div><div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t('company')}</p><p className="text-xs text-gray-500">Informações da sua empresa</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('companyName')}</label><input value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="glass-input" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('fantasyName')}</label><input value={companyForm.fantasyName} onChange={e => setCompanyForm({...companyForm, fantasyName: e.target.value})} className="glass-input" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('document')}</label><input value={companyForm.document} onChange={e => setCompanyForm({...companyForm, document: e.target.value})} className="glass-input" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('businessType')}</label><select value={companyForm.businessType} onChange={e => setCompanyForm({...companyForm, businessType: e.target.value})} className="glass-input"><option value="">Selecione...</option><option value="loja">Loja</option><option value="clinica">Clínica</option><option value="restaurante">Restaurante</option><option value="prestadora_servico">Serviços</option><option value="oficina">Oficina</option><option value="distribuidora">Distribuidora</option><option value="hotel">Hotel</option><option value="academia">Academia</option><option value="mercado">Mercado</option></select></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('phone')}</label><input value={companyForm.phone} onChange={e => setCompanyForm({...companyForm, phone: e.target.value})} className="glass-input" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('email')}</label><input value={companyForm.email} onChange={e => setCompanyForm({...companyForm, email: e.target.value})} className="glass-input" /></div>
        </div>
        <div className="pt-2 border-t border-white/10"><p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t('address')}</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div><input value={companyForm.cep} onChange={e => setCompanyForm({...companyForm, cep: e.target.value})} className="glass-input" placeholder="CEP" /></div>
          <div className="sm:col-span-2"><input value={companyForm.street} onChange={e => setCompanyForm({...companyForm, street: e.target.value})} className="glass-input" placeholder="Rua" /></div>
          <div><input value={companyForm.number} onChange={e => setCompanyForm({...companyForm, number: e.target.value})} className="glass-input" placeholder="Nº" /></div>
          <div><input value={companyForm.neighborhood} onChange={e => setCompanyForm({...companyForm, neighborhood: e.target.value})} className="glass-input" placeholder="Bairro" /></div>
          <div><input value={companyForm.city} onChange={e => setCompanyForm({...companyForm, city: e.target.value})} className="glass-input" placeholder="Cidade" /></div>
          <div><input value={companyForm.state} onChange={e => setCompanyForm({...companyForm, state: e.target.value})} className="glass-input" placeholder="UF" maxLength={2} /></div>
        </div></div>
        {/* Logo Upload */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Logo da Empresa</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 text-xs text-center">
              Logo
            </div>
            <div>
              <label className="btn-primary text-xs px-4 py-2 cursor-pointer inline-block">
                Upload Logo
                <input type="file" accept="image/png,image/jpeg" className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                      try {
                        await configService.updateTenantConfig({ logo: ev.target?.result as string });
                        toast.success('Logo atualizada!');
                      } catch { toast.error('Erro ao salvar logo'); }
                    };
                    reader.readAsDataURL(file);
                  }} />
              </label>
              <p className="text-[10px] text-gray-400 mt-1">PNG ou JPEG, max 2MB.</p>
            </div>
          </div>
        </div>
        <button onClick={() => handleSave('Empresa')} disabled={saving} className="btn-primary w-full justify-center">{saving ? <Loader2 size={15} className="animate-spin" /> : <><Save size={15} /> {t('save')}</>}</button>
      </motion.div>)}

      {/* NOTIFICAÇÕES */}
      {activeTab === 'notificacoes' && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        {[{ label: 'Notificar novas vendas', desc: 'Alertas quando uma venda é concluída' }, { label: 'Notificar estoque baixo', desc: 'Avisos quando produtos atingem estoque mínimo' }, { label: 'Notificar vencimentos', desc: 'Alertas de contas a pagar/receber' }].map((item, i) => (
          <div key={i} className="glass-card p-4 flex items-center justify-between"><div><p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p><p className="text-xs text-gray-500 mt-0.5">{item.desc}</p></div><input type="checkbox" className="toggle-ios" defaultChecked={i === 0 || i === 1} /></div>
        ))}
      </motion.div>)}

      {/* SEGURANÇA */}
      {activeTab === 'seguranca' && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center"><Key size={17} className="text-white" /></div><div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t('changePassword')}</p><p className="text-xs text-gray-500">{t('securityDesc')}</p></div></div>
          <div className="space-y-3">
            <input type="password" placeholder={t('currentPassword')} value={pwdForm.currentPassword} onChange={e => setPwdForm({...pwdForm, currentPassword: e.target.value})} className="glass-input" />
            <input type="password" placeholder={t('newPassword')} value={pwdForm.newPassword} onChange={e => setPwdForm({...pwdForm, newPassword: e.target.value})} className="glass-input" />
            <input type="password" placeholder={t('confirmPassword')} value={pwdForm.confirmPassword} onChange={e => setPwdForm({...pwdForm, confirmPassword: e.target.value})} className="glass-input" />
            <button onClick={() => handleSave('Senha')} disabled={saving} className="btn-primary">{saving ? <Loader2 size={15} className="animate-spin" /> : <><Save size={15} /> {t('changePassword')}</>}</button>
          </div>
        </div>
      </motion.div>)}

      {/* IMPRESSÃO */}
      {activeTab === 'impressao' && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center"><Printer size={17} className="text-white" /></div><div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t('printConfig')}</p><p className="text-xs text-gray-500">Ajuste as preferências de impressão</p></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('paperSize')}</label><select value={printConfig.paperSize} onChange={e => setPrintConfig({...printConfig, paperSize: e.target.value})} className="glass-input"><option>A4</option><option>Letter</option><option>Legal</option></select></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('printOrientation')}</label><select value={printConfig.orientation} onChange={e => setPrintConfig({...printConfig, orientation: e.target.value})} className="glass-input"><option value="portrait">{t('portrait')}</option><option value="landscape">{t('landscape')}</option></select></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('showLogo')}</label><div className="flex items-center gap-3 pt-1"><input type="checkbox" className="toggle-ios" checked={printConfig.showLogo} onChange={e => setPrintConfig({...printConfig, showLogo: e.target.checked})} /></div></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t('fontSize')}</label><select value={printConfig.fontSize} onChange={e => setPrintConfig({...printConfig, fontSize: e.target.value})} className="glass-input"><option>10</option><option>11</option><option>12</option><option>14</option></select></div>
          </div>
          <button onClick={handlePrintTest} className="btn-primary mt-4"><Printer size={15} /> Testar Impressão</button>
        </div>
      </motion.div>)}

      {/* BACKUP */}
      {activeTab === 'backup' && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><HardDrive size={17} className="text-white" /></div><div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t('autoBackup')}</p><p className="text-xs text-gray-500">{t('backupDescription')}</p></div></div><input type="checkbox" className="toggle-ios" checked={backupConfig.autoBackup} onChange={e => setBackupConfig({...backupConfig, autoBackup: e.target.checked})} /></div>
          {backupConfig.autoBackup && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-4 border-t border-white/10">
            <select value={backupConfig.frequency} onChange={e => setBackupConfig({...backupConfig, frequency: e.target.value})} className="glass-input"><option value="diario">Diário</option><option value="semanal">Semanal</option><option value="mensal">Mensal</option></select>
            <input type="time" value={backupConfig.time} onChange={e => setBackupConfig({...backupConfig, time: e.target.value})} className="glass-input" />
          </motion.div>)}
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center"><Database size={17} className="text-white" /></div><div><p className="text-sm font-semibold text-gray-900 dark:text-white">{t('manualBackup')}</p><p className="text-xs text-gray-500">Crie um backup agora</p></div></div>
          <button onClick={handleCreateBackup} disabled={loadingBackup} className="btn-primary">{loadingBackup ? <Loader2 size={15} className="animate-spin" /> : <><Database size={15} /> {t('createBackup')}</>}</button>
        </div>
        {backupHistory.length > 0 && (<div className="glass-card p-5">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Histórico de Backups</h4>
          <div className="space-y-2">{backupHistory.map((b: any) => (<div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-black/[0.01] text-sm"><div><p className="text-xs font-medium text-gray-700 dark:text-gray-300">{b.filename}</p><p className="text-[10px] text-gray-400">{new Date(b.createdAt).toLocaleString()}</p></div><div className="flex items-center gap-2"><span className="text-[10px] text-gray-400">{b.size ? (b.size / 1024).toFixed(0) + ' KB' : ''}</span><span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${b.status === 'concluido' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{b.status}</span><button onClick={() => handleDownloadBackup(b.id)} className="p-1.5 rounded-lg hover:bg-black/5 text-gray-400"><Download size={13} /></button></div></div>))}</div>
        </div>)}
      </motion.div>)}
    </motion.div>
  );
}