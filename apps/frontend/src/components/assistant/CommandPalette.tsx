import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Command, ArrowRight, BookOpen, Play, X, Sparkles,
  LayoutDashboard, Users, Package, ShoppingCart, DollarSign, Truck,
  ShoppingBag, Box, BarChart3, Settings, ShieldCheck, HelpCircle,
  Lightbulb, Target, ListChecks, GraduationCap, AlertTriangle, Zap, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18nStore } from '@/stores/i18n.store';

type KnowledgeCategory = 'getting-started' | 'sales' | 'clients' | 'products' | 'financial' | 'stock' | 'reports' | 'settings' | 'tips';

interface KnowledgeItem {
  id: string;
  title: string;
  category: KnowledgeCategory;
  keywords: string[];
  content: string;
  action?: string;
  module?: string;
  icon?: string;
}

const quickActions = [
  { labelKey: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { labelKey: 'clients', icon: Users, path: '/clientes' },
  { labelKey: 'suppliers', icon: Truck, path: '/fornecedores' },
  { labelKey: 'products', icon: Package, path: '/produtos' },
  { labelKey: 'sales', icon: ShoppingCart, path: '/vendas' },
  { labelKey: 'purchases', icon: ShoppingBag, path: '/compras' },
  { labelKey: 'financial', icon: DollarSign, path: '/financeiro' },
  { labelKey: 'stock', icon: Box, path: '/estoque' },
  { labelKey: 'reports', icon: BarChart3, path: '/relatorios' },
  { labelKey: 'users', icon: ShieldCheck, path: '/usuarios' },
  { labelKey: 'settings2', icon: Settings, path: '/configuracoes' },
];

const categoryIcons: Record<string, any> = {
  'getting-started': Home,
  sales: ShoppingCart,
  clients: Users,
  products: Package,
  financial: DollarSign,
  stock: Box,
  reports: BarChart3,
  settings: Settings,
  tips: Lightbulb,
};

const categoryLabels: Record<string, string> = {
  'getting-started': 'Primeiros Passos',
  sales: 'Vendas',
  clients: 'Clientes',
  products: 'Produtos',
  financial: 'Financeiro',
  stock: 'Estoque',
  reports: 'Relatórios',
  settings: 'Configurações',
  tips: 'Dicas Rápidas',
};

function buildKnowledgeBase(t: (key: string) => string): KnowledgeItem[] {
  return [
    // ─── PRIMEIROS PASSOS ───
    {
      id: 'welcome',
      title: 'Bem-vindo ao Ferramenta ERP',
      category: 'getting-started',
      keywords: ['início', 'primeiro acesso', 'tour', 'conhecer'],
      content: `O Ferramenta ERP é um sistema completo de gestão empresarial.

🔹 **Visão Geral dos Módulos:**
• **Dashboard** - Visão geral do seu negócio com métricas em tempo real
• **Clientes** - Cadastro e gestão de clientes (CRM)
• **Fornecedores** - Gestão de fornecedores e parceiros
• **Produtos** - Catálogo de produtos com controle de estoque
• **Vendas** - PDV e gestão de pedidos de venda
• **Compras** - Ordens de compra e recebimento
• **Financeiro** - Contas a pagar/receber e fluxo de caixa
• **Estoque** - Movimentações e inventário
• **Relatórios** - Relatórios gerenciais exportáveis
• **Usuários** - Gestão de usuários e permissões
• **Configurações** - Preferências do sistema, tema, idioma, backup

🔹 **Atalhos de teclado:**
• **Ctrl+K** - Abrir esta busca inteligente
• Navegue entre os módulos pelo menu lateral`,
      action: '/dashboard',
      module: 'dashboard',
    },
    {
      id: 'first-steps',
      title: 'Primeiros passos recomendados',
      category: 'getting-started',
      keywords: ['começar', 'configurar', 'inicial', 'setup'],
      content: `Siga estes passos para configurar seu ERP:

**1️⃣ Configure sua empresa** (Ctrl+K → "configurações")
  - Preencha nome, CNPJ, endereço e segmento de negócio

**2️⃣ Cadastre seus produtos** (módulo Produtos)
  - Código, nome, preço de venda e custo, estoque atual e mínimo

**3️⃣ Cadastre seus clientes** (módulo Clientes)
  - Nome, contatos, endereço

**4️⃣ Comece a vender** (módulo Vendas)
  - Use o PDV para registrar vendas rapidamente

**5️⃣ Acompanhe o financeiro**
  - Registre entradas e saídas para controlar o fluxo de caixa

⏱️ Tempo estimado: 15-30 minutos para configuração inicial`,
      module: 'configuracoes',
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Atalhos de teclado e navegação',
      category: 'getting-started',
      keywords: ['atalhos', 'teclado', 'rápido', 'navegar', 'shortcuts'],
      content: `**Atalhos globais:**
• **Ctrl+K** - Abrir busca inteligente (você está aqui!)
• **ESC** - Fechar modais e popups

**Navegação rápida pela busca (Ctrl+K):**
Digite o nome de qualquer módulo para navegar diretamente:
• "vendas" → Abre a tela de Vendas
• "clientes" → Abre a tela de Clientes
• "config" → Abre Configurações

**Dicas de produtividade:**
• Use a busca para tirar dúvidas sobre qualquer funcionalidade
• Os cards do Dashboard são clicáveis e levam aos módulos
• Filtros de período (hoje, semana, mês) estão disponíveis em várias telas`,
    },
    // ─── VENDAS ───
    {
      id: 'how-to-sell',
      title: 'Como fazer uma venda (PDV)',
      category: 'sales',
      keywords: ['vender', 'pdv', 'carrinho', 'pagamento', 'checkout'],
      content: `**Passo a passo para registrar uma venda:**

1️⃣ Clique em **"Nova Venda"** no módulo de Vendas

2️⃣ **Busque produtos** pelo nome ou código na barra de pesquisa

3️⃣ **Adicione ao carrinho** - Clique no produto para adicionar
  - Ajuste a quantidade com os botões **+** e **-**
  - Remova itens com o ícone de lixeira

4️⃣ **Selecione o cliente** (opcional) - Busque pelo nome

5️⃣ **Escolha a forma de pagamento:**
  - 💵 Dinheiro
  - 📱 PIX
  - 💳 Cartão

6️⃣ **Aplique desconto** se necessário (valor em centavos)

7️⃣ Clique em **"Finalizar Venda"**

✅ A venda será registrada como aprovada e o estoque será atualizado automaticamente!`,
      action: '/vendas',
      module: 'vendas',
    },
    {
      id: 'sale-status',
      title: 'Status de vendas e aprovação',
      category: 'sales',
      keywords: ['status', 'aprovar', 'cancelar', 'pendente', 'venda'],
      content: `As vendas podem ter 3 status:

🟡 **Pendente** - Aguardando aprovação
  • Clique em "Aprovar" para confirmar a venda
  • A venda pendente NÃO baixa o estoque

🟢 **Aprovado** - Venda confirmada
  • O estoque é baixado automaticamente
  • A venda entra no faturamento

🔴 **Cancelado** - Venda cancelada
  • O estoque é restaurado
  • A venda não conta no faturamento

**Ações em lote:** Selecione várias vendas e clique em "Aprovar" para processar todas de uma vez.

**Filtros rápidos:** Use os botões de status (Pendentes, Aprovados, Cancelados) para filtrar a lista.`,
      module: 'vendas',
    },
    {
      id: 'sale-reports',
      title: 'Analisando suas vendas',
      category: 'sales',
      keywords: ['gráfico', 'análise', 'métricas', 'receita', 'ticket'],
      content: `Na tela de Vendas você encontra:

📊 **Gráfico de receita** (7 dias)
  • Visualize o faturamento diário da semana

🥧 **Gráfico de status** (pizza)
  • Distribuição entre pendentes, aprovados e cancelados

📈 **Cards de métricas:**
  • Receita total do período filtrado
  • Ticket médio por venda
  • Vendas de hoje
  • Contagem de pendentes e aprovados

📋 **Relatórios completos:** Vá em Relatórios → "Vendas por Período" para análises detalhadas com exportação CSV.`,
      module: 'vendas',
    },
    // ─── CLIENTES ───
    {
      id: 'client-management',
      title: 'Gestão de clientes (CRM)',
      category: 'clients',
      keywords: ['cliente', 'cadastrar', 'crm', 'contato', 'ficha'],
      content: `**Como gerenciar seus clientes:**

🔹 **Cadastro:**
  • Nome completo ou razão social
  • Tipo: Pessoa Física (CPF) ou Jurídica (CNPJ)
  • Contatos: email e telefone
  • Endereço completo (opcional)
  • Observações internas

🔹 **Ficha do cliente:**
  Clique em qualquer cliente para ver:
  • Histórico de compras (últimas vendas)
  • Total gasto e ticket médio
  • Status (ativo/inativo)

🔹 **Filtros:**
  • Status: Ativos / Inativos
  • Tipo: Pessoa Física / Jurídica
  • Busca por nome ou documento

🔹 **Ações:**
  • ✏️ Editar informações
  • 🗑️ Remover cliente
  • Selecionar múltiplos para remoção em massa`,
      module: 'clientes',
    },
    // ─── PRODUTOS ───
    {
      id: 'product-catalog',
      title: 'Catálogo de produtos e precificação',
      category: 'products',
      keywords: ['produto', 'cadastrar', 'preço', 'custo', 'margem', 'código'],
      content: `**Como cadastrar um produto:**

1️⃣ Preencha o **código** (SKU) e **nome** do produto

2️⃣ Selecione a **unidade** (UN, KG, L, M, CX)

3️⃣ Defina os preços:
  • **Preço de custo** (quanto você pagou)
  • **Preço de venda** (quanto o cliente paga)
  • A margem é calculada automaticamente

4️⃣ Configure o estoque:
  • **Estoque atual** - Quantidade disponível
  • **Estoque mínimo** - Alerta quando atingir este valor

🔹 **Alertas:**
  Produtos com estoque abaixo do mínimo aparecem com destaque vermelho e badge "ESTOQUE BAIXO"

🔹 **Filtros:**
  • Todos / Estoque Baixo / OK
  • Ordenar por nome, maior preço ou menor estoque`,
      module: 'produtos',
    },
    // ─── FINANCEIRO ───
    {
      id: 'cash-flow',
      title: 'Fluxo de caixa e finanças',
      category: 'financial',
      keywords: ['dinheiro', 'receita', 'despesa', 'saldo', 'caixa', 'contas'],
      content: `**Controle financeiro do seu negócio:**

📈 **Receitas** (entradas de dinheiro)
  • Registre vendas, prestações de serviço, etc.

📉 **Despesas** (saídas de dinheiro)
  • Registre contas, aluguel, fornecedores, etc.

🔹 **Status das transações:**
  • **Pendente** - Ainda não pago/recebido
  • **Pago** - Já foi liquidado
  • **Atrasado** - Vencido e não pago

🔹 **Gráficos:**
  • Fluxo de caixa dos últimos 30 dias
  • Análise por categoria (gráfico de pizza)
  • Comparativo mensal (últimos 6 meses)

🔹 **Dica:** Categorize suas transações (aluguel, vendas, serviços) para relatórios mais detalhados.`,
      module: 'financeiro',
    },
    {
      id: 'accounts-management',
      title: 'Contas a pagar e receber',
      category: 'financial',
      keywords: ['pagar', 'receber', 'vencimento', 'contas', 'boleto'],
      content: `**Gerencie suas obrigações financeiras:**

📋 **Para registrar uma conta:**
1. Clique em "Nova Transação"
2. Preencha a descrição (ex: "Aluguel de Março")
3. Informe o valor em centavos (R$ 1000,00 = 100000)
4. Selecione o tipo: Receita 📈 ou Despesa 📉
5. Defina a data de vencimento
6. Opcional: adicione uma categoria (aluguel, vendas, etc.)

🔔 **Alertas de vencimento:**
  Ative as notificações em Configurações para ser avisado sobre contas próximas do vencimento.

✅ **Baixa de pagamento:**
  Clique em "Marcar como Pago" para registrar o pagamento/recebimento da transação.`,
      module: 'financeiro',
    },
    // ─── ESTOQUE ───
    {
      id: 'stock-basics',
      title: 'Controle de estoque e movimentações',
      category: 'stock',
      keywords: ['estoque', 'movimentação', 'entrada', 'saída', 'inventário'],
      content: `**Como funciona o controle de estoque:**

📥 **Entradas** (aumentam o estoque)
  • Compra de produtos
  • Devoluções de clientes
  • Ajustes de inventário

📤 **Saídas** (diminuem o estoque)
  • Vendas aprovadas (automático)
  • Perdas ou avarias
  • Transferências

🔹 **Registrando uma movimentação manual:**
1. Clique em "Nova Movimentação"
2. Selecione o tipo: Entrada ou Saída
3. Informe a quantidade e preço unitário
4. Descreva o motivo (ex: "Compra fornecedor X")

⚠️ **Importante:** As vendas aprovadas baixam o estoque automaticamente. Use movimentações manuais apenas para ajustes.

📊 **Métricas:** Acompanhe o total de entradas e saídas nos cards do topo da tela.`,
      module: 'estoque',
    },
    // ─── RELATÓRIOS ───
    {
      id: 'reports-guide',
      title: 'Relatórios disponíveis e exportação',
      category: 'reports',
      keywords: ['relatório', 'exportar', 'csv', 'imprimir', 'análise'],
      content: `**Relatórios disponíveis no sistema:**

📊 **Vendas por Período**
  • Pedidos, faturamento e status
  • Gráfico de faturamento diário (30 dias)

💰 **Fluxo Financeiro**
  • Receitas, despesas e saldo
  • Gráfico de evolução financeira

👥 **Clientes Ativos**
  • Base de clientes com status
  • Total, ativos, PF e PJ

📦 **Catálogo de Produtos**
  • Preços, estoque e margens
  • Valor total em estoque

⚠️ **Estoque Crítico**
  • Produtos abaixo do mínimo
  • Custo estimado de reposição

🔹 **Exportação:** Clique em "Exportar CSV" para baixar os dados
🔹 **Impressão:** Use o botão "Imprimir" para relatório físico
🔹 **Períodos:** Filtre por 7, 30 dias, mês atual ou todo período`,
      module: 'relatorios',
    },
    // ─── CONFIGURAÇÕES ───
    {
      id: 'settings-guide',
      title: 'Personalizando o sistema',
      category: 'settings',
      keywords: ['configurar', 'tema', 'idioma', 'backup', 'senha', 'empresa'],
      content: `**Personalize o ERP para sua empresa:**

🎨 **Aparência:**
  • Tema Claro, Escuro ou Sistema (automático)
  • A mudança é aplicada instantaneamente

🌐 **Idioma:**
  • Português (Brasil), English, Español
  • Selecione na tela de Configurações → Geral

🏢 **Empresa:**
  • Preencha os dados da sua empresa
  • Segmento de negócio (loja, clínica, restaurante...)
  • Upload do logo para relatórios

🔐 **Segurança:**
  • Altere sua senha periodicamente
  • Use senhas fortes com letras, números e símbolos

💾 **Backup:**
  • Crie backups manuais para proteger seus dados
  • Configure backup automático (diário/semanal/mensal)
  • Baixe backups anteriores quando necessário`,
      module: 'configuracoes',
    },
    // ─── DICAS ───
    {
      id: 'tip-dashboard',
      title: '💡 Dica: Use o Dashboard como central',
      category: 'tips',
      keywords: ['dica', 'dashboard', 'atalho', 'produtividade'],
      content: `O Dashboard é sua central de comando:

📊 **Cards clicáveis:** Clique em qualquer card de métrica para ir direto ao módulo correspondente
⚡ **Ações rápidas:** Use os botões de ação rápida no Dashboard para criar vendas, clientes e produtos sem navegar pelos menus
🔍 **Busca inteligente:** Ctrl+K a qualquer momento para buscar, navegar ou tirar dúvidas

**Dica extra:** Mantenha o Dashboard como página inicial para ter uma visão geral do negócio logo ao fazer login.`,
      module: 'dashboard',
    },
    {
      id: 'tip-filters',
      title: '💡 Dica: Domine os filtros',
      category: 'tips',
      keywords: ['filtro', 'buscar', 'pesquisar', 'organizar'],
      content: `Os filtros são sua melhor ferramenta de produtividade:

🔍 **Busca por texto:** Digite na barra de pesquisa para encontrar qualquer registro rapidamente
📅 **Filtros de período:** Hoje, 7 dias, Este mês - disponíveis em Vendas e Financeiro
📌 **Filtros de status:** Pendentes, Aprovados, Cancelados - clique para filtrar instantaneamente
🔄 **Atualizar:** Use o ícone de engrenagem para recarregar os dados

**Dica extra:** Combine filtros! Por exemplo: "Vendas pendentes de hoje" = Filtro Pendentes + Período Hoje`,
    },
    {
      id: 'tip-data',
      title: '💡 Dica: Seus dados estão seguros',
      category: 'tips',
      keywords: ['backup', 'segurança', 'dados', 'proteger', 'senha'],
      content: `🔒 **Segurança dos seus dados:**

💾 **Backup regular:** Configure backup automático em Configurações → Backup
📤 **Exportação:** Todos os relatórios podem ser exportados em CSV
🔐 **Senhas:** Use o sistema de perfis para controlar o que cada usuário pode acessar
📝 **Auditoria:** Todas as ações importantes são registradas para consulta futura

**Recomendação:** Faça backup semanal e guarde em local seguro (HD externo, nuvem).`,
    },
  ];
}

const listeners = new Set<() => void>();
export function openCommandPalette() { listeners.forEach(fn => fn()); }

export function CommandPalette() {
  const { t } = useI18nStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const knowledgeBase = useMemo(() => buildKnowledgeBase(t), [t]);

  useEffect(() => {
    const handler = () => { setOpen(true); setQuery(''); setSelectedItem(null); setActiveCategory(null); };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => { if(!o) { setQuery(''); setSelectedItem(null); setActiveCategory(null); } return !o; });
      }
      if (e.key === 'Escape') {
        if (selectedItem) { setSelectedItem(null); return; }
        if (activeCategory) { setActiveCategory(null); return; }
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedItem, activeCategory]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleBack = () => {
    if (selectedItem) { setSelectedItem(null); return; }
    if (activeCategory) { setActiveCategory(null); return; }
    setQuery('');
    inputRef.current?.focus();
  };

  const filteredActions = useMemo(() => {
    if (!query) return quickActions;
    return quickActions.filter(a => {
      const label = t(a.labelKey);
      return label.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, t]);

  const filteredKnowledge = useMemo(() => {
    let items = knowledgeBase;
    if (activeCategory) items = items.filter(k => k.category === activeCategory);
    if (!query && !activeCategory) return items; // Show all when no query and no category filter
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(k =>
      k.title.toLowerCase().includes(q) ||
      k.keywords.some(kw => kw.toLowerCase().includes(q)) ||
      k.content.toLowerCase().includes(q)
    );
  }, [query, knowledgeBase, activeCategory]);

  const categories = useMemo(() => {
    const cats = new Set(knowledgeBase.map(k => k.category));
    return Array.from(cats);
  }, [knowledgeBase]);

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
          <div className="absolute inset-0 flex items-start justify-center p-4 pt-[10vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-2xl">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setSelectedItem(null); setActiveCategory(null); }}
                    placeholder="O que você precisa? Ex: Como fazer uma venda..."
                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none" />
                  <kbd className="text-[10px] px-2 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.05] text-gray-400 font-mono">ESC</kbd>
                </div>

                <div className="max-h-[65vh] overflow-y-auto">
                  {/* Selected Item Detail */}
                  {selectedItem ? (
                    <div className="p-4">
                      <button onClick={handleBack}
                        className="flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 mb-4 font-medium transition-colors">
                        ← Voltar
                      </button>
                      <div className="glass-card p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <Sparkles size={18} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{selectedItem.title}</h3>
                            <p className="text-[11px] text-gray-400">{categoryLabels[selectedItem.category] || selectedItem.category}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {selectedItem.content}
                        </div>
                        {selectedItem.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedItem.keywords.map(kw => (
                              <span key={kw} className="text-[10px] px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.03] text-gray-500">{kw}</span>
                            ))}
                          </div>
                        )}
                        {(selectedItem.module || selectedItem.action) && (
                          <button
                            onClick={() => {
                              const target = selectedItem.action || moduleMap[selectedItem.module || ''] || '/dashboard';
                              setOpen(false);
                              navigate(target);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20">
                            <Play size={14} /> Ir para o módulo
                          </button>
                        )}
                      </div>
                    </div>
                  ) : activeCategory ? (
                    /* Category view */
                    <div>
                      <button onClick={handleBack}
                        className="flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 px-4 pt-3 font-medium transition-colors">
                        ← Voltar para categorias
                      </button>
                      <div className="p-2">
                        <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          <BookOpen size={12} /> {categoryLabels[activeCategory] || activeCategory}
                        </div>
                        {filteredKnowledge.map(item => (
                          <button key={item.id} onClick={() => setSelectedItem(item)}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-left transition-colors group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                              <Sparkles size={15} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.content.slice(0, 120).replace(/\*/g, '').replace(/\n/g, ' ')}…</p>
                            </div>
                            <ArrowRight size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Home view */
                    <div>
                      {/* Categories */}
                      {!query && (
                        <div className="px-4 pt-4 pb-2">
                          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-500">
                            <Target size={14} /> Explorar por categoria
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {categories.map(cat => {
                              const Icon = categoryIcons[cat] || HelpCircle;
                              return (
                                <button key={cat} onClick={() => setActiveCategory(cat)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                  <Icon size={14} />
                                  {categoryLabels[cat] || cat}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Knowledge Results */}
                      {filteredKnowledge.length > 0 && (
                        <div className="p-2">
                          <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            <BookOpen size={12} /> {query ? 'Resultados da busca' : 'Guia do Sistema'}
                          </div>
                          {filteredKnowledge.slice(0, query ? 8 : 6).map(item => (
                            <button key={item.id} onClick={() => setSelectedItem(item)}
                              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-left transition-colors group">
                              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.category === 'tips' ? 'from-green-400 to-emerald-500' : 'from-amber-400 to-orange-500'} flex items-center justify-center shrink-0`}>
                                {item.category === 'tips' ? <Zap size={15} className="text-white" /> : <Sparkles size={15} className="text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.content.slice(0, 100).replace(/\*/g, '').replace(/\n/g, ' ')}…</p>
                              </div>
                              <span className="text-[10px] text-gray-400 bg-black/[0.02] dark:bg-white/[0.02] px-2 py-0.5 rounded-full">{categoryLabels[item.category] || item.category}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Quick Navigation */}
                      {!query && (
                        <div className="p-2">
                          <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            <Command size={12} /> Módulos
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {filteredActions.map(action => (
                              <button key={action.labelKey} onClick={() => { setOpen(false); navigate(action.path); }}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-left transition-colors">
                                <action.icon size={16} className="text-gray-500 shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t(action.labelKey)}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No results */}
                      {query.length > 1 && filteredKnowledge.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                          <Search size={32} className="mx-auto mb-3 opacity-30" />
                          <p className="text-sm font-medium">Nenhum resultado para "{query}"</p>
                          <p className="text-xs mt-1">Tente outro termo ou explore as categorias acima</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-white/10 flex items-center gap-4 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.05]">↑↓</kbd> Navegar</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.05]">↵</kbd> Selecionar</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.05]">ESC</kbd> Voltar</span>
                  <span className="ml-auto text-gray-400">{knowledgeBase.length} artigos</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}