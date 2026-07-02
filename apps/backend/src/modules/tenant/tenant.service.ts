import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { UUID } from '@ferramenta/shared';

@Injectable()
export class TenantService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll() {
    return this.prisma.tenant.findMany({ where: { status: 'ativo' } });
  }

  async findById(id: UUID) {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: { address: true, contacts: true },
    });
  }

  async create(data: {
    name: string;
    fantasyName?: string;
    document?: string;
    businessType: string;
    adminEmail: string;
    adminPassword: string;
    adminName: string;
  }) {
    const exists = await this.prisma.tenant.findFirst({
      where: { document: data.document },
    });
    if (exists) throw new BadRequestException('Empresa já cadastrada.');

    const tenant = await this.prisma.tenant.create({
      data: {
        name: data.name,
        fantasyName: data.fantasyName,
        document: data.document,
        businessType: data.businessType,
        config: { timezone: 'America/Sao_Paulo', language: 'pt-BR', currency: 'BRL' },
        users: {
          create: {
            name: data.adminName,
            email: data.adminEmail,
            passwordHash: await bcrypt.hash(data.adminPassword, 12),
            role: 'admin',
            preferences: { theme: 'system', sidebarCollapsed: false, language: 'pt-BR' },
            userProgress: {
              create: { experienceLevel: 'iniciante', points: 0 },
            },
          },
        },
        roles: {
          createMany: {
            data: [
              { name: 'Admin', isSystem: true, description: 'Administrador do sistema' },
              { name: 'Gerente', isSystem: true, description: 'Gerente' },
              { name: 'Operador', isSystem: true, description: 'Operador' },
            ],
          },
        },
      },
    });

    this.eventEmitter.emit('tenant.created', {
      tenantId: tenant.id,
      tenantName: tenant.name,
      businessType: tenant.businessType,
    });

    return tenant;
  }
}