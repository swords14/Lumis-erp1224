import { TenantService } from './tenant.service';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
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
    findById(id: string): Promise<{
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
    create(data: any): Promise<{
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
