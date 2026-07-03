import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(req: any): Promise<{
        name: string;
        role: string;
        email: string;
        status: string;
        avatar: string | null;
        id: string;
        lastLoginAt: Date | null;
    }[]>;
    me(req: any): Promise<({
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
    findById(id: string): Promise<({
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
    create(data: any, req: any): Promise<{
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
