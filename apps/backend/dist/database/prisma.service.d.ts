import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    /**
     * Executa operação dentro de uma transação com tenant isolation.
     */
    withTenant<T>(tenantId: string, fn: (tx: PrismaClient) => Promise<T>): Promise<T>;
}
