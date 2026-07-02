import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import type { UUID } from '@ferramenta/shared';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: UUID) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { userProgress: true },
    });
  }

  async create(data: { name: string; email: string; password: string; role: string; tenantId: UUID }) {
    const passwordHash = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: {
        ...data,
        passwordHash,
        preferences: { theme: 'system', sidebarCollapsed: false, language: 'pt-BR' },
      },
    });
  }
}