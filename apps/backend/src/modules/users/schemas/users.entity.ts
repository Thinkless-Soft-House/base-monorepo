import { MyBaseEntity } from '@database/base.modal';
import { Column, Entity, Index } from 'typeorm';

@Entity('users')
export class UserEntity extends MyBaseEntity {
  @Column()
  name: string;

  @Index('idx_user_email_unique', { unique: true })
  @Column()
  email: string;

  @Column()
  password: string;
}
