import { MyBaseEntity } from '@database/base.modal';
import { Column, Entity, Index } from 'typeorm';

@Entity('users')
export class UserEntity extends MyBaseEntity {
  @Column()
  name: string;

  @Index({
    unique: true,
  })
  @Column()
  email: string;

  @Column()
  password: string;
}
