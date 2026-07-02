// ──── Módulo Principal do NestJS ────

import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';
import { PersonModule } from './modules/person/person.module';
import { ProductModule } from './modules/product/product.module';
import { StockModule } from './modules/stock/stock.module';
import { SaleModule } from './modules/sale/sale.module';
import { FinancialModule } from './modules/financial/financial.module';
import { AuditModule } from './modules/audit/audit.module';
import { BackupModule } from './modules/backup/backup.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EventsModule } from './events/events.module';
import { WebSocketModule } from './websocket/websocket.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // Configuração global
    ConfigModule,
    
    // Rate limiting (120 requisições por minuto)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 120,
    }]),

    // Infraestrutura
    PrismaModule,
    EventsModule,
    WebSocketModule,

    // Módulos de Domínio
    AuthModule,
    TenantModule,
    UserModule,
    PersonModule,
    ProductModule,
    StockModule,
    SaleModule,
    FinancialModule,
    AuditModule,
    BackupModule,
    AssistantModule,
    DashboardModule,
  ],
  providers: [
    // Rate limiting global
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplica o middleware de tenant em todas as rotas (exceto auth)
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'health', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}