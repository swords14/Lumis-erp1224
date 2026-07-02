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
    prisma.knowledgeEntry.create({
      data: {
        tenantId: tenant.id,
        intent: 'como_cadastrar_cliente',
        keywords: ['cadastrar', 'cliente', 'novo', 'criar cliente', 'adicionar cliente'],
        answer: 'Para cadastrar um novo cliente, vá até o menu "Clientes" na barra lateral e clique em "Novo Cliente". Preencha os dados e clique em Salvar.',
        moduleId: 'clientes',
        action: '/clientes/novo',
        priority: 10,
      },
    }),
    prisma.knowledgeEntry.create({
      data: {
        tenantId: tenant.id,
        intent: 'como_fazer_venda',
        keywords: ['vender', 'venda', 'nova venda', 'pdv', 'como vender'],
        answer: 'Para realizar uma venda, acesse o menu "Vendas" e clique em "Nova Venda" ou use o PDV. Adicione os produtos, escolha a forma de pagamento e finalize.',
        moduleId: 'vendas',
        action: '/vendas/nova',
        priority: 10,
      },
    }),
    prisma.knowledgeEntry.create({
      data: {
        tenantId: tenant.id,
        intent: 'como_cadastrar_produto',
        keywords: ['cadastrar', 'produto', 'novo produto', 'estoque', 'adicionar'],
        answer: 'Vá até "Produtos" no menu lateral e clique em "Novo Produto". Informe código, nome, preço de custo e venda, e estoque mínimo.',
        moduleId: 'produtos',
        action: '/produtos/novo',
        priority: 10,
      },
    }),
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