import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
/**
 * Extrai o tenantId do header X-Tenant-Id ou do token JWT.
 * Injeta no request para uso nos serviços.
 */
export declare class TenantMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction): void;
}
