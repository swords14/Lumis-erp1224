"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
const common_1 = require("@nestjs/common");
/** Módulo de configuração global (placeholder para ConfigService) */
let ConfigModule = class ConfigModule {
};
exports.ConfigModule = ConfigModule;
exports.ConfigModule = ConfigModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: 'APP_CONFIG',
                useValue: {
                    appName: 'Ferramenta ERP',
                    version: '1.0.0',
                    port: process.env.PORT || 3000,
                    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ferramenta',
                    jwtSecret: process.env.JWT_SECRET || 'ferramenta-secret-key-change-in-production',
                    jwtExpiration: process.env.JWT_EXPIRATION || '15m',
                    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
                },
            },
        ],
        exports: ['APP_CONFIG'],
    })
], ConfigModule);
//# sourceMappingURL=config.module.js.map