import { Injectable } from '@nestjs/common';
import { UserEntity } from './schemas/users.entity';
import { CrudService } from '@crud/services/crud.service';

@Injectable()
export class UsersService extends CrudService<UserEntity, any, any> {}
