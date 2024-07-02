import { Injectable } from '@nestjs/common';
import { UserEntity } from './schemas/users.entity';
import { CrudService } from '@crud/services/crud.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class UsersService extends CrudService<UserEntity, any, any> {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super('users', manager, manager.getRepository(UserEntity));
  }

  override applyCustomFilters(
    query: SelectQueryBuilder<UserEntity>,
    filterType?: string,
  ): SelectQueryBuilder<UserEntity> {
    if (!filterType) return query;

    switch (filterType) {
      case 'email':
        query.andWhere('users.email IS NOT NULL');
        break;
      case 'firstName':
        query.andWhere('users.firstName IS NOT NULL');
        break;
      case 'longName':
        query.andWhere('LENGTH(users.name) > :length', { length: 10 });
        break;
    }
    return query;
  }
}
