import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuditModule } from '../audit/audit.module';
@Module({ imports: [AuditModule], controllers: [ProductController], providers: [ProductService], exports: [ProductService] })
export class ProductModule {}
