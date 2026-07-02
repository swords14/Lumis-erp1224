import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const [salesCount, customersCount, productsCount, revenue] = await Promise.all([
      this.prisma.sale.count({ where: { tenantId } }),
      this.prisma.person.count({ where: { tenantId, isCustomer: true } }),
      this.prisma.product.count({ where: { tenantId, isActive: true } }),
      this.prisma.sale.aggregate({ where: { tenantId, status: { not: 'cancelado' } }, _sum: { total: true } }),
    ]);
    const [recentSales, recentCustomers] = await Promise.all([
      this.prisma.sale.findMany({ where: { tenantId }, take: 5, orderBy: { createdAt: 'desc' }, include: { customer: true } }),
      this.prisma.person.findMany({ where: { tenantId, isCustomer: true }, take: 5, orderBy: { createdAt: 'desc' }, include: { contacts: true } }),
    ]);
    return {
      salesCount,
      customersCount,
      productsCount,
      revenue: revenue._sum.total || 0,
      recentSales: recentSales.map(s => ({ id: s.id, number: s.number, customer: s.customer?.name, total: s.total, status: s.status })),
      recentCustomers: recentCustomers.map(c => ({ id: c.id, name: c.name, email: c.contacts?.[0]?.value })),
    };
  }
}