import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.userService.findAll(req.user.tenantId);
  }

  @Get('me')
  async me(@Req() req: any) {
    return this.userService.findById(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  async create(@Body() data: any, @Req() req: any) {
    return this.userService.create({ ...data, tenantId: req.user.tenantId });
  }
}