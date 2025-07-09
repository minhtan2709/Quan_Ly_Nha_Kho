import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { OutboundService } from './outbound.service';
import { Roles } from '@auth/decorator/role.decorator';
import { RolesGuard } from '@auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('outbounds')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OutboundController {
  constructor(private readonly outboundService: OutboundService) {}

  @Get()
  findAll() { return this.outboundService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.outboundService.findOne(id); }

  @Post()
  @Roles('ADMIN', 'STAFF')
  create(@Body() body: any) { return this.outboundService.create(body); }
}
