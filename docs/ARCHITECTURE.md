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
| Testes | **Vitest + Playwright** | Unitários + E2E |

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

## Princípios Arquiteturais

### 1. Clean Architecture (Camadas)
```
Presentation (UI) → Application (Use Cases) → Domain (Entities) → Infrastructure (DB, Services)
```

### 2. DDD Tático
- **Entities**: Cliente, Produto, Venda, Empresa, Usuário
- **Value Objects**: CNPJ, Email, Money, Address
- **Aggregates**: Venda (root) + ItensVenda
- **Domain Events**: VendaRealizada, EstoqueBaixo
- **Repositories**: Interfaces na camada de domínio
- **Domain Services**: Regras de negócio complexas

### 3. Modular Architecture
Cada módulo de negócio é independente:
```
modules/
├── core/           # Empresa, Usuário, Permissões
├── cadastros/      # Clientes, Fornecedores, Produtos
├── financeiro/     # Contas, Movimentações, Fluxo
├── estoque/        # Inventário, Movimentações
├── vendas/         # PDV, Orçamentos, Pedidos
├── compras/        # Ordens de Compra, Cotações
├── business-types/ # Segmentos: restaurante, clínica, loja...
└── reports/        # Relatórios dinâmicos
```

### 4. Multiempresa (Row-Level Security)
- PostgreSQL RLS aplicado por `tenant_id`
- Cada query automaticamente filtrada
- Middleware NestJS injeta `tenantId` no request context
- Prisma Client extension para filtro automático

### 5. Multi-negócio (Business Types)
- Sistema de plugins por segmento
- Cada segmento define: módulos, menus, dashboards, fluxos
- Carregamento dinâmico de componentes
- Registry pattern para extensibilidade

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

## Instalador Inteligente

### Servidor
1. Detecta/Cria PostgreSQL
2. Cria banco + schema
3. Executa migrations
4. Cria admin user
5. Configura firewall (Windows)
6. Inicia NestJS server
7. Exibe: IP, Usuário, Status

### Estação
1. Solicita IP do servidor
2. Valida conexão API
3. Baixa configurações
4. Conecta automaticamente

## Database Schema (Core)

### Tenant (Empresa)
- id, nome, cnpj, business_type, config (JSONB), created_at

### User
- id, tenant_id, nome, email, senha_hash, avatar, role, preferences (JSONB)

### Role & Permissions
- RBAC com permissões granulares por módulo/ação/tenant

### Module Registry
- Registro dinâmico de módulos por business type

## API Design

### REST + WebSocket
- REST para CRUD
- WebSocket para notificações real-time
- Paginação cursor-based
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
- Rate limiting
- CORS configurado
- Helmet headers
- Input validation (Zod)
- SQL injection prevention (Prisma)
- Audit log em tabelas críticas

## Performance

- Virtual scrolling para listas grandes
- Paginação server-side
- React Query cache + stale-while-revalidate
- Code splitting por módulo
- Lazy loading de módulos de negócio
- Índices PostgreSQL otimizados
- Connection pooling

## Atualizações

- Tauri updater para desktop
- Migrations Prisma versionadas
- Rollback automático em falha
- Backup pré-update

## Roadmap de Implementação

### Fase 1 - Fundação (MVP Core)
- [ ] Monorepo setup
- [ ] Database schema core
- [ ] NestJS server base
- [ ] Auth + Multiempresa
- [ ] Design system base
- [ ] Frontend shell (sidebar, header, routing)
- [ ] Tauri desktop wrapper
- [ ] CRUD: Empresas, Usuários, Perfis

### Fase 2 - Core Business
- [ ] Cadastros (Clientes, Fornecedores, Produtos)
- [ ] Financeiro básico
- [ ] Estoque básico
- [ ] Dashboard genérico
- [ ] Sistema de permissões

### Fase 3 - Business Types
- [ ] Sistema de plugins
- [ ] Loja (segmento inicial)
- [ ] Assistente + Tour guiado
- [ ] Instalador inteligente

### Fase 4 - Expansão
- [ ] Mais segmentos
- [ ] Relatórios avançados
- [ ] Backup & Recovery
- [ ] Atualizações automáticas

### Fase 5 - Premium
- [ ] IA integration
- [ ] Analytics
- [ ] White-label
- [ ] Marketplace de módulos