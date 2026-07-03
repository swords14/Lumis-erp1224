import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuditService } from '../audit/audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly service: ProductService, private readonly audit: AuditService) {}

  @Get() findAll(@Query() q: any, @Req() req: any) { return this.service.findAll(req.user.tenantId, q); }
  @Get(':id') findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user.tenantId); }

  @Post() async create(@Body() b: any, @Req() req: any) {
    const result = await this.service.create({ ...b, tenantId: req.user.tenantId });
    this.audit.logCreate(req.user.tenantId, req.user.id, 'product', result.id, { name: result.name, code: result.code });
    return result;
  }

  @Put(':id') async update(@Param('id') id: string, @Body() b: any, @Req() req: any) {
    const result = await this.service.update(id, req.user.tenantId, b);
    this.audit.logUpdate(req.user.tenantId, req.user.id, 'product', id, b);
    return result;
  }

  @Delete(':id') async remove(@Param('id') id: string, @Req() req: any) {
    const result = await this.service.remove(id, req.user.tenantId);
    this.audit.logDelete(req.user.tenantId, req.user.id, 'product', id);
    return result;
  }
}