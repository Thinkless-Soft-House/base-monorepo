import { MyBaseEntity } from '@database/base.modal';
import { UserEntity } from '@modules/users/schemas/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

@Entity('photos')
export class PhotoEntity extends MyBaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.photos)
  @JoinColumn({ name: 'userId' })
  user: Relation<UserEntity>;
}
