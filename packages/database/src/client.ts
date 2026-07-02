// ──── Prisma Client com Multiempresa (Tenant Isolation) ────

import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client singleton com extensão para filtro automático por tenant.
 * Em produção, o middleware NestJS injeta o tenantId no contexto da requisição.
 * O AsyncLocalStorage é usado para propagar o tenantId sem passá-lo explicitamente.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ──── AsyncLocalStorage para contexto de tenant ────

import { AsyncLocalStorage } from 'async_hooks';

interface TenantContext {
  tenantId: string;
  userId?: string;
}

const tenantStorage = new AsyncLocalStorage<TenantContext>();

/**
 * Executa uma função dentro do contexto de um tenant específico.
 * Todas as operações do Prisma dentro deste callback serão automaticamente
 * filtradas pelo tenantId (quando a extensão estiver ativa).
 */
export async function withTenant<T>(
  tenantId: string,
  userId: string | undefined,
  fn: () => Promise<T>,
): Promise<T> {
  return tenantStorage.run({ tenantId, userId }, fn);
}

/**
 * Obtém o tenantId do contexto atual (AsyncLocalStorage)
 */
export function getCurrentTenantId(): string | undefined {
  return tenantStorage.getStore()?.tenantId;
}

/**
 * Obtém o userId do contexto atual
 */
export function getCurrentUserId(): string | undefined {
  return tenantStorage.getStore()?.userId;
}

// ──── Prisma Client estendido com tenant isolation ────

/**
 * Extensão do Prisma Client que automaticamente aplica filtro de tenantId
 * em todas as queries para modelos que possuem o campo tenantId.
 * 
 * Uso:
 * ```typescript
 * const tenantAwarePrisma = prisma.$extends(tenantIsolation);
 * ```
 */
export const tenantIsolation = {
  name: 'tenantIsolation',
  query: {
    $allModels: {
      // Hook executado antes de cada operação
      async $allOperations({ operation, args, query }: any) {
        const tenantId = getCurrentTenantId();

        if (
          tenantId &&
          ['findUnique', 'findFirst', 'findMany', 'count', 'aggregate', 'groupBy'].includes(operation)
        ) {
          // Aplica tenantId como filtro adicional
          if (!args.where) args.where = {};
          
          // Só adiciona o filtro se o modelo tiver o campo tenantId
          // e se nenhum tenantId explícito foi passado
          if (args.where.tenantId === undefined) {
            args.where.tenantId = tenantId;
          }
        }

        if (
          tenantId &&
          ['create', 'createMany'].includes(operation)
        ) {
          if (!args.data) args.data = {};
          
          // Injeta tenantId automaticamente na criação
          if (args.data.tenantId === undefined) {
            args.data.tenantId = tenantId;
          }
        }

        return query(args);
      },
    },
  },
};

export default prisma;