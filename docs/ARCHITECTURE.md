# 🏗️ Arquitetura do ERP - Documento de Visão

## Visão Geral

ERP comercial para pequenas e médias empresas, sem funcionalidades fiscais, com foco em gestão empresarial, auto-instalação, auto-configuração e aprendizado integrado.

## Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Desktop Shell | **Tauri 2.x** | Menor consumo que Electron, binário ~5MB, Rust para performance |
| Frontend | **React 19 + TypeScript** | Ecossistema maduro, componentização |
| Build Frontend | **Vite** | Performance, HMR instantâneo |
| Backend | **NestJS** | Arquitetura modular, decorators, DDD-friendly |
| ORM | **Prisma** | Type-safe, migrations automáticas |
| Database | **PostgreSQL 16** | Row-Level Security para multiempresa |
| State (Frontend) | **Zustand** | Leve, sem boilerplate |
| Server State | **React Query (TanStack)** | Cache, sincronização |
| Estilo | **Tailwind CSS** | Utility-first, design system |
| Animação | **Framer Motion** | Micro-animações, gestos |
| Ícones | **Lucide React** | Consistentes, customizáveis |
| Forms | **React Hook Form + Zod** | Validação, performance |
| Gráficos | **Recharts** | Charts responsivos e interativos |
| PDF | **jsPDF + autotable** | Relatórios PDF profissionais |
| Testes | **Vitest + Playwright** | Unitários + E2E |
| Internacionalização | **Zustand (custom)** | 3 idiomas, 200+ chaves |
| Máscaras | **Custom lib** | CPF, CNPJ, telefone, CEP, moeda |

## Estado Atual da Implementação

✅ **Módulos Completos:** Dashboard, Clientes, Fornecedores, Produtos, Vendas (PDV), Compras, Financeiro, Estoque, Relatórios, Usuários, Configurações, Auditoria

✅ **Funcionalidades Empresariais:** RBAC (4 níveis), Logs de Auditoria, PDV com carrinho multi-itens, Múltiplos pagamentos, Internacionalização (pt-BR/en/es), Base de Conhecimento (16 artigos), Exportação CSV e PDF

✅ **UX Profissional:** Glassmorphism, Skeleton loaders, ConfirmModal animado, Paginação, Máscaras de input, Busca avançada com filtros persistentes

## Estrutura Monorepo

```
ferramenta-erp/
├── apps/
│   ├── desktop/          # Tauri desktop app (shell)
│   ├── frontend/         # React SPA (shared desktop/web)
│   └── backend/          # NestJS API server
├── packages/
│   ├── shared/           # Tipos, DTOs, constantes, utils
│   ├── database/         # Prisma schema, migrations, seeds
│   ├── ui/               # Design system components
│   ├── installer/        # Lógica do instalador inteligente
│   └── assistant/        # Base de conhecimento + assistente
├── docs/                 # Documentação
├── scripts/              # Scripts de build, deploy
└── turbo.json            # Turborepo config
```

## Módulos Implementados

### Backend (NestJS)
```
modules/
├── auth/           # Autenticação (JWT + Refresh tokens)
├── tenant/         # Multi-empresa (Row-Level Security)
├── user/           # Usuários e perfis
├── person/         # Clientes e Fornecedores (com auditoria)
├── product/        # Produtos e catálogo (com auditoria)
├── sale/           # Vendas, PDV e ordens (com auditoria)
├── stock/          # Movimentações de estoque
├── financial/      # Contas a pagar/receber, fluxo de caixa
├── dashboard/      # Métricas e estatísticas em tempo real
├── backup/         # Backup e restore do banco
├── audit/          # Logs de auditoria (tabela auto-gerada)
├── assistant/      # Base de conhecimento
└── events/         # Eventos e notificações (WebSocket)
```

### Frontend (React)
```
pages/
├── auth/LoginPage.tsx         # Login com i18n e validação
├── DashboardPage.tsx          # Dashboard com dados reais + skeleton
├── ClientesPage.tsx           # CRM com ConfirmModal
├── FornecedoresPage.tsx       # Gestão de fornecedores
├── ProdutosPage.tsx           # Catálogo + alertas de estoque
├── VendasPage.tsx             # PDV funcional multi-itens
├── ComprasPage.tsx            # Ordens de compra
├── FinanceiroPage.tsx         # Fluxo de caixa + gráficos
├── EstoquePage.tsx            # Movimentações
├── RelatoriosPage.tsx         # Relatórios com exportação
├── UsuariosPage.tsx           # Gestão de usuários
├── ConfiguracoesPage.tsx      # Temas, idioma, empresa, backup
└── AuditoriaPage.tsx          # Logs de auditoria com paginação

components/
├── ui/
│   ├── Modal.tsx              # Modal genérico
│   ├── ConfirmModal.tsx       # Modal de confirmação animado
│   ├── DataTable.tsx          # Tabela de dados
│   ├── Pagination.tsx         # Paginação reutilizável
│   └── ValidatedField.tsx     # Campo com validação visual
├── navigation/
│   ├── Sidebar.tsx            # Menu lateral com i18n
│   └── Header.tsx             # Header com notificações
├── assistant/
│   └── CommandPalette.tsx     # Ctrl+K: busca + base de conhecimento
└── onboarding/
    └── FirstAccessWizard.tsx  # Wizard de primeiro acesso

stores/
├── auth.store.ts              # Autenticação
├── ui.store.ts                # Tema e UI state
├── i18n.store.ts              # Internacionalização (200+ chaves)
├── notification.store.ts      # Notificações
└── permissions.store.ts       # Hook usePermissions para RBAC

hooks/
└── useAdvancedSearch.ts       # Busca avançada com filtros persistentes

lib/
├── masks.ts                   # Máscaras: CPF, CNPJ, telefone, CEP, moeda
├── pdf.ts                     # Geração de PDF (jsPDF + autotable)
├── api.ts                     # Cliente HTTP
└── services.ts                # Serviços CRUD genéricos
```

