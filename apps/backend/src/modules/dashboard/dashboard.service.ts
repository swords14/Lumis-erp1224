import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { subDays, startOfMonth, format } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const prevMonthStart = startOfMonth(subDays(monthStart, 1));
    const sevenDaysAgo = subDays(now, 7);

    const [
      salesCount, customersCount, productsCount, revenue,
      pendingCount, todayRevenue, todayCount,
      monthlyRevenue, prevMonthlyRevenue,
      recentSales, recentCustomers,
    ] = await Promise.all([
      this.prisma.sale.count({ where: { tenantId } }),
      this.prisma.person.count({ where: { tenantId, isCustomer: true } }),
      this.prisma.product.count({ where: { tenantId, isActive: true } }),
      this.prisma.sale.aggregate({ where: { tenantId, status: { not: 'cancelado' } }, _sum: { total: true } }),
      this.prisma.sale.count({ where: { tenantId, status: 'pendente' } }),
      this.prisma.sale.aggregate({
        where: { tenantId, status: { not: 'cancelado' }, createdAt: { gte: new Date(format(now, 'yyyy-MM-dd') + 'T00:00:00Z') } },
        _sum: { total: true },
      }),
      this.prisma.sale.count({
        where: { tenantId, createdAt: { gte: new Date(format(now, 'yyyy-MM-dd') + 'T00:00:00Z') } },
      }),
      this.prisma.sale.aggregate({
        where: { tenantId, status: { not: 'cancelado' }, createdAt: { gte: monthStart } },
        _sum: { total: true },
      }),
      this.prisma.sale.aggregate({
        where: { tenantId, status: { not: 'cancelado' }, createdAt: { gte: prevMonthStart, lt: monthStart } },
        _sum: { total: true },
      }),
      this.prisma.sale.findMany({ where: { tenantId }, take: 5, orderBy: { createdAt: 'desc' }, include: { customer: true } }),
      this.prisma.person.findMany({ where: { tenantId, isCustomer: true }, take: 5, orderBy: { createdAt: 'desc' }, include: { contacts: true } }),
    ]);

    // Daily sales for last 7 days
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const day = subDays(now, i);
      const dayStr = format(day, 'yyyy-MM-dd');
      const nextDayStr = format(subDays(day, -1), 'yyyy-MM-dd');
      const dayRevenue = await this.prisma.sale.aggregate({
        where: {
          tenantId,
          status: { not: 'cancelado' },
          createdAt: { gte: new Date(dayStr + 'T00:00:00Z'), lt: new Date(nextDayStr + 'T00:00:00Z') },
        },
        _sum: { total: true },
      });
      const dayCount = await this.prisma.sale.count({
        where: {
          tenantId,
          createdAt: { gte: new Date(dayStr + 'T00:00:00Z'), lt: new Date(nextDayStr + 'T00:00:00Z') },
        },
      });
      dailySales.push({
        date: format(day, 'dd/MM'),
        value: dayRevenue._sum.total || 0,
        count: dayCount,
      });
    }

    const monthTotal = monthlyRevenue._sum.total || 0;
    const prevMonthTotal = prevMonthlyRevenue._sum.total || 0;
    const changePercent = prevMonthTotal > 0
      ? ((monthTotal - prevMonthTotal) / prevMonthTotal * 100)
      : monthTotal > 0 ? 100 : 0;

    return {
      salesCount,
      customersCount,
      productsCount,
      revenue: revenue._sum.total || 0,
      pendingCount,
      todayRevenue: todayRevenue._sum.total || 0,
      todayCount,
      monthlyRevenue: monthTotal,
      prevMonthlyRevenue: prevMonthTotal,
      changePercent: Math.round(changePercent * 10) / 10,
      dailySales,
      recentSales: recentSales.map(s => ({
        id: s.id, number: s.number,
        customer: s.customer?.name,
        total: s.total, status: s.status,
      })),
      recentCustomers: recentCustomers.map(c => ({
        id: c.id, name: c.name,
        email: c.contacts?.[0]?.value,
      })),
    };
  }
}