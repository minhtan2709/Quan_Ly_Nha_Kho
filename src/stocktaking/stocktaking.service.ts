import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StocktakingService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    try {
      const stocktakings = await this.prisma.stocktaking.findMany();
      console.log('Stocktakings:', stocktakings);
      return stocktakings;
    } catch (error) {
      console.error('[StocktakingService.findAll] ERROR:', error);
      throw error;
    }
  }


  async findOne(id: number) {
    return this.prisma.stocktaking.findUnique({ where: { id }, include: { details: true, user: true } });
  }

  async create(data: any) {
    // Bạn có thể kiểm tra dữ liệu, validate, etc.
    return this.prisma.stocktaking.create({ data });
  }
}
