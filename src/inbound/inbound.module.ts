import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboundReceipt } from './entity/inbound-receipt.entity';
import { InboundDetail } from './entity/inbound-detail.entity';
import { InboundService } from './inbound.service';
import { InboundController } from './inbound.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InboundReceipt, InboundDetail])],
  providers: [InboundService],
  controllers: [InboundController]
})
export class InboundModule {}
