import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { StocktakingService } from './stocktaking.service';
import { Roles } from '@auth/decorator/role.decorator';
import { RolesGuard } from '@auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('stocktakings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StocktakingController {
  constructor(private readonly stocktakingService: StocktakingService) {}

  @Get()
  findAll() { return this.stocktakingService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.stocktakingService.findOne(id); }

  @Post()
  @Roles('ADMIN', 'STAFF')
  create(@Body() body: any) { return this.stocktakingService.create(body); }
}
