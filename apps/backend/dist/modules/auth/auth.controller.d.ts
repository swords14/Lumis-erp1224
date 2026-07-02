import { AuthService } from './auth.service';
import type { LoginRequest, LoginResponse } from '@ferramenta/shared';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginRequest, forwardedFor?: string, userAgent?: string, req?: any): Promise<LoginResponse>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(req: any): Promise<void>;
    me(req: any): Promise<any>;
    changePassword(req: any, currentPassword: string, newPassword: string): Promise<void>;
    switchTenant(req: any, tenantId: string, forwardedFor?: string, userAgent?: string): Promise<LoginResponse>;
}
