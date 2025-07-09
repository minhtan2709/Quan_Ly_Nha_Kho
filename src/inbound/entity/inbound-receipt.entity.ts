import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { InboundDetail } from './inbound-detail.entity';
import { User } from '@user/entity/user.entity';

@Entity()
export class InboundReceipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  supplier: string;

  @Column()
  createdBy: number;

  @Column({ default: () => 'now()' })
  createdAt: Date;

  @Column()
  status: string;

  @OneToMany(() => InboundDetail, detail => detail.receipt)
  details: InboundDetail[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  user: User;
}
