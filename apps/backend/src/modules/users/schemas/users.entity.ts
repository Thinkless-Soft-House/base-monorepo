import { MyBaseEntity } from '@database/base.modal';
import { PhotoEntity } from '@modules/photos/schemas/photos.entity';
import { Column, Entity, Index, OneToMany, Relation } from 'typeorm';

@Entity('users')
export class UserEntity extends MyBaseEntity {
  @Column()
  name: string;

  @Index('idx_user_email_unique', { unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => PhotoEntity, (photo) => photo.user)
  photos: Relation<PhotoEntity[]>;
}
