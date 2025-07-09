import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InboundReceipt } from './inbound-receipt.entity';
import { Product } from 'src/product/product.entity';
import { WarehouseLocation } from 'src/location/location.entity';

@Entity()
export class InboundDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  receiptId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column('float')
  unitPrice: number;

  @Column()
  locationId: number;

  @ManyToOne(() => InboundReceipt, receipt => receipt.details)
  @JoinColumn({ name: 'receiptId' })
  receipt: InboundReceipt;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => WarehouseLocation)
  @JoinColumn({ name: 'locationId' })
  location: WarehouseLocation;
}
