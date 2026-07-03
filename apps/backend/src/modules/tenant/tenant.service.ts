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
      include: { contacts: true },
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

    // Cria tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: data.name,
        fantasyName: data.fantasyName,
        document: data.document,
        businessType: data.businessType,
        config: { timezone: 'America/Sao_Paulo', language: 'pt-BR', currency: 'BRL' },
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

    // Cria admin user com progress separadamente
    await this.prisma.user.create({
      data: {
        name: data.adminName,
        email: data.adminEmail,
        passwordHash: await bcrypt.hash(data.adminPassword, 12),
        role: 'admin',
        tenantId: tenant.id,
        preferences: { theme: 'system', sidebarCollapsed: false, language: 'pt-BR' },
        userProgress: {
          create: {
            experienceLevel: 'iniciante',
            points: 0,
            tenantId: tenant.id,
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

  async update(tenantId: string, data: any) {
    // Extrai contacts e address para criar/atualizar separadamente
    const { contacts, address, ...tenantData } = data;
    const updateData: any = { ...tenantData };

    if (address) {
      // Upsert do endereço
      updateData.address = {
        upsert: {
          create: { ...address, country: address.country || 'Brasil', type: 'comercial', isDefault: true },
          update: { ...address },
        },
      };
    }

    if (contacts && contacts.length > 0) {
      // Remove contatos antigos e cria novos (simplificado)
      const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId }, include: { contacts: true } });
      if (tenant) {
        await this.prisma.contact.deleteMany({ where: { tenantId } });
        await this.prisma.contact.createMany({
          data: contacts.map((c: any) => ({ ...c, tenantId })),
        });
      }
    }

    return this.prisma.tenant.update({ where: { id: tenantId }, data: updateData });
  }
}
