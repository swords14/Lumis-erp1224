import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PersonService } from './person.service';
import { AuditService } from '../audit/audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('people')
@UseGuards(JwtAuthGuard)
export class PersonController {
  constructor(private readonly service: PersonService, private readonly audit: AuditService) {}

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
    const result = await this.service.create({ ...body, tenantId: req.user.tenantId });
    this.audit.logCreate(req.user.tenantId, req.user.id, 'person', result.id, { name: result.name, isCustomer: result.isCustomer, isSupplier: result.isSupplier });
    return result;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const result = await this.service.update(id, req.user.tenantId, body);
    this.audit.logUpdate(req.user.tenantId, req.user.id, 'person', id, body);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const result = await this.service.remove(id, req.user.tenantId);
    this.audit.logDelete(req.user.tenantId, req.user.id, 'person', id);
    return result;
  }
}