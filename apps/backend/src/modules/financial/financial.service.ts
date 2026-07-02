import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FinancialService {
  constructor(private prisma: PrismaService) {}

  async getAccounts(tenantId: string) {
    return this.prisma.financialAccount.findMany({ where: { tenantId, isActive: true } });
  }

  async getTransactions(tenantId: string, query: any) {
    const { page = 1, limit = 20 } = query;
    const where: any = { tenantId };
    const [data, total] = await Promise.all([
      this.prisma.financialTransaction.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' }, include: { account: true, person: true } }),
      this.prisma.financialTransaction.count({ where }),
    ]);
    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) } };
  }

  async createTransaction(data: any) {
    return this.prisma.financialTransaction.create({ data });
  }

  async updateTransaction(id: string, tenantId: string, data: any) {
    return this.prisma.financialTransaction.updateMany({ where: { id, tenantId }, data });
  }

  async getStats(tenantId: string) {
    const [revenue, expenses] = await Promise.all([
      this.prisma.financialTransaction.aggregate({ where: { tenantId, category: 'receita' }, _sum: { amount: true } }),
      this.prisma.financialTransaction.aggregate({ where: { tenantId, category: 'despesa' }, _sum: { amount: true } }),
    ]);
    return { balance: (revenue._sum.amount || 0) - (expenses._sum.amount || 0), revenue: revenue._sum.amount || 0, expenses: expenses._sum.amount || 0 };
  }
}