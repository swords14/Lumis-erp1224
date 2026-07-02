import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { SaleService } from './sale.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SaleController {
  constructor(private readonly service: SaleService) {}
  @Get() findAll(@Query() q: any, @Req() req: any) { return this.service.findAll(req.user.tenantId, q); }
  @Get(':id') findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user.tenantId); }
  @Post() create(@Body() b: any, @Req() req: any) { return this.service.create({ ...b, tenantId: req.user.tenantId, userId: req.user.id }); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any, @Req() req: any) { return this.service.update(id, req.user.tenantId, b); }
}