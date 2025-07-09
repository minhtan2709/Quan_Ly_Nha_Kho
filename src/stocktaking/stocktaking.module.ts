import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stocktaking } from './entity/stocktaking.entity';
import { StocktakingDetail } from './entity/stocktaking-detail.entity';
import { StocktakingService } from './stocktaking.service';
import { StocktakingController } from './stocktaking.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StocktakingService],
  controllers: [StocktakingController],
  exports: [StocktakingService]
})
export class StocktakingModule {}
