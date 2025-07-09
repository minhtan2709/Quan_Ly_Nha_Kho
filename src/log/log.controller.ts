import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { Roles } from '@auth/decorator/role.decorator';
import { RolesGuard } from '@auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @Roles('ADMIN', 'STAFF')
  findAll(@Query() query: any) {
    return this.logService.findAll(query);
  }
}
