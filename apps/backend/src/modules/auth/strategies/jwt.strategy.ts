// ──── JWT Strategy (Passport) ────

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../database/prisma.service';

interface JwtPayload {
  sub: string;
  tenantId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'ferramenta-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        tenant: { select: { id: true, name: true, businessType: true, status: true } },
        userProgress: { select: { experienceLevel: true } },
      },
    });

    if (!user || user.status !== 'ativo') {
      throw new UnauthorizedException('Usuário não encontrado ou inativo.');
    }

    if (user.tenant.status !== 'ativo') {
      throw new UnauthorizedException('Empresa inativa.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenant.name,
      businessType: user.tenant.businessType,
      experienceLevel: user.userProgress?.experienceLevel || 'iniciante',
      preferences: user.preferences,
    };
  }
}