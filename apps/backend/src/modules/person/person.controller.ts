import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PersonService } from './person.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('people')
@UseGuards(JwtAuthGuard)
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Get()
  async findAll(@Query() query: any, @Req() req: any) {
    return this.service.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    return this.service.create({ ...body, tenantId: req.user.tenantId });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.update(id, req.user.tenantId, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user.tenantId);
  }
}