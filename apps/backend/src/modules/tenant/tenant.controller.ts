import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.tenantService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    return this.tenantService.findById(req.user.tenantId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.tenantService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any) {
    return this.tenantService.create(data);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Body() body: any, @Req() req: any) {
    return this.tenantService.update(req.user.tenantId, body);
  }
}