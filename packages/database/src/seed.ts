// ──── Seed - Dados Iniciais do ERP ────

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Cria tenant padrão
  const tenant = await prisma.tenant.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Empresa Demo',
      fantasyName: 'Demo LTDA',
      document: '00000000000000',
      businessType: 'loja',
      taxRegime: 'simples_nacional',
      config: {
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        currency: 'BRL',
        dateFormat: 'DD/MM/YYYY',
        decimalSeparator: ',',
        modules: ['dashboard', 'clientes', 'produtos', 'vendas', 'financeiro', 'estoque'],
      },
    },
  });

  console.log('✅ Tenant criado:', tenant.name);

  // Cria admin user
  const passwordHash = await bcrypt.hash('Admin@123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@ferramenta.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@ferramenta.com',
      passwordHash,
      role: 'admin',
      tenantId: tenant.id,
      preferences: {
        theme: 'system',
        sidebarCollapsed: false,
        language: 'pt-BR',
      },
      userProgress: {
        create: {
          experienceLevel: 'especialista',
          points: 1000,
          tenantId: tenant.id,
        },
      },
    },
  });

  console.log('✅ Admin criado:', user.email, '(senha: Admin@123)');

  // Cria perfis padrão
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000010' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000010',
        tenantId: tenant.id,
        name: 'Admin',
        description: 'Acesso total ao sistema',
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000011' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000011',
        tenantId: tenant.id,
        name: 'Gerente',
        description: 'Gerente com acesso a relatórios e gestão',
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000012' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000012',
        tenantId: tenant.id,
        name: 'Operador',
        description: 'Operador com acesso básico',
        isSystem: true,
      },
    }),
  ]);
  console.log(`✅ ${roles.length} perfis criados`);

  // Cria conta financeira padrão
  const account = await prisma.financialAccount.create({
    data: {
      tenantId: tenant.id,
      name: 'Caixa Geral',
      type: 'caixa',
      initialBalance: 0,
      currentBalance: 0,
    },
  });
  console.log('✅ Conta financeira criada:', account.name);

  // Cria entradas na base de conhecimento
  const knowledgeEntries = await Promise.all([
    // Clientes
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_cadastrar_cliente', keywords: ['cadastrar', 'cliente', 'novo', 'criar cliente', 'adicionar cliente'], answer: 'Para cadastrar um novo cliente, vá até o menu "Clientes" na barra lateral e clique em "Novo Cliente". Preencha nome, email, telefone e documentos. Clique em Salvar.', moduleId: 'clientes', priority: 10 } }),
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_buscar_cliente', keywords: ['buscar', 'procurar', 'localizar cliente', 'pesquisa cliente'], answer: 'Na página de Clientes, use a barra de busca para filtrar por nome ou documento. Você também pode filtrar por status (Ativos/Inativos) e tipo (PF/PJ).', moduleId: 'clientes', priority: 5 } }),
    // Fornecedores
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_cadastrar_fornecedor', keywords: ['fornecedor', 'cadastrar fornecedor', 'novo fornecedor', 'cnpj'], answer: 'Acesse o menu "Fornecedores" na barra lateral e clique em "Novo Fornecedor". Informe razão social, CNPJ, email e telefone.', moduleId: 'fornecedores', priority: 10 } }),
    // Produtos
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_cadastrar_produto', keywords: ['cadastrar', 'produto', 'novo produto', 'adicionar produto'], answer: 'Vá até "Produtos" no menu lateral e clique em "Novo Produto". Informe código, nome, preço de custo e venda (em centavos), e estoque mínimo. O sistema calculará automaticamente a margem de lucro.', moduleId: 'produtos', priority: 10 } }),
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'estoque_baixo', keywords: ['estoque baixo', 'faltando', 'repor', 'estoque mínimo', 'alerta'], answer: 'Na página de Produtos, use o filtro "Estoque Baixo" para ver apenas produtos abaixo do estoque mínimo. Os cards com estoque crítico aparecem com borda vermelha e badge "ESTOQUE BAIXO".', moduleId: 'produtos', priority: 8 } }),
    // Vendas
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_fazer_venda', keywords: ['vender', 'venda', 'nova venda', 'pdv', 'como vender'], answer: 'Para realizar uma venda, acesse o menu "Vendas" e clique em "Nova Venda". Informe a descrição do item, quantidade, preço unitário e forma de pagamento. O total é calculado automaticamente.', moduleId: 'vendas', priority: 10 } }),
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_aprovar_venda', keywords: ['aprovar', 'venda', 'confirmar pedido', 'status venda'], answer: 'Na lista de vendas, clique no botão "Aprovar" no card da venda pendente, ou entre no detalhe da venda e clique em "Aprovar Venda". Você também pode selecionar várias vendas e aprovar em lote.', moduleId: 'vendas', priority: 8 } }),
    // Compras
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_cadastrar_compra', keywords: ['compra', 'ordem', 'nova compra', 'pedido compra'], answer: 'Acesse "Compras" no menu lateral e clique em "Nova Compra". Informe o fornecedor, descrição do item, quantidade, preço unitário e vencimento. O total é calculado automaticamente.', moduleId: 'compras', priority: 10 } }),
    // Financeiro
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_lancar_receita', keywords: ['receita', 'ganho', 'entrada dinheiro', 'lancar receita'], answer: 'No módulo Financeiro, clique em "Nova Transação", selecione "Receita" como tipo, informe descrição, valor em centavos e data de vencimento. O gráfico de fluxo de caixa é atualizado automaticamente.', moduleId: 'financeiro', priority: 10 } }),
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_lancar_despesa', keywords: ['despesa', 'gasto', 'saida dinheiro', 'lancar despesa', 'conta pagar'], answer: 'No módulo Financeiro, clique em "Nova Transação", selecione "Despesa" como tipo, informe descrição, valor em centavos e data de vencimento. Transações pendentes podem ser marcadas como pagas.', moduleId: 'financeiro', priority: 10 } }),
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_ver_saldo', keywords: ['saldo', 'caixa', 'quanto tenho', 'balanço', 'lucro'], answer: 'O saldo total aparece no topo da página Financeiro (Saldo Total = Receitas - Despesas). O gráfico de fluxo de caixa mostra a evolução diária dos últimos 30 dias.', moduleId: 'financeiro', priority: 8 } }),
    // Estoque
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_movimentar_estoque', keywords: ['movimentação', 'estoque', 'entrada', 'saida', 'movimentar'], answer: 'Acesse "Estoque" no menu lateral e clique em "Nova Movimentação". Escolha Entrada (quando receber produtos) ou Saída (quando vender/consumir). Informe quantidade, preço unitário e motivo.', moduleId: 'estoque', priority: 10 } }),
    // Relatórios
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_gerar_relatorio', keywords: ['relatório', 'exportar', 'csv', 'imprimir', 'gerar relatório'], answer: 'Na página Relatórios, clique no card do relatório desejado (Vendas, Financeiro, Clientes, Produtos ou Estoque). Ele expandirá mostrando KPIs, gráfico e tabela. Use "Exportar CSV" para baixar ou "Imprimir" para imprimir.', moduleId: 'relatorios', priority: 10 } }),
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'relatorio_vendas', keywords: ['relatório vendas', 'vendas período', 'faturamento'], answer: 'O relatório de Vendas mostra pedidos, faturamento total, pendentes e aprovados no período selecionado. Inclui gráfico de barras com faturamento diário e tabela completa exportável.', moduleId: 'relatorios', priority: 8 } }),
    // Usuários
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_criar_usuario', keywords: ['usuário', 'novo usuário', 'criar acesso', 'cadastrar usuário'], answer: 'Acesse "Usuários" (seção Sistema na barra lateral) e clique em "Novo Usuário". Informe nome, email, senha e escolha o perfil (Admin, Gerente, Operador ou Leitura).', moduleId: 'usuarios', priority: 10 } }),
    // Configurações
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_configurar_backup', keywords: ['backup', 'segurança', 'cópia', 'salvar dados'], answer: 'Em Configurações > aba Backup, você pode ativar o backup automático (diário, semanal ou mensal) ou criar um backup manual agora. Recomendamos manter o backup automático ativo.', moduleId: 'configuracoes', priority: 8 } }),
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'como_mudar_tema', keywords: ['tema', 'escuro', 'claro', 'dark mode', 'modo escuro'], answer: 'Clique no ícone de lua/sol no canto superior direito (Header) para alternar entre tema claro e escuro. A preferência é salva automaticamente.', moduleId: 'configuracoes', priority: 5 } }),
    // Dashboard
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'dashboard', keywords: ['dashboard', 'início', 'home', 'painel', 'visão geral'], answer: 'O Dashboard é sua tela inicial com 4 KPIs principais (Receita, Vendas, Clientes, Produtos), gráfico de receita semanal, ações rápidas e lista de últimas vendas e novos clientes.', moduleId: 'dashboard', priority: 8 } }),
    // Geral
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'atalhos_teclado', keywords: ['atalho', 'teclado', 'ctrl', 'atalhos', 'shortcut'], answer: 'Use Ctrl+K para abrir a busca rápida (este painel). Aqui você pode pesquisar qualquer página, comando ou tirar dúvidas sobre o sistema.', moduleId: 'dashboard', priority: 5 } }),
    prisma.knowledgeEntry.create({ data: { tenantId: tenant.id, intent: 'primeiros_passos', keywords: ['começar', 'iniciante', 'primeiro acesso', 'novo', 'tutorial'], answer: 'Bem-vindo ao Ferramenta ERP! Comece cadastrando seus Produtos em "Produtos > Novo Produto", depois cadastre Clientes em "Clientes > Novo Cliente". Para vender, vá em "Vendas > Nova Venda". Use Ctrl+K para ajuda rápida.', moduleId: 'dashboard', priority: 10 } }),
  ]);
  console.log(`✅ ${knowledgeEntries.length} entradas na base de conhecimento`);

  // Cria tour guiado de primeiro acesso
  const tour = await prisma.guidedTour.create({
    data: {
      tenantId: tenant.id,
      name: 'Primeiro Acesso',
      description: 'Tour guiado para novos usuários conhecerem o sistema',
      type: 'primeiro_acesso',
      steps: [
        {
          order: 1,
          target: '#sidebar',
          title: 'Menu de Navegação',
          content: 'Aqui você encontra todos os módulos do sistema. Navegue entre eles para acessar diferentes funcionalidades.',
          placement: 'right',
        },
        {
          order: 2,
          target: '#dashboard',
          title: 'Dashboard',
          content: 'Esta é sua tela inicial com os principais indicadores do seu negócio.',
          placement: 'bottom',
        },
        {
          order: 3,
          target: '#header-search',
          title: 'Busca Rápida',
          content: 'Use Ctrl+K para buscar qualquer coisa no sistema rapidamente.',
          placement: 'bottom',
        },
        {
          order: 4,
          target: '#quick-actions',
          title: 'Ações Rápidas',
          content: 'Atalhos para as tarefas mais comuns: nova venda, cadastrar cliente, etc.',
          placement: 'left',
        },
      ],
    },
  });
  console.log('✅ Tour guiado criado:', tour.name);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📧 Login: admin@ferramenta.com');
  console.log('🔑 Senha: Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });