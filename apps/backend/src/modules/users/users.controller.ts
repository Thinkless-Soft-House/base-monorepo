import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CrudController } from '@crud/controllers/crud.controller';
import { UserEntity } from './schemas/users.entity';
import { CreateUserDTO, SetUserDTO, UpdateUserDTO } from './schemas/users.dto';
import { ConfigService } from '@nestjs/config';
import { CustomCacheInterceptor } from '@interceptors/custom-cache.interceptor';
@UseInterceptors(CustomCacheInterceptor)
@Controller('users')
export class UsersController extends CrudController<
  UserEntity,
  UsersService,
  CreateUserDTO,
  SetUserDTO,
  UpdateUserDTO
> {
  constructor(
    private usersService: UsersService,
    cs: ConfigService,
  ) {
    super(usersService, cs, CreateUserDTO, SetUserDTO, UpdateUserDTO);
  }

  @Get('photos/:id')
  async getWithPhotos(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.getWithPhotos(id);
  }
}
