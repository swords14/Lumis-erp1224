import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SaleService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { search, page = 1, limit = 20 } = query;
    const where: any = { tenantId };
    if (search) { where.OR = [{ number: { contains: search } }]; }
    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' }, include: { customer: true, items: { include: { product: true } }, payments: true } }),
      this.prisma.sale.count({ where }),
    ]);
    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit), hasNext: +page * +limit < total, hasPrevious: +page > 1 } };
  }

  async findOne(id: string, tenantId: string) { return this.prisma.sale.findFirst({ where: { id, tenantId }, include: { customer: true, items: { include: { product: true } }, payments: true } }); }

  async create(data: any) {
    const number = `PED-${Date.now().toString(36).toUpperCase()}`;
    const items = data.items || [];
    const subtotal = items.reduce((sum: number, i: any) => sum + i.quantity * i.unitPrice, 0);
    const discount = data.discount || 0;
    const total = subtotal - discount + (data.additions || 0);
    return this.prisma.sale.create({ data: { tenantId: data.tenantId, userId: data.userId, customerId: data.customerId, number, subtotal, discount, additions: data.additions || 0, total, status: 'pendente', notes: data.notes, items: { create: items }, payments: data.payments ? { create: data.payments } : undefined } });
  }

  async update(id: string, tenantId: string, data: any) { return this.prisma.sale.updateMany({ where: { id, tenantId }, data: { status: data.status, notes: data.notes } }); }
}