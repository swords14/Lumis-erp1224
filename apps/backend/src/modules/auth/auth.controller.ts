// ──── Auth Controller ────

import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { LoginRequest, LoginResponse } from '@ferramenta/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginRequest,
    @Headers('x-forwarded-for') forwardedFor?: string,
    @Headers('user-agent') userAgent?: string,
    @Req() req?: any,
  ): Promise<LoginResponse> {
    const ip = forwardedFor || req?.ip || req?.connection?.remoteAddress;
    return this.authService.login(body, ip, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.id, req.user.tenantId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    return req.user;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Req() req: any,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword,
    );
  }

  @Post('switch-tenant')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async switchTenant(
    @Req() req: any,
    @Body('tenantId') tenantId: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    const ip = forwardedFor || req?.ip;
    // Re-login com tenant específico
    return this.authService.login(
      { email: req.user.email, password: '', tenantId },
      ip,
      userAgent,
    ).catch(() => {
      // Se falhar (senha vazia), usa switch direto
      const hasAccess = this.authService.validateTenantAccess(req.user.id, tenantId);
      if (!hasAccess) {
        throw new Error('Sem acesso a esta empresa.');
      }
      return this.authService.login(
        { email: req.user.email, password: '', tenantId },
        ip,
        userAgent,
      );
    });
  }
}