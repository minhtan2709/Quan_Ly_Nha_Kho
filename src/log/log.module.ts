import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionLog } from './entity/transaction-log.entity';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionLog])],
  providers: [LogService],
  controllers: [LogController]
})
export class LogModule {}
