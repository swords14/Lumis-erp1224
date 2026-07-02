import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('financial')
@UseGuards(JwtAuthGuard)
export class FinancialController {
  constructor(private readonly service: FinancialService) {}

  @Get('accounts')
  getAccounts(@Req() req: any) { return this.service.getAccounts(req.user.tenantId); }

  @Get('transactions')
  getTransactions(@Query() q: any, @Req() req: any) { return this.service.getTransactions(req.user.tenantId, q); }

  @Post('transactions')
  createTransaction(@Body() b: any, @Req() req: any) { return this.service.createTransaction({ ...b, tenantId: req.user.tenantId, userId: req.user.id }); }

  @Put('transactions/:id')
  updateTransaction(@Param('id') id: string, @Body() b: any, @Req() req: any) { return this.service.updateTransaction(id, req.user.tenantId, b); }

  @Get('stats')
  getStats(@Req() req: any) { return this.service.getStats(req.user.tenantId); }
}