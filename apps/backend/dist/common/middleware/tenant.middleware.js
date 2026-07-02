"use strict";
// ──── Middleware de Multiempresa ────
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
/**
 * Extrai o tenantId do header X-Tenant-Id ou do token JWT.
 * Injeta no request para uso nos serviços.
 */
let TenantMiddleware = class TenantMiddleware {
    use(req, _res, next) {
        // Extrai tenantId de múltiplas fontes
        const tenantId = req.headers['x-tenant-id'] ||
            req.user?.tenantId ||
            req.query['tenantId'];
        if (!tenantId) {
            throw new common_1.BadRequestException({
                code: 'TENANT_REQUIRED',
                message: 'Selecione uma empresa para continuar. Header X-Tenant-Id é obrigatório.',
            });
        }
        // Injeta no request para uso em guards e serviços
        req.tenantId = tenantId;
        next();
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)()
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map