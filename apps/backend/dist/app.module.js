"use strict";
// ──── Módulo Principal do NestJS ────
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_module_1 = require("./config/config.module");
const prisma_module_1 = require("./database/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const tenant_module_1 = require("./modules/tenant/tenant.module");
const user_module_1 = require("./modules/user/user.module");
const person_module_1 = require("./modules/person/person.module");
const product_module_1 = require("./modules/product/product.module");
const stock_module_1 = require("./modules/stock/stock.module");
const sale_module_1 = require("./modules/sale/sale.module");
const financial_module_1 = require("./modules/financial/financial.module");
const audit_module_1 = require("./modules/audit/audit.module");
const backup_module_1 = require("./modules/backup/backup.module");
const assistant_module_1 = require("./modules/assistant/assistant.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const events_module_1 = require("./events/events.module");
const websocket_module_1 = require("./websocket/websocket.module");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
    configure(consumer) {
        // Aplica o middleware de tenant em todas as rotas (exceto auth)
        consumer
            .apply(tenant_middleware_1.TenantMiddleware)
            .exclude({ path: 'auth/(.*)', method: common_1.RequestMethod.ALL }, { path: 'health', method: common_1.RequestMethod.ALL })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Configuração global
            config_module_1.ConfigModule,
            // Rate limiting (120 requisições por minuto)
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 120,
                }]),
            // Infraestrutura
            prisma_module_1.PrismaModule,
            events_module_1.EventsModule,
            websocket_module_1.WebSocketModule,
            // Módulos de Domínio
            auth_module_1.AuthModule,
            tenant_module_1.TenantModule,
            user_module_1.UserModule,
            person_module_1.PersonModule,
            product_module_1.ProductModule,
            stock_module_1.StockModule,
            sale_module_1.SaleModule,
            financial_module_1.FinancialModule,
            audit_module_1.AuditModule,
            backup_module_1.BackupModule,
            assistant_module_1.AssistantModule,
            dashboard_module_1.DashboardModule,
        ],
        providers: [
            // Rate limiting global
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map