import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { LessThan } from 'typeorm';
@Injectable()
export class ReportService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async stockReport() {
    // Báo cáo tồn kho
    return this.repo.find();
  }

  async lowStockReport(threshold = 10) {
    return this.repo.find({ where: { quantity: LessThan(threshold) } });
  }
}
