"use strict";
// ──── Serviço de Autenticação ────
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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../database/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
const event_emitter_1 = require("@nestjs/event-emitter");
let AuthService = class AuthService {
    prisma;
    jwtService;
    eventEmitter;
    constructor(prisma, jwtService, eventEmitter) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.eventEmitter = eventEmitter;
    }
    /**
     * Login do usuário com suporte multiempresa.
     * Retorna tokens + lista de tenants disponíveis.
     */
    async login(dto, ip, userAgent) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
            include: {
                tenant: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email ou senha inválidos.');
        }
        // Verifica bloqueio por tentativas
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
            throw new common_1.UnauthorizedException(`Conta bloqueada. Tente novamente em ${minutes} minutos.`);
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            // Incrementa tentativas de login
            const attempts = user.loginAttempts + 1;
            const lockedUntil = attempts >= 5 ? new Date(Date.now() + 30 * 60000) : null;
            await this.prisma.user.update({
                where: { id: user.id },
                data: { loginAttempts: attempts, lockedUntil },
            });
            throw new common_1.UnauthorizedException('Email ou senha inválidos.');
        }
        if (user.status !== 'ativo') {
            throw new common_1.UnauthorizedException('Usuário inativo ou bloqueado.');
        }
        // Reseta tentativas de login
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
                lastLoginIp: ip,
            },
        });
        // Busca todos os tenants do usuário (ou o tenant específico)
        const tenants = await this.prisma.tenant.findMany({
            where: {
                id: dto.tenantId || user.tenantId,
                status: 'ativo',
                users: { some: { id: user.id } },
            },
            select: {
                id: true,
                name: true,
                businessType: true,
            },
        });
        if (tenants.length === 0) {
            throw new common_1.UnauthorizedException('Nenhuma empresa disponível para este usuário.');
        }
        // Seleciona o tenant (prioridade: especificado no login > primeiro disponível)
        const selectedTenant = dto.tenantId
            ? tenants.find((t) => t.id === dto.tenantId)
            : tenants[0];
        if (!selectedTenant) {
            throw new common_1.UnauthorizedException('Empresa não encontrada ou sem acesso.');
        }
        // Gera tokens
        const tokens = await this.generateTokens(user.id, selectedTenant.id, ip, userAgent);
        // Emite evento de login
        this.eventEmitter.emit('user.login', {
            userId: user.id,
            tenantId: selectedTenant.id,
            ip,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar ?? undefined,
                role: user.role,
                tenantId: selectedTenant.id,
                tenantName: selectedTenant.name,
            },
            tokens,
            tenants: tenants.map((t) => ({
                id: t.id,
                name: t.name,
                businessType: t.businessType,
            })),
        };
    }
    /**
     * Renova o access token usando refresh token.
     */
    async refreshToken(refreshToken) {
        const session = await this.prisma.session.findUnique({
            where: { refreshToken },
            include: { user: true, tenant: true },
        });
        if (!session) {
            throw new common_1.UnauthorizedException('Refresh token inválido.');
        }
        if (session.expiresAt < new Date()) {
            await this.prisma.session.delete({ where: { id: session.id } });
            throw new common_1.UnauthorizedException('Refresh token expirado.');
        }
        if (session.user.status !== 'ativo') {
            throw new common_1.UnauthorizedException('Usuário inativo.');
        }
        // Revoga sessão antiga
        await this.prisma.session.delete({ where: { id: session.id } });
        // Cria nova sessão
        return this.generateTokens(session.userId, session.tenantId, session.ip || undefined, session.userAgent || undefined);
    }
    /**
     * Logout - revoga todas as sessões do usuário no tenant atual.
     */
    async logout(userId, tenantId) {
        await this.prisma.session.deleteMany({
            where: { userId, tenantId },
        });
    }
    /**
     * Valida se o usuário tem acesso ao tenant.
     */
    async validateTenantAccess(userId, tenantId) {
        const count = await this.prisma.user.count({
            where: { id: userId, tenantId, status: 'ativo' },
        });
        return count > 0;
    }
    /**
     * Altera a senha do usuário.
     */
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuário não encontrado.');
        }
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            throw new common_1.BadRequestException('Senha atual incorreta.');
        }
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        // Revoga todas as sessões para forçar re-login
        await this.prisma.session.deleteMany({ where: { userId } });
        this.eventEmitter.emit('user.password_changed', { userId });
    }
    // ──── Métodos Privados ────
    async generateTokens(userId, tenantId, ip, userAgent) {
        const payload = { sub: userId, tenantId };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: (process.env.JWT_EXPIRATION || '15m'),
        });
        const refreshToken = (0, uuid_1.v4)();
        // Salva sessão
        await this.prisma.session.create({
            data: {
                userId,
                tenantId,
                token: accessToken,
                refreshToken,
                ip,
                userAgent,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            },
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: 15 * 60, // 15 minutos em segundos
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        event_emitter_1.EventEmitter2])
], AuthService);
//# sourceMappingURL=auth.service.js.map