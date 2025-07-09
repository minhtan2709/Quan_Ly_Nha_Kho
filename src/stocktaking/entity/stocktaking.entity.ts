import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { StocktakingDetail } from './stocktaking-detail.entity';
import { User } from '@user/entity/user.entity';

@Entity()
export class Stocktaking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdBy: number;

  @Column({ default: () => 'now()' })
  createdAt: Date;

  @Column()
  status: string;

  @OneToMany(() => StocktakingDetail, detail => detail.stocktaking)
  details: StocktakingDetail[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  user: User;
}