## Sistema de Permissões (RBAC)

| Nível | Permissões |
|-------|-----------|
| **Admin** | Acesso total (todos os módulos e ações) |
| **Gerente** | Vendas, Clientes, Produtos, Financeiro, Estoque, Relatórios, Configurações |
| **Operador** | Vendas, Clientes (limitado), Produtos (leitura), Financeiro (leitura) |
| **Leitura** | Apenas visualização de todos os módulos |

Permissões granulares por módulo: `view`, `create`, `edit`, `delete`, `approve`, `cancel`, `manage`

## Sistema de Auditoria

- Tabela `audit_logs` auto-gerada na inicialização
- Registro automático de: CREATE, UPDATE, DELETE
- Resources auditados: `sale`, `person`, `product`
- Endpoint: `GET /api/v1/audit/logs?page=1&limit=20`
- Tela dedicada: `/auditoria` (acesso na Sidebar)
- Informações: ação, recurso, ID, usuário, data/hora, detalhes (JSONB)

## Internacionalização (i18n)

- 3 idiomas: 🇧🇷 Português (Brasil), 🇺🇸 English, 🇪🇸 Español
- 200+ chaves de tradução cobrindo todo o sistema
- Tela de Login, Sidebar, Header, todas as páginas de módulos
- Base de conhecimento traduzida
- Persistência em localStorage

## Base de Conhecimento (Ctrl+K)

- 16 artigos de ajuda em 9 categorias:
  - Primeiros Passos (3): Boas-vindas, Setup inicial, Atalhos
  - Vendas (3): PDV, Status de vendas, Métricas
  - Clientes (1): Gestão CRM
  - Produtos (1): Catálogo e precificação
  - Financeiro (2): Fluxo de caixa, Contas a pagar/receber
  - Estoque (1): Movimentações
  - Relatórios (1): Guia completo
  - Configurações (1): Personalização do sistema
  - Dicas (3): Dashboard, Filtros, Segurança

## Design System

### Princípios Visuais
- **Glassmorphism**: Backdrop blur, transparências
- **Tipografia**: Inter (UI) + JetBrains Mono (dados)
- **Espaçamento**: Sistema 4px base (4, 8, 12, 16, 24, 32, 48, 64)
- **Cores**: Tokens CSS, temas por segmento
- **Sombras**: Multi-camada suave
- **Bordas**: 8px-16px radius
- **Animações**: Spring-based, 200-300ms

### Componentes Base
- Button, Input, Select, Modal, Drawer, Toast
- DataTable (virtualizado)
- Card, Stats, Chart
- Sidebar, Header, Breadcrumb
- Wizard, Tour, Tooltip
- Pagination, ConfirmModal, ValidatedField

## API Design

### REST + WebSocket
- REST para CRUD
- WebSocket para notificações real-time
- Paginação baseada em página + limite
- Filtros como query params
- Versionamento: /api/v1/

### Padrão de Resposta
```typescript
{
  data: T,
  meta: { page, limit, total },
  errors: [],
  timestamp: ISO
}
```

## Segurança

- Argon2 para senhas
- JWT + Refresh tokens
- Rate limiting (120 req/min)
- CORS configurado
- Helmet headers
- Input validation (Zod)
- SQL injection prevention (Prisma)
- Audit log em todas as operações críticas
- RBAC com 4 níveis de acesso
- Row-Level Security para multiempresa

## Roadmap de Implementação

### ✅ Fase 1 - Fundação (MVP Core) - CONCLUÍDO
- [x] Monorepo setup
- [x] Database schema core
- [x] NestJS server base
- [x] Auth + Multiempresa
- [x] Design system base
- [x] Frontend shell (sidebar, header, routing)
- [x] Tauri desktop wrapper
- [x] CRUD: Empresas, Usuários, Perfis

### ✅ Fase 2 - Core Business - CONCLUÍDO
- [x] Cadastros (Clientes, Fornecedores, Produtos)
- [x] Financeiro básico
- [x] Estoque básico
- [x] Dashboard com dados reais
- [x] Sistema de permissões
- [x] PDV funcional multi-itens

### ✅ Fase 3 - Enterprise - CONCLUÍDO
- [x] Logs de auditoria
- [x] Base de conhecimento
- [x] Internacionalização (3 idiomas)
- [x] ConfirmModal customizado
- [x] Paginação
- [x] Relatórios com exportação CSV e PDF
- [x] Máscaras de input
- [x] Busca avançada

### 🔄 Fase 4 - Premium (Em Progresso)
- [ ] WebSocket notificações real-time
- [ ] Mobile-first responsivo
- [ ] Upload de imagens (produtos + logo)
- [ ] App mobile PWA
- [ ] Instalador inteligente (Tauri)
- [ ] Tour guiado interativo
- [ ] Orçamentos → Vendas
- [ ] Metas e comissões

### 📋 Fase 5 - Enterprise+
- [ ] Módulo de Serviços (OS)
- [ ] Multi-filiais
- [ ] White-label
- [ ] API Pública (Swagger)
- [ ] Marketplace de módulos