import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get('movements')
  getMovements(@Query() q: any, @Req() req: any) {
    return this.service.getMovements(req.user.tenantId, q);
  }

  @Post('movements')
  createMovement(@Body() b: any, @Req() req: any) {
    return this.service.createMovement({ ...b, tenantId: req.user.tenantId, userId: req.user.id });
  }
}