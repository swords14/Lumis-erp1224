# 🚀 Ferramenta ERP

<div align="center">

### ERP moderno, gratuito e open source para pequenas e médias empresas.

Desktop • Offline • Multiempresa • Rápido • Moderno

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20NestJS%20%7C%20PostgreSQL-blueviolet)

## ✨ Funcionalidades

### 📊 Dashboard
- Métricas em tempo real (receita, vendas, clientes, produtos)
- Gráfico de faturamento semanal com dados reais
- Variação percentual mensal
- Ações rápidas para criar vendas, clientes e produtos
- Skeleton loader durante carregamento

### 🛒 Vendas (PDV)
- Carrinho de compras com múltiplos itens
- Busca de produtos por nome ou código com autocomplete
- Controle de quantidade (+/-) por item
- Busca de cliente para associar à venda
- **Múltiplas formas de pagamento na mesma venda** (dinheiro + PIX + cartão + boleto)
- Cálculo automático de troco
- Campo de desconto
- Aprovação e cancelamento de vendas
- Gráfico de pizza por status

### 👥 Clientes (CRM)
- Cadastro completo (PF/PJ, contatos, endereço)
- Ficha do cliente com histórico de compras
- Total gasto, ticket médio, última compra
- Filtros por status, tipo, busca textual
- Remoção com confirmação visual (ConfirmModal)

### 📦 Produtos
- Catálogo com código, nome, preço de venda e custo
- Controle de estoque mínimo com alertas visuais
- Cálculo automático de margem
- Filtros: estoque baixo, ordenação por preço/estoque
- Valor total em estoque e custo

### 🚛 Fornecedores
- Cadastro e gestão de fornecedores
- Visualização em cards ou tabela
- Edição e remoção com confirmação visual

### 💰 Financeiro
- Contas a pagar e receber
- Fluxo de caixa com gráfico de área (30 dias)
- Gráfico de pizza por categoria
- Comparativo mensal (últimos 6 meses)
- Status: pendente, pago, atrasado
- Marcação de pagamento/recebimento

### 📊 Estoque
- Registro de entradas e saídas
- Histórico de movimentações
- Filtros por tipo (entrada/saída)

### 📈 Relatórios
- Vendas por período com gráfico diário (30 dias)
- Fluxo financeiro com evolução
- Clientes ativos com status
- Catálogo de produtos com estoque
- Estoque crítico (produtos abaixo do mínimo)
- **Exportação CSV e PDF profissional**
- Períodos: 7, 30 dias, mês atual, todo período

### 🔐 Segurança & Permissões (RBAC)
- 4 níveis de acesso: Admin, Gerente, Operador, Leitura
- 27 permissões granulares por módulo
- PermissionsGuard no backend (NestJS)
- Hook `usePermissions()` no frontend

### 📝 Auditoria
- Registro automático de todas as ações (CREATE, UPDATE, DELETE)
- Tabela `audit_logs` auto-gerada
- Resources auditados: vendas, clientes, fornecedores, produtos
- Tela dedicada de auditoria com paginação

### ⚙️ Configurações
- **3 temas**: Claro, Escuro, Sistema (automático)
- **3 idiomas**: 🇧🇷 Português, 🇺🇸 English, 🇪🇸 Español
- Dados da empresa (nome, CNPJ, segmento, endereço)
- Upload de logo
- Alteração de senha
- Backup manual e automático (diário/semanal/mensal)
- Configuração de impressão

### 📚 Base de Conhecimento (Ctrl+K)
- 16 artigos de ajuda em 9 categorias
- Busca inteligente por título, palavras-chave e conteúdo
- Navegação por categorias com ícones
- Acesso rápido a módulos
- Totalmente offline (sem dependência de API)

### 🌐 Internacionalização (i18n)
- 200+ chaves de tradução
- Cobertura completa: login, sidebar, header, todas as páginas
- Base de conhecimento traduzida
- Persistência em localStorage

## 🛠 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Backend | NestJS, Prisma ORM |
| Database | PostgreSQL 16 |
| UI | Tailwind CSS, Framer Motion, Lucide Icons |
| Gráficos | Recharts |
| PDF | jsPDF + autotable |
| State | Zustand, React Query |
| Auth | JWT + Refresh tokens |

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 20+
- PostgreSQL 16+
- npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Mathe/Ferramenta.git
cd Ferramenta

# Instale as dependências
npm install
cd apps/frontend && npm install
cd ../backend && npm install

# Configure o .env
cp .env.example .env
# Edite .env com suas credenciais do PostgreSQL
```

### Rodando

```bash
cd apps/backend

npm run start:dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev

# Acesse http://localhost:5173
```

## 📂 Estrutura do Projeto

```
apps/
├── frontend/         # React SPA (Vite)
│   ├── src/
│   │   ├── pages/        # 13 páginas (Dashboard, Clientes, PDV...)
│   │   ├── components/   # UI, navegação, assistente
│   │   ├── stores/       # Zustand (auth, i18n, ui, permissions)
│   │   ├── hooks/        # useAdvancedSearch
│   │   └── lib/          # masks, pdf, api, services
├── backend/          # NestJS API
│   └── src/
│       └── modules/      # 12 módulos (auth, sale, audit...)
└── packages/
    ├── shared/       # Tipos e DTOs compartilhados
    └── database/     # Schema Prisma + migrations

docs/
└── ARCHITECTURE.md   # Documentação completa da arquitetura
```

## 📖 Documentação

- [Arquitetura Completa](docs/ARCHITECTURE.md) - Stack, módulos, RBAC, auditoria, design system, roadmap

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📝 Licença

MIT