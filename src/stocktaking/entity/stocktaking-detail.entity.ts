import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Stocktaking } from './stocktaking.entity';
import { Product } from 'src/product/product.entity';
import { WarehouseLocation } from 'src/location/location.entity';

@Entity()
export class StocktakingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stocktakingId: number;

  @Column()
  productId: number;

  @Column()
  actualQuantity: number;

  @Column()
  systemQuantity: number;

  @Column()
  difference: number;

  @Column()
  locationId: number;

  @ManyToOne(() => Stocktaking, stocktaking => stocktaking.details)
  @JoinColumn({ name: 'stocktakingId' })
  stocktaking: Stocktaking;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => WarehouseLocation)
  @JoinColumn({ name: 'locationId' })
  location: WarehouseLocation;
}
