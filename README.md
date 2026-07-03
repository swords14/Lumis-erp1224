<div align="center">

# 🚀 Ferramenta ERP

### ERP moderno, gratuito e Open Source para pequenas e médias empresas.

Desktop • Offline • Multiempresa • Seguro • Rápido

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![License](https://img.shields.io/badge/license-AGPL%20v3-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Tauri](https://img.shields.io/badge/Tauri-2.x-orange)

⭐ Se este projeto for útil para você, deixe uma estrela no repositório.

</div>

---

# ❤️ Nossa missão

O **Ferramenta ERP** nasceu com um objetivo simples:

> Tornar sistemas de gestão empresarial modernos acessíveis para qualquer empresa.

Acreditamos que pequenas e médias empresas não deveriam depender de softwares caros ou ultrapassados para administrar seus negócios.

Por isso o Ferramenta ERP é desenvolvido como um projeto **Open Source**, gratuito para utilização e aberto à colaboração da comunidade.

---

# ✨ Principais diferenciais

- ✅ 100% Open Source
- ✅ Gratuito para utilização
- ✅ Desktop (Windows)
- ✅ Funciona Offline
- ✅ Multiempresa
- ✅ Interface moderna
- ✅ Alta performance (Tauri)
- ✅ Controle Financeiro
- ✅ Controle de Estoque
- ✅ CRM
- ✅ PDV
- ✅ Auditoria
- ✅ Sistema de Permissões (RBAC)
- ✅ Backup
- ✅ Internacionalização
- ✅ Base de Conhecimento integrada

---

# 📸 Screenshots

> Em breve

- Dashboard
- PDV
- Financeiro
- Estoque
- Relatórios

---

# 📦 Funcionalidades

## 📊 Dashboard

- Indicadores em tempo real
- Receita
- Clientes
- Produtos
- Vendas
- Skeleton Loading
- Gráficos interativos

---

## 👥 Clientes

- Cadastro PF/PJ
- Histórico de compras
- CRM
- Pesquisa avançada
- Filtros persistentes

---

## 🚛 Fornecedores

- Cadastro completo
- Gestão de fornecedores
- Visualização em cards
- Confirmação para exclusão

---

## 📦 Produtos

- Controle de estoque
- Estoque mínimo
- Margem de lucro
- Custos
- Pesquisa rápida

---

## 🛒 Vendas (PDV)

- Carrinho multi-itens
- Diversas formas de pagamento
- Descontos
- Aprovação
- Cancelamento
- Cálculo automático de troco

---

## 💰 Financeiro

- Fluxo de Caixa
- Contas a pagar
- Contas a receber
- Indicadores
- Gráficos

---

## 📈 Relatórios

- Exportação PDF
- Exportação CSV
- Relatórios financeiros
- Estoque
- Produtos
- Clientes

---

## 🔐 Segurança

- JWT
- Refresh Tokens
- Argon2
- RBAC
- Auditoria
- Row Level Security
- Validação de dados
- Proteção contra SQL Injection

---

## 🌎 Internacionalização

- 🇧🇷 Português
- 🇺🇸 English
- 🇪🇸 Español

Mais de 200 traduções em toda a aplicação.

---

# 🏗 Arquitetura

```
                 Ferramenta ERP

              Desktop (Tauri)
                     │
        React 19 + TypeScript + Vite
                     │
                 NestJS API
                     │
             Prisma ORM
                     │
             PostgreSQL 16
```

---

# 🛠 Stack Tecnológica

| Camada | Tecnologia |
|----------|------------|
| Desktop | Tauri 2 |
| Frontend | React 19 |
| Backend | NestJS |
| Banco | PostgreSQL 16 |
| ORM | Prisma |
| Estado | Zustand |
| Server State | React Query |
| CSS | Tailwind CSS |
| Animações | Framer Motion |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts |
| PDF | jsPDF |
| Testes | Vitest + Playwright |

---

# 📂 Estrutura

```
apps/
│
├── desktop/
├── frontend/
└── backend/

packages/
│
├── shared/
├── database/
├── ui/
├── installer/
└── assistant/

docs/

scripts/
```

---

# 🚀 Instalação

## Clone

```bash
git clone https://github.com/swords14/new.git
```

## Instale as dependências

```bash
npm install
```

## Frontend

```bash
cd apps/frontend

npm run dev
```

## Backend

```bash
cd apps/backend

npm run start:dev
```

---

# 🗺 Roadmap

## ✅ Implementado

- Dashboard
- Clientes
- Fornecedores
- Produtos
- Estoque
- Financeiro
- Relatórios
- PDV
- Auditoria
- RBAC
- Internacionalização
- Base de Conhecimento

---

## 🚧 Em desenvolvimento

- Upload de imagens
- Instalador Inteligente
- Notificações em tempo real
- PWA
- Tour guiado
- Orçamentos
- Metas e comissões

---

## 🔮 Futuro

- Multi-filiais
- White Label
- Marketplace
- API Pública
- Serviços (OS)

---

# 📖 Documentação

A documentação completa encontra-se em:

```
docs/
```

- Arquitetura
- Roadmap
- Instalador
- API
- Contribuição

---

# 🤝 Como contribuir

Contribuições são muito bem-vindas.

Você pode contribuir de diversas formas:

- Corrigindo bugs
- Desenvolvendo novas funcionalidades
- Melhorando a documentação
- Traduzindo o sistema
- Reportando problemas
- Revisando Pull Requests

Toda contribuição ajuda o projeto a evoluir.

---

# ❤️ Apoie o projeto

O Ferramenta ERP é um projeto gratuito.

Se ele ajudou você ou sua empresa, considere apoiar seu desenvolvimento.

Em breve:

- GitHub Sponsors
- PIX
- OpenCollective

Mesmo que você não possa contribuir financeiramente, deixar uma ⭐ no repositório já ajuda bastante.

---

# 📄 Licença

Este projeto é distribuído sob a licença **GNU Affero General Public License v3.0 (AGPL-3.0)**.

Isso significa que:

✅ Você pode utilizar o Ferramenta ERP gratuitamente.

✅ Pode modificar o código.

✅ Pode estudar o funcionamento do projeto.

✅ Pode contribuir com melhorias.

✅ Empresas podem utilizar o sistema normalmente em seus negócios.

✅ Melhorias distribuídas para terceiros devem permanecer sob a mesma licença.

Nosso objetivo é garantir que o Ferramenta ERP permaneça livre, aberto e acessível para toda a comunidade.

Leia a licença completa em:

https://www.gnu.org/licenses/agpl-3.0.html

---

<div align="center">

### Desenvolvido com ❤️ pela comunidade.

**Se este projeto foi útil para você, considere deixar uma ⭐ no repositório.**

</div>
