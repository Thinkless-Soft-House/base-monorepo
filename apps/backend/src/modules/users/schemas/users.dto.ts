import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from './users.model';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDTO implements Partial<User> {
  @IsString({ message: 'Nome deve ser uma string' })
  //   @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Transform(({ value }) => value.trim())
  password: string;

  constructor(partial: Partial<CreateUserDTO> = {}) {
    Object.assign(this, partial);
  }
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
