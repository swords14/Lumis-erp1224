import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { AuditModule } from '../audit/audit.module';

@Module({ imports: [AuditModule], controllers: [SaleController], providers: [SaleService], exports: [SaleService] })
export class SaleModule {}
