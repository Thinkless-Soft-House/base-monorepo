import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CrudController } from '@crud/controllers/crud.controller';
import { UserEntity } from './schemas/users.entity';
import { CreateUserDTO, SetUserDTO, UpdateUserDTO } from './schemas/users.dto';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController extends CrudController<
  UserEntity,
  UsersService,
  CreateUserDTO,
  SetUserDTO,
  UpdateUserDTO
> {
  constructor(usersService: UsersService, cs: ConfigService) {
    super(usersService, cs, CreateUserDTO, SetUserDTO, UpdateUserDTO);
  }
}
