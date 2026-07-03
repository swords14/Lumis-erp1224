import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Create audit_logs table if it doesn't exist
    try {
      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id UUID NOT NULL,
          user_id UUID,
          action VARCHAR(50) NOT NULL,
          resource VARCHAR(100) NOT NULL,
          resource_id UUID,
          details JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      await this.prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_logs(tenant_id, created_at DESC)`);
      await this.prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id)`);
    } catch (e: any) {
      console.warn('Audit table creation skipped (may already exist):', e.message);
    }
  }

  log(tenantId: string, userId: string, action: string, resource: string, resourceId?: string, details?: any) {
    try {
      const detailJson = details ? JSON.stringify(details) : '{}';
      this.prisma.$executeRawUnsafe(
        `INSERT INTO audit_logs (id, tenant_id, user_id, action, resource, resource_id, details, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())`,
        tenantId, userId, action, resource, resourceId || null, detailJson
      ).catch(err => console.error('Audit log error:', err.message));
    } catch (e: any) {
      console.error('Audit log error:', e.message);
    }
  }

  logCreate(tenantId: string, userId: string, resource: string, resourceId: string, data: any) {
    this.log(tenantId, userId, 'CREATE', resource, resourceId, data);
  }

  logUpdate(tenantId: string, userId: string, resource: string, resourceId: string, changes: any) {
    this.log(tenantId, userId, 'UPDATE', resource, resourceId, changes);
  }

  logDelete(tenantId: string, userId: string, resource: string, resourceId: string) {
    this.log(tenantId, userId, 'DELETE', resource, resourceId, {});
  }

  async getLogs(tenantId: string, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const countResult = await this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
        'SELECT COUNT(*) as count FROM audit_logs WHERE tenant_id = $1',
        tenantId
      );
      const logs = await this.prisma.$queryRawUnsafe<any[]>(
        'SELECT al.*, u.name as user_name FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id WHERE al.tenant_id = $1 ORDER BY al.created_at DESC LIMIT $2 OFFSET $3',
        tenantId, limit, offset
      );
      return {
        data: logs,
        total: countResult && countResult[0] ? Number(countResult[0].count) : 0,
        page,
        limit,
      };
    } catch (e: any) {
      console.error('Audit query error:', e.message);
      return { data: [], total: 0, page, limit };
    }
  }
}