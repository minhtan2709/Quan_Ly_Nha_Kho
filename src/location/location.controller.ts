import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { Roles } from '../auth/decorator/role.decorator';
import { RolesGuard } from '../auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('locations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll() { return this.locationService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.locationService.findOne(id); }

  @Post()
  @Roles('ADMIN', 'STAFF')
  create(@Body() body: any) { return this.locationService.create(body); }

  @Put(':id')
  @Roles('ADMIN', 'STAFF')
  update(@Param('id') id: number, @Body() body: any) { return this.locationService.update(id, body); }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: number) { return this.locationService.remove(id); }
}
