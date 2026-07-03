import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, BookOpen, Play, X, Sparkles, LayoutDashboard, Users, Package, ShoppingCart, DollarSign, Truck, ShoppingBag, Box, BarChart3, Settings, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface KnowledgeItem {
  id: string;
  intent: string;
  keywords: string[];
  answer: string;
  tourId?: string;
  moduleId?: string;
  action?: string;
  priority: number;
}

const quickActions = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Clientes', icon: Users, path: '/clientes' },
  { label: 'Fornecedores', icon: Truck, path: '/fornecedores' },
  { label: 'Produtos', icon: Package, path: '/produtos' },
  { label: 'Vendas', icon: ShoppingCart, path: '/vendas' },
  { label: 'Compras', icon: ShoppingBag, path: '/compras' },
  { label: 'Financeiro', icon: DollarSign, path: '/financeiro' },
  { label: 'Estoque', icon: Box, path: '/estoque' },
  { label: 'Relatórios', icon: BarChart3, path: '/relatorios' },
  { label: 'Usuários', icon: ShieldCheck, path: '/usuarios' },
  { label: 'Configurações', icon: Settings, path: '/configuracoes' },
];

const listeners = new Set<() => void>();
export function openCommandPalette() { listeners.forEach(fn => fn()); }

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => { setOpen(true); setQuery(''); setSelectedItem(null); };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => { if(!o) { setQuery(''); setSelectedItem(null); } return !o; });
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      api.get('/knowledge/search', { params: { q: '' } })
        .then(r => setKnowledge(Array.isArray(r.data) ? r.data : (r.data?.data || r.data || [])))
        .catch(() => setKnowledge([]));
    }
  }, [open]);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) return;
    try {
      const r = await api.get('/knowledge/search', { params: { q } });
      setKnowledge(Array.isArray(r.data) ? r.data : (r.data?.data || r.data || []));
    } catch { }
  };

  const handleAction = (item: KnowledgeItem | typeof quickActions[0]) => {
    if ('path' in item) { setOpen(false); navigate(item.path); return; }
    setSelectedItem(item);
  };

  const handleBack = () => { setSelectedItem(null); inputRef.current?.focus(); };

  const filteredActions = useMemo(() => {
    if (!query) return quickActions;
    return quickActions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const filteredKnowledge = useMemo(() => {
    if (!query) return knowledge.filter((k: any) => (k.priority || 0) > 0).slice(0, 3);
    return knowledge.filter((k: any) =>
      (k.intent || '').toLowerCase().includes(query.toLowerCase()) ||
      (k.keywords || []).some((kw: string) => kw.toLowerCase().includes(query.toLowerCase())) ||
      (k.answer || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [query, knowledge]);

  const moduleMap: Record<string, string> = {
    dashboard: '/dashboard', clientes: '/clientes', produtos: '/produtos',
    vendas: '/vendas', financeiro: '/financeiro', estoque: '/estoque',
    fornecedores: '/fornecedores', compras: '/compras', relatorios: '/relatorios',
    configuracoes: '/configuracoes', usuarios: '/usuarios',
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-full max-w-lg">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input ref={inputRef} value={query} onChange={e => handleSearch(e.target.value)}
                    placeholder="Pesquisar comandos, páginas, ajuda..."
                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none" />
                  <kbd className="text-[10px] px-2 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.05] text-gray-400 font-mono">ESC</kbd>
                </div>

                <div className="max-h-[500px] overflow-y-auto p-2">
                  {/* Knowledge Base */}
                  {!selectedItem && filteredKnowledge.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        <BookOpen size={12} /> Base de Conhecimento
                      </div>
                      {filteredKnowledge.map((item: any) => (
                        <button key={item.id} onClick={() => handleAction(item)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-left transition-colors group">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                            <Sparkles size={15} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{(item.intent || '').replace(/_/g, ' ')}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{(item.answer || '').slice(0, 80)}…</p>
                          </div>
                          <ArrowRight size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Actions */}
                  {!selectedItem && (
                    <div>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        <Command size={12} /> Navegação Rápida
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {filteredActions.map(action => (
                          <button key={action.label} onClick={() => handleAction(action)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-left transition-colors">
                            <action.icon size={16} className="text-gray-500 shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {query.length > 1 && filteredKnowledge.length === 0 && !selectedItem && (
                    <div className="text-center py-8 text-gray-400">
                      <Search size={28} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhum resultado para "{query}"</p>
                      <p className="text-xs mt-1">Tente outro termo ou navegue pelos módulos abaixo</p>
                    </div>
                  )}

                  {/* Answer Detail */}
                  {selectedItem && (
                    <div className="p-3">
                      <button onClick={handleBack}
                        className="flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 mb-3 font-medium transition-colors">
                        ← Voltar para resultados
                      </button>
                      <div className="glass-card p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <Sparkles size={18} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                              {selectedItem.intent?.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-[11px] text-gray-400">Base de Conhecimento</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {selectedItem.answer}
                        </p>
                        {selectedItem.keywords && selectedItem.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {selectedItem.keywords.map(kw => (
                              <span key={kw} className="text-[10px] px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.03] text-gray-500">{kw}</span>
                            ))}
                          </div>
                        )}
                        {(selectedItem.moduleId || selectedItem.action) && (
                          <button
                            onClick={() => {
                              const item = selectedItem;
                              setOpen(false);
                              const target = item.action || moduleMap[item.moduleId || ''] || '/dashboard';
                              navigate(target);
                            }}
                            className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20">
                            <Play size={14} />
                            {selectedItem.action ? 'Abrir tela' : 'Ir para o módulo'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-white/10 flex items-center gap-4 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.05]">↑↓</kbd> Navegar</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.05]">↵</kbd> Selecionar</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.05]">ESC</kbd> Fechar</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}