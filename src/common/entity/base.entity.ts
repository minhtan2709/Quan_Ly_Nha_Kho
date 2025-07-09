import { UpdateDateColumn, CreateDateColumn } from "typeorm";

export class BaseEntity {

  @CreateDateColumn({name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

}
