import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CrudController } from '@crud/controllers/crud.controller';
import { UserEntity } from './schemas/users.entity';

@Controller('users')
export class UsersController extends CrudController<
  UserEntity,
  UsersService,
  any,
  any
> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }
}
