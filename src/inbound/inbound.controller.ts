import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { InboundService } from './inbound.service';
import { Roles } from '@auth/decorator/role.decorator';
import { RolesGuard } from '@auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('inbounds')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InboundController {
  constructor(private readonly inboundService: InboundService) {}

  @Get()
  findAll() { return this.inboundService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.inboundService.findOne(id); }

  @Post()
  @Roles('ADMIN', 'STAFF')
  create(@Body() body: any) { return this.inboundService.create(body); }
}
