import { Injectable } from '@nestjs/common';
import { UserEntity } from './schemas/users.entity';
import { CrudService } from '@crud/services/crud.service';
import { CreateUserDTO, UpdateUserDTO } from './schemas/users.dto';
import { UsersRepository } from './schemas/users.repository';

@Injectable()
export class UsersService extends CrudService<
  UserEntity,
  CreateUserDTO,
  UpdateUserDTO,
  UsersRepository
> {
  constructor(private usersRepository: UsersRepository) {
    super('users', usersRepository, {});
  }
}
