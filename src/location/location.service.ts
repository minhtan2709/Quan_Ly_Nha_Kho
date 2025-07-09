import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseLocation } from './location.entity';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(WarehouseLocation) private repo: Repository<WarehouseLocation>) {}

  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  create(data: any) { return this.repo.save(data); }
  update(id: number, data: any) { return this.repo.update(id, data); }
  remove(id: number) { return this.repo.delete(id); }
}
