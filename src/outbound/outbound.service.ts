import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOutboundDto } from './dto/create-outbound.dto';

@Injectable()
export class OutboundService {
  constructor(private readonly prisma: PrismaService) {}

  // Lấy tất cả phiếu xuất kho (có chi tiết)
  async findAll() {
    return this.prisma.outboundReceipt.findMany({
      include: { details: true, user: true }
    });
  }
  async findOne(id: number) {
    return this.prisma.outboundReceipt.findUnique({
      where: { id },
      include: { details: true, user: true }, // có thể thêm nếu muốn lấy luôn chi tiết và user tạo phiếu
    });
  }

  // Tạo mới phiếu xuất kho (bao gồm chi tiết)
  async create(dto: CreateOutboundDto) {
    // Kiểm tra tồn kho cho từng mặt hàng
    for (const item of dto.details) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || product.quantity < item.quantity) {
        throw new BadRequestException(`Sản phẩm ${item.productId} không đủ tồn kho`);
      }
    }

    // Tạo phiếu xuất và các chi tiết
    const outboundReceipt = await this.prisma.outboundReceipt.create({
      data: {
        code: dto.code,
        customer: dto.customer,
        createdBy: dto.createdBy,
        status: dto.status ?? 'pending',
        details: {
          create: dto.details.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            locationId: item.locationId
          }))
        }
      },
      include: { details: true }
    });

    return outboundReceipt;
  }

  // Xác nhận phiếu xuất: trừ tồn kho, đổi trạng thái
  async confirm(id: number) {
    const receipt = await this.prisma.outboundReceipt.findUnique({
      where: { id },
      include: { details: true }
    });

    if (!receipt || receipt.status !== 'pending') {
      throw new BadRequestException('Phiếu xuất không hợp lệ hoặc đã xác nhận');
    }

    // Trừ tồn kho
    for (const detail of receipt.details) {
      await this.prisma.product.update({
        where: { id: detail.productId },
        data: { quantity: { decrement: detail.quantity } }
      });
    }

    // Update trạng thái
    await this.prisma.outboundReceipt.update({
      where: { id },
      data: { status: 'completed' }
    });

    return { message: 'Xác nhận xuất kho thành công' };
  }
}
