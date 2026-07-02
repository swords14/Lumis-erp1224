# Stubs Restantes do Backend

Os seguintes módulos foram declarados como stubs:
- StockModule (apps/backend/src/modules/stock/stock.module.ts)
- SaleModule (apps/backend/src/modules/sale/sale.module.ts)
- FinancialModule (apps/backend/src/modules/financial/financial.module.ts)
- AuditModule (apps/backend/src/modules/audit/audit.module.ts)
- BackupModule (apps/backend/src/modules/backup/backup.module.ts)
- AssistantModule (apps/backend/src/modules/assistant/assistant.module.ts)
- EventsModule (apps/backend/src/events/events.module.ts)
- WebSocketModule (apps/backend/src/websocket/websocket.module.ts)

Todos seguem o mesmo padrão:
```typescript
import { Module } from '@nestjs/common';
@Module({})
export class XxxModule {}