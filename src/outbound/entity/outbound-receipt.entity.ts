import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OutboundDetail } from './outbound-detail.entity';
import { User } from '@user/entity/user.entity';

@Entity()
export class OutboundReceipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  customer: string;

  @Column()
  createdBy: number;

  @Column({ default: () => 'now()' })
  createdAt: Date;

  @Column()
  status: string;

  @OneToMany(() => OutboundDetail, detail => detail.receipt)
  details: OutboundDetail[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  user: User;
}
