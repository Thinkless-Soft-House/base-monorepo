import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { User } from './users.model';
import { Transform, Type } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  CreatePhotoDTO,
  SetPhotoDTO,
} from '@modules/photos/schemas/photos.dto';

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

  @IsArray({ message: 'Fotos deve ser um array' })
  @ValidateNested({ each: true, message: 'Fotos inválidas' })
  @Type(() => CreatePhotoDTO)
  @IsOptional()
  photos?: CreatePhotoDTO[];
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

  @IsArray({ message: 'Fotos deve ser um array' })
  @ValidateNested({ each: true, message: 'Fotos inválidas' })
  @Type(() => SetPhotoDTO)
  @IsOptional()
  photos?: SetPhotoDTO[];
}

export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, ['photos']),
) {
  @IsOptional()
  @IsNumber({}, { message: 'Id deve ser um número' })
  id: number;

  @Transform(() => undefined)
  password?: string;

  @IsArray({ message: 'Fotos deve ser um array' })
  @ValidateNested({ each: true, message: 'Fotos inválidas' })
  @Type(() => UpdateUserDTO)
  @IsOptional()
  photos?: UpdateUserDTO[];
}
