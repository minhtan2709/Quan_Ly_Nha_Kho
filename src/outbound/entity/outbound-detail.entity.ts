import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OutboundReceipt } from './outbound-receipt.entity';
import { Product } from 'src/product/product.entity';
import { WarehouseLocation } from 'src/location/location.entity';

@Entity()
export class OutboundDetail {
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

  @ManyToOne(() => OutboundReceipt, receipt => receipt.details)
  @JoinColumn({ name: 'receiptId' })
  receipt: OutboundReceipt;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => WarehouseLocation)
  @JoinColumn({ name: 'locationId' })
  location: WarehouseLocation;
}
