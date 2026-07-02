// ──── Middleware de Multiempresa ────

import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Extrai o tenantId do header X-Tenant-Id ou do token JWT.
 * Injeta no request para uso nos serviços.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    // Extrai tenantId de múltiplas fontes
    const tenantId =
      req.headers['x-tenant-id'] as string ||
      (req as any).user?.tenantId ||
      req.query['tenantId'] as string;

    if (!tenantId) {
      throw new BadRequestException({
        code: 'TENANT_REQUIRED',
        message: 'Selecione uma empresa para continuar. Header X-Tenant-Id é obrigatório.',
      });
    }

    // Injeta no request para uso em guards e serviços
    (req as any).tenantId = tenantId;

    next();
  }
}