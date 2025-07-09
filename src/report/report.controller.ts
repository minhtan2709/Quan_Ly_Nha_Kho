import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { Roles } from '@auth/decorator/role.decorator';
import { RolesGuard } from '@auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('stock')
  findStock() { return this.reportService.stockReport(); }

  @Get('low-stock')
  findLowStock() { return this.reportService.lowStockReport(); }
}
