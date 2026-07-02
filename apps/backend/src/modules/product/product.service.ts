import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { search, page = 1, limit = 20 } = query;
    const where: any = { tenantId, isActive: true };
    if (search) { where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }]; }
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip: (+page - 1) * +limit, take: +limit, orderBy: { name: 'asc' } }),
      this.prisma.product.count({ where }),
    ]);
    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit), hasNext: +page * +limit < total, hasPrevious: +page > 1 } };
  }

  async findOne(id: string, tenantId: string) { return this.prisma.product.findFirst({ where: { id, tenantId } }); }
  async create(data: any) { return this.prisma.product.create({ data }); }
  async update(id: string, tenantId: string, data: any) { return this.prisma.product.updateMany({ where: { id, tenantId }, data }); }
  async remove(id: string, tenantId: string) { return this.prisma.product.updateMany({ where: { id, tenantId }, data: { isActive: false } }); }
}