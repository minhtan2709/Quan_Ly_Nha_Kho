import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboundReceipt } from './entity/outbound-receipt.entity';
import { OutboundDetail } from './entity/outbound-detail.entity';
import { OutboundService } from './outbound.service';
import { OutboundController } from './outbound.controller';
import { Prisma } from 'generated/prisma'; // Importing PrismaModule for database access
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OutboundService],
  controllers: [OutboundController]
})
export class OutboundModule {}
