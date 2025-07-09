import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionLog } from './entity/transaction-log.entity';

@Injectable()
export class LogService {
  constructor(@InjectRepository(TransactionLog) private repo: Repository<TransactionLog>) {}

  findAll(query: any) {
    // Bạn có thể thêm điều kiện filter ở đây
    return this.repo.find({ where: query, relations: ['user'] });
  }
}
