import { PrismaService } from '../../database/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { UUID } from '@ferramenta/shared';
export declare class TenantService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    findAll(): Promise<{
        name: string;
        document: string | null;
        status: string;
        primaryColor: string | null;
        fantasyName: string | null;
        businessType: string;
        taxRegime: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logo: string | null;
        config: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    findById(id: UUID): Promise<{
        name: string;
        document: string | null;
        status: string;
        primaryColor: string | null;
        fantasyName: string | null;
        businessType: string;
        taxRegime: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logo: string | null;
        config: import("@prisma/client/runtime/library").JsonValue;
    } | null>;
    create(data: {
        name: string;
        fantasyName?: string;
        document?: string;
        businessType: string;
        adminEmail: string;
        adminPassword: string;
        adminName: string;
    }): Promise<{
        name: string;
        document: string | null;
        status: string;
        primaryColor: string | null;
        fantasyName: string | null;
        businessType: string;
        taxRegime: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logo: string | null;
        config: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
