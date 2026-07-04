import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { LoginRequest, LoginResponse } from '@ferramenta/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async login(dto: LoginRequest, ip?: string, userAgent?: string): Promise<LoginResponse> {
    const login = dto.login.toLowerCase().trim();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: login, mode: 'insensitive' } },
          { name: { equals: login, mode: 'insensitive' } },
        ],
        status: 'ativo',
      },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(`Conta bloqueada. Tente novamente em ${minutes} minutos.`);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      const attempts = user.loginAttempts + 1;
      const lockedUntil = attempts >= 5 ? new Date(Date.now() + 30 * 60000) : null;
      await this.prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: attempts, lockedUntil },
      });
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    if (user.status !== 'ativo') {
      throw new UnauthorizedException('Usuário inativo ou bloqueado.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date(), lastLoginIp: ip },
    });

    const tenants = await this.prisma.tenant.findMany({
      where: { id: dto.tenantId || user.tenantId, status: 'ativo', users: { some: { id: user.id } } },
      select: { id: true, name: true, businessType: true },
    });

    if (tenants.length === 0) {
      throw new UnauthorizedException('Nenhuma empresa disponível para este usuário.');
    }

    const selectedTenant = dto.tenantId ? tenants.find(t => t.id === dto.tenantId) : tenants[0];
    if (!selectedTenant) {
      throw new UnauthorizedException('Empresa não encontrada ou sem acesso.');
    }

    const tokens = await this.generateTokens(user.id, selectedTenant.id, ip, userAgent);

    this.eventEmitter.emit('user.login', { userId: user.id, tenantId: selectedTenant.id, ip });

    return {
      user: {
        id: user.id, name: user.name, email: user.email,
        avatar: user.avatar ?? undefined, role: user.role,
        tenantId: selectedTenant.id, tenantName: selectedTenant.name,
      },
      tokens,
      tenants: tenants.map(t => ({ id: t.id, name: t.name, businessType: t.businessType })),
    };
  }

  async refreshToken(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken }, include: { user: true, tenant: true },
    });
    if (!session) throw new UnauthorizedException('Refresh token inválido.');
    if (session.expiresAt < new Date()) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedException('Refresh token expirado.');
    }
    if (session.user.status !== 'ativo') throw new UnauthorizedException('Usuário inativo.');
    await this.prisma.session.delete({ where: { id: session.id } });
    return this.generateTokens(session.userId, session.tenantId, session.ip || undefined, session.userAgent || undefined);
  }

  async logout(userId: string, tenantId: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { userId, tenantId } });
  }

  async validateTenantAccess(userId: string, tenantId: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { id: userId, tenantId, status: 'ativo' } });
    return count > 0;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado.');
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new BadRequestException('Senha atual incorreta.');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    await this.prisma.session.deleteMany({ where: { userId } });
    this.eventEmitter.emit('user.password_changed', { userId });
  }

  private async generateTokens(userId: string, tenantId: string, ip?: string, userAgent?: string) {
    const payload = { sub: userId, tenantId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: (process.env.JWT_EXPIRATION || '15m') as any });
    const refreshToken = uuid();
    await this.prisma.session.create({
      data: { userId, tenantId, token: accessToken, refreshToken, ip, userAgent, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    return { accessToken, refreshToken, expiresIn: 15 * 60 };
  }
}