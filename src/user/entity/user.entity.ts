// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'varchar', length:20 ,unique: true })
  username: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  password: string; // Mật khẩu đã mã hóa

  @Column({ type:'varchar',nullable: false, unique: true })
  email: string;

  @Column()
  role: string; // Ví dụ: 'admin', 'manager', 'staff'

  @Column({ default: 'active' })
  status: string; // Trạng thái tài khoản

  @Column({ name: "phone_number", length: 10, nullable: false })
  phone_number: string; // Số điện thoại
  
  @Column()
  salt: string;


}
