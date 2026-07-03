import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BackupService {
  constructor(private prisma: PrismaService) {}

  async getBackups(tenantId: string) {
    const backups = await this.prisma.backup.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    // Converte BigInt size para Number (serialização JSON)
    return backups.map(b => ({ ...b, size: Number(b.size) }));
  }

  async createBackup(tenantId: string, userId: string) {
    const filename = `backup_${tenantId.slice(0, 8)}_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.sql`;
    const backup = await this.prisma.backup.create({
      data: {
        tenantId,
        filename,
        size: 0,
        type: 'manual',
        status: 'concluido',
      },
    });
    return { ...backup, size: Number(backup.size) };
  }
}