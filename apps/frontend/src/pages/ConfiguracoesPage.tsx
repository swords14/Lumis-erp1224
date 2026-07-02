import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Bell, Shield, Palette, Database, HardDrive, Globe, User, Key, Save, Check, Moon, Sun, Monitor, LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'geral' | 'notificacoes' | 'seguranca' | 'backup';

export function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('geral');
  const [theme, setTheme] = useState('system');
  const [notifyVendas, setNotifyVendas] = useState(true);
  const [notifyEstoque, setNotifyEstoque] = useState(true);
  const [notifyFinanceiro, setNotifyFinanceiro] = useState(false);
  const [autoBackup, setAutoBackup] = useState(false);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  const handleSave = (section: string) => {
    toast.success(`${section} salvo com sucesso!`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie as preferências do sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-black/3 dark:bg-white/5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'geral' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Tema */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Palette size={17} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Tema</p>
                <p className="text-xs text-gray-500">Escolha a aparência do sistema</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light', label: 'Claro', icon: Sun },
                { value: 'dark', label: 'Escuro', icon: Moon },
                { value: 'system', label: 'Sistema', icon: Monitor },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === opt.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-white/10 bg-white/30 dark:bg-white/5 hover:border-white/30'
                  }`}
                >
                  <opt.icon size={22} className={theme === opt.value ? 'text-blue-500' : 'text-gray-400'} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Idioma */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Globe size={17} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Idioma</p>
                <p className="text-xs text-gray-500">Idioma da interface</p>
              </div>
            </div>
            <select className="glass-input w-48">
              <option>Português (Brasil)</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Notificações */}
      {activeTab === 'notificacoes' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {[
            { label: 'Notificar novas vendas', desc: 'Alertas quando uma venda é concluída', state: notifyVendas, setter: setNotifyVendas },
            { label: 'Notificar estoque baixo', desc: 'Avisos quando produtos atingem estoque mínimo', state: notifyEstoque, setter: setNotifyEstoque },
            { label: 'Notificar vencimentos', desc: 'Alertas de contas a pagar/receber', state: notifyFinanceiro, setter: setNotifyFinanceiro },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                className="toggle-ios"
                checked={item.state}
                onChange={(e) => item.setter(e.target.checked)}
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Segurança */}
      {activeTab === 'seguranca' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                <Key size={17} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Alterar Senha</p>
                <p className="text-xs text-gray-500">Mantenha sua conta segura</p>
              </div>
            </div>
            <div className="space-y-3">
              <input type="password" placeholder="Senha atual" className="glass-input" />
              <input type="password" placeholder="Nova senha" className="glass-input" />
              <input type="password" placeholder="Confirmar nova senha" className="glass-input" />
              <button onClick={() => handleSave('Senha')} className="btn-primary">
                <Save size={15} /> Alterar Senha
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Backup */}
      {activeTab === 'backup' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <HardDrive size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Backup Automático</p>
                  <p className="text-xs text-gray-500">Proteja seus dados automaticamente</p>
                </div>
              </div>
              <input type="checkbox" className="toggle-ios" checked={autoBackup} onChange={(e) => setAutoBackup(e.target.checked)} />
            </div>
            {autoBackup && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-4 border-t border-white/10">
                <select className="glass-input">
                  <option>Diário</option>
                  <option>Semanal</option>
                  <option>Mensal</option>
                </select>
                <input type="time" defaultValue="02:00" className="glass-input" />
              </motion.div>
            )}
          </div>
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Database size={17} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Backup Manual</p>
                <p className="text-xs text-gray-500">Crie um backup agora</p>
              </div>
            </div>
            <button onClick={() => handleSave('Backup')} className="btn-primary">
              <Save size={15} /> Criar Backup Agora
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}