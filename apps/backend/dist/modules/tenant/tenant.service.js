"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const event_emitter_1 = require("@nestjs/event-emitter");
let TenantService = class TenantService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async findAll() {
        return this.prisma.tenant.findMany({ where: { status: 'ativo' } });
    }
    async findById(id) {
        return this.prisma.tenant.findUnique({
            where: { id },
            include: { contacts: true },
        });
    }
    async create(data) {
        const exists = await this.prisma.tenant.findFirst({
            where: { document: data.document },
        });
        if (exists)
            throw new common_1.BadRequestException('Empresa já cadastrada.');
        // Cria tenant
        const tenant = await this.prisma.tenant.create({
            data: {
                name: data.name,
                fantasyName: data.fantasyName,
                document: data.document,
                businessType: data.businessType,
                config: { timezone: 'America/Sao_Paulo', language: 'pt-BR', currency: 'BRL' },
                roles: {
                    createMany: {
                        data: [
                            { name: 'Admin', isSystem: true, description: 'Administrador do sistema' },
                            { name: 'Gerente', isSystem: true, description: 'Gerente' },
                            { name: 'Operador', isSystem: true, description: 'Operador' },
                        ],
                    },
                },
            },
        });
        // Cria admin user com progress separadamente
        await this.prisma.user.create({
            data: {
                name: data.adminName,
                email: data.adminEmail,
                passwordHash: await bcrypt.hash(data.adminPassword, 12),
                role: 'admin',
                tenantId: tenant.id,
                preferences: { theme: 'system', sidebarCollapsed: false, language: 'pt-BR' },
                userProgress: {
                    create: {
                        experienceLevel: 'iniciante',
                        points: 0,
                        tenantId: tenant.id,
                    },
                },
            },
        });
        this.eventEmitter.emit('tenant.created', {
            tenantId: tenant.id,
            tenantName: tenant.name,
            businessType: tenant.businessType,
        });
        return tenant;
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], TenantService);
//# sourceMappingURL=tenant.service.js.map