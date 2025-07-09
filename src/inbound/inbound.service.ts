import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InboundReceipt } from './entity/inbound-receipt.entity';

@Injectable()
export class InboundService {
  constructor(@InjectRepository(InboundReceipt) private repo: Repository<InboundReceipt>) {}

  findAll() { return this.repo.find({ relations: ['details'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id }, relations: ['details'] }); }
  create(data: any) { return this.repo.save(data); }
}
