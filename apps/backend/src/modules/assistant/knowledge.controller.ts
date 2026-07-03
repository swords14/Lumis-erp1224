import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('knowledge')
@UseGuards(JwtAuthGuard)
export class KnowledgeController {
  constructor(private readonly service: KnowledgeService) {}

  @Get('search')
  search(@Query('q') q: string, @Req() req: any) {
    return this.service.search(req.user.tenantId, q || '');
  }
}