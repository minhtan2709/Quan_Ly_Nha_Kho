import { UpdateDateColumn, CreateDateColumn } from "typeorm";

export class BaseEntity {

  @CreateDateColumn({name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

}
