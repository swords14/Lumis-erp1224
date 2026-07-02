import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { search, page = 1, limit = 20 } = query;
    const where: any = { tenantId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { fantasyName: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.person.findMany({ where, skip: (page - 1) * limit, take: +limit, orderBy: { name: 'asc' }, include: { contacts: true, documents: true } }),
      this.prisma.person.count({ where }),
    ]);
    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit), hasNext: +page * +limit < total, hasPrevious: +page > 1 } };
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.person.findFirst({ where: { id, tenantId }, include: { contacts: true, documents: true, addresses: true } });
  }

  async create(data: any) {
    return this.prisma.person.create({ data: { ...data, contacts: data.contacts ? { create: data.contacts } : undefined, addresses: data.addresses ? { create: data.addresses } : undefined, documents: data.documents ? { create: data.documents } : undefined } });
  }

  async update(id: string, tenantId: string, data: any) {
    return this.prisma.person.updateMany({ where: { id, tenantId }, data });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.person.updateMany({ where: { id, tenantId }, data: { status: 'excluido' } });
  }
}