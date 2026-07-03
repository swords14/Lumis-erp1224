import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { SaleService } from './sale.service';
import { AuditService } from '../audit/audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SaleController {
  constructor(private readonly service: SaleService, private readonly audit: AuditService) {}
  @Get() findAll(@Query() q: any, @Req() req: any) { return this.service.findAll(req.user.tenantId, q); }
  @Get(':id') findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user.tenantId); }
  @Post() async create(@Body() b: any, @Req() req: any) {
    const result = await this.service.create({ ...b, tenantId: req.user.tenantId, userId: req.user.id });
    this.audit.logCreate(req.user.tenantId, req.user.id, 'sale', result.id, { number: result.number, total: result.total });
    return result;
  }
  @Put(':id') async update(@Param('id') id: string, @Body() b: any, @Req() req: any) {
    const result = await this.service.update(id, req.user.tenantId, b);
    this.audit.logUpdate(req.user.tenantId, req.user.id, 'sale', id, b);
    return result;
  }
}
