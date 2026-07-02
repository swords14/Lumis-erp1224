# 🏗️ Ferramenta ERP

> **Gestão Empresarial Inteligente** — O ERP que se instala sozinho, configura sozinho e ensina você a usar.

---

## 📋 Visão Geral

Ferramenta ERP é uma plataforma de gestão empresarial moderna para pequenas e médias empresas, construída como um **monorepo** com arquitetura de **micro-serviços em camadas**. O projeto prioriza:

- 🚀 **Performance**: Tauri (Rust) para desktop, React 19, Vite
- 🎨 **UI Premium**: Glassmorphism, micro-animações, design system próprio
- 🏢 **Multiempresa nativo**: Row-Level Security no PostgreSQL
- 🎯 **Multi-negócio**: Adaptação automática para 17+ segmentos
- 📚 **Aprendizado integrado**: Base de conhecimento, tours guiados, sistema adaptativo
- 🔒 **Segurança**: JWT + Refresh tokens, Argon2, rate limiting, audit logs
- 📦 **Instalação inteligente**: 2 cliques (Servidor ou Estação)

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| **Desktop Shell** | [Tauri 2.x](https://tauri.app) | Binário leve (~5MB), Rust, seguro |
| **Frontend** | React 19 + TypeScript + Vite | Componentização, HMR instantâneo |
| **Backend** | [NestJS](https://nestjs.com) 11 | Arquitetura modular, DDD |
| **ORM** | [Prisma](https://prisma.io) 6 | Type-safe, migrations automáticas |
| **Banco** | PostgreSQL 16 | Row-Level Security, JSONB |
| **State** | Zustand + React Query | Leve, cache inteligente |
| **Estilo** | Tailwind CSS 3 | Design system utility-first |
| **Animação** | Framer Motion 12 | Spring physics, gestos |
| **Ícones** | Lucide React | Consistentes, tree-shakeable |
| **Validação** | Zod + React Hook Form | Type-safe, schemas compartilhados |
| **Gráficos** | Recharts | React nativo, customizável |
| **Testes** | Vitest + Playwright | Unitários + E2E |

---

## 📁 Estrutura do Monorepo

```
ferramenta-erp/
├── apps/
│   ├── desktop/              # Tauri desktop app
│   │   └── src-tauri/        # Config Rust + Tauri
│   ├── frontend/             # React 19 SPA
│   │   └── src/
│   │       ├── components/   # Componentes reutilizáveis
│   │       ├── layouts/      # AuthLayout, AppLayout
│   │       ├── pages/        # Páginas (auth, dashboard, módulos)
│   │       ├── stores/       # Zustand stores
│   │       └── lib/          # API client, utils
│   └── backend/              # NestJS API
│       └── src/
│           ├── modules/      # Módulos de domínio
│           │   ├── auth/     # Autenticação JWT
│           │   ├── tenant/   # Multiempresa
│           │   ├── user/     # Usuários
│           │   ├── person/   # Clientes/Fornecedores
│           │   ├── product/  # Produtos/Estoque
│           │   ├── sale/     # Vendas/PDV
│           │   ├── financial/# Contas/Transações
│           │   ├── assistant/# Base de conhecimento
│           │   └── backup/   # Backup/Restore
│           ├── common/       # Middleware, Guards, Filters
│           ├── database/     # Prisma Service
│           ├── events/       # Event Emitter
│           └── websocket/    # Socket.IO Gateway
├── packages/
│   ├── shared/               # Tipos, DTOs, enums, validators, utils
│   │   └── src/
│   │       ├── types/        # models.ts, api.ts, events.ts, business-types.ts
│   │       ├── enums/        # Todos os enums do sistema
│   │       ├── constants/    # Cores, temas, mensagens
│   │       ├── validators/   # Schemas Zod
│   │       └── utils/        # Formatação, CPF/CNPJ, datas
│   └── database/             # Prisma schema + migrations + seeds
│       └── prisma/
│           └── schema.prisma # 20+ modelos
├── docs/
│   └── ARCHITECTURE.md       # Documento de visão completo
├── package.json              # Root workspace config
├── turbo.json                # Turborepo pipeline
└── README.md
```

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** >= 20
- **npm** >= 10
- **PostgreSQL** >= 16
- **Rust** (para Tauri desktop)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/ferramenta/erp.git
cd erp

# 2. Instale todas as dependências
npm install

# 3. Configure o banco de dados
# Copie o .env.example para .env e ajuste DATABASE_URL
cp .env.example .env

# 4. Execute as migrations
npm run db:migrate

# 5. Popule o banco com dados iniciais
npm run db:seed

# 6. Inicie o backend
npm run dev:backend

# 7. Em outro terminal, inicie o frontend
npm run dev:frontend

# 8. (Opcional) Inicie o desktop app
npm run dev:desktop
```

### Acessando

- **Frontend Dev**: http://localhost:5173
- **API**: http://localhost:3000/api/v1
- **Prisma Studio**: `npm run db:studio` → http://localhost:5555
- **WebSocket**: ws://localhost:3000/ws

---

## 🏗️ Arquitetura

### Clean Architecture (4 camadas)

```
┌─────────────────────────────────────┐
│           Presentation              │  ← React + Tailwind + Framer Motion
├─────────────────────────────────────┤
│           Application               │  ← React Query + Zustand + API Client
├─────────────────────────────────────┤
│             Domain                  │  ← @ferramenta/shared (types, enums, DTOs)
├─────────────────────────────────────┤
│         Infrastructure              │  ← NestJS + Prisma + PostgreSQL
└─────────────────────────────────────┘
```

### Multiempresa (Tenant Isolation)

Cada empresa é completamente isolada via **Row-Level Security** no PostgreSQL:

1. **Middleware** extrai `X-Tenant-Id` do header
2. **JWT token** contém `tenantId` no payload
3. **AsyncLocalStorage** propaga o tenant pelo request
4. **Prisma** filtra automaticamente todas as queries

```typescript
// Exemplo: Criar um produto
// O tenantId é injetado automaticamente
const product = await prisma.product.create({
  data: { name: "Produto X", price: 1990 }
  // tenantId é adicionado automaticamente
});
```

### Multi-negócio (Business Types)

O sistema se adapta ao segmento escolhido na instalação:

```typescript
// Exemplo: Configuração para Restaurante
{
  type: "restaurante",
  modules: ["mesas", "comandas", "cozinha", "entrega", ...],
  dashboard: [widgetMesas, widgetPedidos, widgetFaturamento, ...],
  primaryColor: "#dc2626",
  quickActions: ["Nova comanda", "Abrir mesa", "Registrar pedido"]
}
```

### Domain Events

Eventos de domínio usando o padrão Pub/Sub do NestJS:

```typescript
// Dispara quando uma venda é concluída
this.eventEmitter.emit('sale.completed', {
  saleId: '...',
  amount: 1990,
  firstSale: true, // ← Dispara progresso do usuário
});

// Handlers reagem automaticamente:
// - Atualiza estoque
// - Cria transação financeira
// - Verifica milestones do usuário
// - Envia notificação
```

---

## 🎨 Design System

### Princípios Visuais

- **Glassmorphism**: Backdrop blur 20px, transparências
- **Tipografia**: Inter (UI) + JetBrains Mono (dados)
- **Espaçamento**: Sistema 4px base
- **Sombras**: Multi-camada suave
- **Bordas**: 8-16px radius
- **Animações**: Spring-based, 200-300ms

### Tema (Claro/Escuro)

```css
/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
}
```

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia todos os apps em paralelo |
| `npm run dev:frontend` | Apenas frontend (Vite) |
| `npm run dev:backend` | Apenas backend (NestJS) |
| `npm run dev:desktop` | Desktop app (Tauri) |
| `npm run build` | Build de produção (todos) |
| `npm run test` | Testes unitários |
| `npm run test:e2e` | Testes E2E |
| `npm run lint` | Lint em todos os pacotes |
| `npm run db:migrate` | Executa migrations Prisma |
| `npm run db:seed` | Popula banco com dados iniciais |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run format` | Formata código (Prettier) |

---

## 🔐 Segurança

- Senhas hash com **Argon2** (bcryptjs, 12 rounds)
- **JWT** + Refresh tokens com rotação
- **Rate limiting** (120 req/min)
- **Helmet** headers de segurança
- **CORS** configurado
- **Input validation** (Zod + class-validator)
- **SQL injection** prevenida via Prisma (prepared statements)
- **Audit logs** em todas as operações críticas
- Bloqueio após 5 tentativas de login (30 min)

---

## 🧪 Testes

```bash
# Unitários (Vitest)
npm run test

# E2E (Playwright)
npm run test:e2e

# Backend (Jest)
cd apps/backend && npm run test
```

---

## 📚 Roadmap

### ✅ Fase 1 - Fundação (Concluído)
- [x] Monorepo setup (Turborepo + npm workspaces)
- [x] Package shared (tipos, DTOs, enums, validators)
- [x] Prisma schema completo (20+ modelos)
- [x] NestJS backend com Auth + Multiempresa
- [x] Frontend React com UI premium (glassmorphism)
- [x] Tauri desktop wrapper
- [x] WebSocket Gateway com notificações

### 🔄 Fase 2 - Core Business (Em andamento)
- [ ] CRUD completo: Clientes, Produtos, Vendas, Financeiro
- [ ] Dashboard com gráficos (Recharts)
- [ ] Sistema de permissões granular
- [ ] Filtros avançados e exportação

### 📋 Fase 3 - Business Types
- [ ] Sistema de plugins por segmento
- [ ] Loja (segmento inicial completo)
- [ ] Assistente + Tours guiados
- [ ] Instalador inteligente (2 cliques)

### 🚀 Fase 4 - Expansão
- [ ] Mais segmentos (Restaurante, Clínica, Hotel...)
- [ ] Backup & Recovery automático
- [ ] Atualizações OTA (Tauri updater)
- [ ] White-label

### ⭐ Fase 5 - Premium
- [ ] Integração com IA (substitui base de conhecimento)
- [ ] Analytics avançado
- [ ] Marketplace de módulos
- [ ] Mobile (React Native)

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Convenções de commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `refactor:` Refatoração
- `docs:` Documentação
- `style:` Formatação
- `test:` Testes
- `chore:` Tarefas de build/config

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

## 👨‍💻 Time

Projetado e desenvolvido com foco em excelência arquitetural, experiência do usuário e qualidade de código.

---

**Ferramenta ERP** — *Simples por fora, poderoso por dentro.*