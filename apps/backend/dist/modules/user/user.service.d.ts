import { PrismaService } from '../../database/prisma.service';
import type { UUID } from '@ferramenta/shared';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        name: string;
        role: string;
        email: string;
        status: string;
        avatar: string | null;
        id: string;
        lastLoginAt: Date | null;
    }[]>;
    findByEmail(email: string): Promise<{
        name: string;
        role: string;
        email: string;
        tenantId: string;
        status: string;
        avatar: string | null;
        id: string;
        passwordHash: string;
        experienceLevel: string;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        loginAttempts: number;
        lockedUntil: Date | null;
        lastLoginAt: Date | null;
        lastLoginIp: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: UUID): Promise<({
        userProgress: {
            tenantId: string;
            userId: string;
            id: string;
            experienceLevel: string;
            createdAt: Date;
            updatedAt: Date;
            firstSaleCompleted: boolean;
            firstProductCreated: boolean;
            firstCustomerCreated: boolean;
            firstSupplierCreated: boolean;
            firstExpenseCreated: boolean;
            firstBudgetCreated: boolean;
            completedTours: string[];
            completedTutorials: string[];
            points: number;
        } | null;
    } & {
        name: string;
        role: string;
        email: string;
        tenantId: string;
        status: string;
        avatar: string | null;
        id: string;
        passwordHash: string;
        experienceLevel: string;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        loginAttempts: number;
        lockedUntil: Date | null;
        lastLoginAt: Date | null;
        lastLoginIp: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(data: {
        name: string;
        email: string;
        password: string;
        role: string;
        tenantId: UUID;
    }): Promise<{
        name: string;
        role: string;
        email: string;
        tenantId: string;
        status: string;
        avatar: string | null;
        id: string;
        passwordHash: string;
        experienceLevel: string;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        loginAttempts: number;
        lockedUntil: Date | null;
        lastLoginAt: Date | null;
        lastLoginIp: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
