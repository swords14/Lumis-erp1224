import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly service: ProductService) {}
  @Get() findAll(@Query() q: any, @Req() req: any) { return this.service.findAll(req.user.tenantId, q); }
  @Get(':id') findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user.tenantId); }
  @Post() create(@Body() b: any, @Req() req: any) { return this.service.create({ ...b, tenantId: req.user.tenantId }); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any, @Req() req: any) { return this.service.update(id, req.user.tenantId, b); }
  @Delete(':id') remove(@Param('id') id: string, @Req() req: any) { return this.service.remove(id, req.user.tenantId); }
}