import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getMovements(tenantId: string, query: any) {
    const { page = 1, limit = 100 } = query;
    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({ where: { tenantId }, skip: (+page - 1) * +limit, take: +limit, orderBy: { createdAt: 'desc' }, include: { product: true } }),
      this.prisma.stockMovement.count({ where: { tenantId } }),
    ]);
    return { data, meta: { total, page: +page, limit: +limit } };
  }

  async createMovement(data: any) {
    const movement = await this.prisma.stockMovement.create({ data });
    // Update product stock
    if (movement.productId) {
      const delta = movement.type === 'entrada' ? movement.quantity : -movement.quantity;
      await this.prisma.product.update({ where: { id: movement.productId }, data: { currentStock: { increment: delta } } });
    }
    return movement;
  }
}