import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('backup')
@UseGuards(JwtAuthGuard)
export class BackupController {
  constructor(private readonly service: BackupService) {}

  @Get()
  getBackups(@Req() req: any) {
    return this.service.getBackups(req.user.tenantId);
  }

  @Post()
  createBackup(@Req() req: any) {
    return this.service.createBackup(req.user.tenantId, req.user.id);
  }
}