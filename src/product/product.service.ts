import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
  try {
    const products = await this.prisma.product.findMany();
    console.log('products:', products); // Thêm log này
    return products;
  } catch (error) {
    console.error('[ProductService.findAll] ERROR:', error); // Log rõ lỗi
    throw error;
  }
}


  async findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.product.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
