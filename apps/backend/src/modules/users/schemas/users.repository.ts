import { CrudRepository } from '@crud/repository/crud.repository';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { CreateUserDTO, SetUserDTO, UpdateUserDTO } from './users.dto';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UsersRepository extends CrudRepository<
  UserEntity,
  CreateUserDTO,
  SetUserDTO,
  UpdateUserDTO
> {
  constructor(datasource: DataSource, @Inject(REQUEST) request: Request) {
    super(datasource, request, 'users', UserEntity, {});
  }

  async getWithPhotos(id: number): Promise<UserEntity> {
    return this.getRepository(UserEntity)
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.photos', 'photos')
      .where('users.id = :id', { id })
      .getOne();
  }
}
