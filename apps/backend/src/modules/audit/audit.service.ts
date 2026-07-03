import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  log(tenantId: string, userId: string, action: string, resource: string, resourceId?: string, details?: any) {
    this.prisma.$executeRaw`
      INSERT INTO audit_logs (id, tenant_id, user_id, action, resource, resource_id, details, created_at)
      VALUES (gen_random_uuid(), ${tenantId}, ${userId}, ${action}, ${resource}, ${resourceId || null}, ${JSON.stringify(details || {})}, NOW())
    `.catch(err => console.error('Audit log error:', err));
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
    const offset = (page - 1) * limit;
    const [total, logs] = await Promise.all([
      this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
        'SELECT COUNT(*) as count FROM audit_logs WHERE tenant_id = $1', tenantId
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        'SELECT al.*, u.name as user_name FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id WHERE al.tenant_id = $1 ORDER BY al.created_at DESC LIMIT $2 OFFSET $3',
        tenantId, limit, offset
      ),
    ]);
    return { data: logs, total: Number(total[0]?.count || 0), page, limit };
  }
}