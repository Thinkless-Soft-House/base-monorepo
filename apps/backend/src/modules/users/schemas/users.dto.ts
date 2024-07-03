import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { User } from './users.model';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDTO implements Partial<User> {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Transform(({ value }) => value.trim())
  password: string;
}

export class SetUserDTO {
  @IsOptional()
  @IsNumber({}, { message: 'Id deve ser um número' })
  id: number;

  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ValidateIf((o) => !o.id)
  @IsString({ message: 'Senha deve ser uma string' })
  @IsOptional()
  @Transform(({ value, obj }) => (obj.id ? undefined : value.trim()))
  password?: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @IsNumber({}, { message: 'Id deve ser um número' })
  id: number;

  @Transform(() => undefined)
  password?: string;
}
