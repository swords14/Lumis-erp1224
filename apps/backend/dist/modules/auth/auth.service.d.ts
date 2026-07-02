import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { LoginRequest, LoginResponse } from '@ferramenta/shared';
export declare class AuthService {
    private prisma;
    private jwtService;
    private eventEmitter;
    constructor(prisma: PrismaService, jwtService: JwtService, eventEmitter: EventEmitter2);
    /**
     * Login do usuário com suporte multiempresa.
     * Retorna tokens + lista de tenants disponíveis.
     */
    login(dto: LoginRequest, ip?: string, userAgent?: string): Promise<LoginResponse>;
    /**
     * Renova o access token usando refresh token.
     */
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    /**
     * Logout - revoga todas as sessões do usuário no tenant atual.
     */
    logout(userId: string, tenantId: string): Promise<void>;
    /**
     * Valida se o usuário tem acesso ao tenant.
     */
    validateTenantAccess(userId: string, tenantId: string): Promise<boolean>;
    /**
     * Altera a senha do usuário.
     */
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    private generateTokens;
}
