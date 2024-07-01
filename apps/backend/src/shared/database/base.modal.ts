import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface BaseModel {
  id: string;

  createdAt: Date;
  updatedAt: Date;
}

export class MyBaseEntity extends BaseEntity implements BaseModel {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
