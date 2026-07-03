# 🚀 Ferramenta ERP

<div align="center">

### ERP moderno, gratuito e open source para pequenas e médias empresas.

Desktop • Offline • Multiempresa • Rápido • Moderno

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![Open Source](https://img.shields.io/badge/Open%20Source-❤️-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Tauri](https://img.shields.io/badge/Tauri-2.x-orange)

</div>

---

# ❤️ Nossa Missão

O **Ferramenta ERP** nasceu para democratizar o acesso a sistemas de gestão empresarial.

Pequenas e médias empresas muitas vezes pagam mensalidades elevadas por ERPs limitados ou utilizam sistemas antigos e difíceis de manter.

Nosso objetivo é oferecer um ERP moderno, rápido, intuitivo e totalmente transparente para toda a comunidade.

## O projeto é gratuito?

**Sim.**

Qualquer empresa pode utilizar o Ferramenta ERP gratuitamente.

Você nunca precisará pagar licença para utilizar o sistema.

Caso queira apoiar o projeto, doações serão sempre bem-vindas.

---

# ✨ Diferenciais

✅ Open Source

✅ Desktop (Windows)

✅ Funciona Offline

✅ Interface moderna

✅ Multiempresa

✅ Controle Financeiro

✅ Controle de Estoque

✅ PDV

✅ CRM

✅ Auditoria

✅ Controle de Usuários

✅ Internacionalização (Português, English, Español)

✅ Backup

✅ Base de Conhecimento Integrada

---

# 📸 Screenshots

> Em breve

Dashboard

Clientes

Financeiro

PDV

Relatórios

---

# 📦 Funcionalidades

## 📊 Dashboard

- Indicadores em tempo real com dados do banco
- Receita, Vendas, Produtos e Clientes
- Gráfico de faturamento semanal
- Variação percentual mensal
- Ações rápidas integradas

---

## 👥 Clientes

- Cadastro PF/PJ
- Histórico de compras
- CRM com ficha detalhada
- Busca por nome, documento, contato
- Filtros inteligentes por status e tipo
- Remoção com confirmação visual

---

## 📦 Produtos

- Cadastro completo com código SKU
- Controle de estoque atual e mínimo
- Alertas visuais de estoque baixo
- Margem de lucro automática
- Preço de custo e venda
- Ordenação por preço ou estoque

---

## 🛒 Vendas (PDV)

- Carrinho de compras multi-itens
- Busca de produtos com autocomplete
- Múltiplas formas de pagamento por venda
- Cálculo automático de troco
- Descontos
- Aprovação e cancelamento
- Cliente opcional na venda

---

## 💰 Financeiro

- Contas a pagar e receber
- Fluxo de caixa com gráfico de área (30 dias)
- Gráfico de pizza por categoria
- Comparativo mensal (6 meses)
- Status: pendente, pago, atrasado
- Marcação rápida de pagamento

---

## 📈 Relatórios

- Exportação PDF profissional
- Exportação CSV
- Vendas por período
- Fluxo financeiro
- Clientes ativos
- Catálogo de produtos
- Estoque crítico
- Filtros por período (7d, 30d, mês, todos)

---

## 🔐 Segurança

- Autenticação JWT + Refresh Tokens
- RBAC com 4 níveis de acesso
- 27 permissões granulares
- Auditoria completa de ações
- Argon2 para senhas
- Row Level Security (multiempresa)
- Backup automático e manual
- Rate limiting

---

# 🏗️ Arquitetura

```
Tauri Desktop
        │
React + TypeScript
        │
NestJS API
        │
Prisma ORM
        │
PostgreSQL
```

---

# 🛠 Stack Tecnológica

| Camada | Tecnologia |
|---------|------------|
| Desktop | Tauri 2 |
| Frontend | React 19 |
| Backend | NestJS |
| Banco | PostgreSQL |
| ORM | Prisma |
| Estado | Zustand |
| Server State | React Query |
| CSS | Tailwind CSS |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Gráficos | Recharts |
| PDF | jsPDF + autotable |
| Testes | Vitest + Playwright |

---

# 🚀 Instalação

```bash
git clone https://github.com/seuusuario/ferramenta-erp
cd ferramenta-erp
npm install
```

**Frontend:**

```bash
cd apps/frontend
npm run dev
```

**Backend:**

```bash
cd apps/backend
npm run start:dev
```

Acesse: `http://localhost:5173`

---

# 📂 Estrutura

```
apps/
├── desktop/          # Tauri desktop app
├── frontend/         # React SPA (Vite)
└── backend/          # NestJS API

packages/
├── shared/           # Tipos e DTOs compartilhados
├── database/         # Prisma schema + migrations
├── ui/               # Design system
├── installer/        # Instalador inteligente
└── assistant/        # Base de conhecimento

docs/                 # Documentação completa
scripts/              # Scripts de build e deploy
```

---

# 🛣️ Roadmap

## ✅ MVP (Concluído)

- [x] Dashboard com métricas reais
- [x] Clientes e Fornecedores
- [x] Produtos com estoque
- [x] Financeiro completo
- [x] PDV funcional
- [x] Relatórios com PDF/CSV
- [x] Auditoria completa
- [x] Permissões RBAC
- [x] Internacionalização (3 idiomas)
- [x] Base de conhecimento (16 artigos)
- [x] Máscaras de input
- [x] Busca avançada com filtros

## 🚧 Em desenvolvimento

- [ ] Upload de imagens (produtos + logo)
- [ ] Instalador Inteligente
- [ ] Notificações em tempo real (WebSocket)
- [ ] Tour guiado interativo
- [ ] PWA (Progressive Web App)

## 🔮 Futuro

- [ ] Marketplace de módulos
- [ ] API Pública com Swagger
- [ ] White Label
- [ ] Multi-filiais
- [ ] Módulo de Serviços (OS)
- [ ] Metas e comissões
- [ ] Orçamentos → Vendas

---

# 🤝 Como contribuir

Toda ajuda é bem-vinda!

Você pode contribuir de várias formas:

- 🐛 Corrigindo bugs
- ✨ Criando funcionalidades
- 📝 Melhorando a documentação
- 🌐 Traduzindo para outros idiomas
- 🐛 Reportando problemas

Abra uma **Issue** ou envie um **Pull Request**.

Veja a [documentação completa da arquitetura](docs/ARCHITECTURE.md) para entender a estrutura do projeto.

---

# ❤️ Apoie o Projeto

Se o Ferramenta ERP ajudou sua empresa ou seu aprendizado, considere apoiar o desenvolvimento.

Em breve:

- GitHub Sponsors
- PIX
- Open Collective

---

# 📄 Licença

Este projeto é distribuído sob a licença **MIT**.

Isso significa que:

✅ Você pode utilizar gratuitamente

✅ Pode modificar o código

✅ Pode estudar o código

✅ Pode contribuir com melhorias

✅ Empresas podem utilizar comercialmente em seus negócios

---

<div align="center">

Feito com ❤️ para a comunidade Open Source.

Se este projeto foi útil para você, considere deixar uma ⭐ no repositório.

</div>