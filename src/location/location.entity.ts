import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WarehouseLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  parentId: number;
}
