import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Photo } from './photos.model';

export class CreatePhotoDTO implements Partial<Photo> {
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @IsString({ message: 'Id do usuário deve ser uma string' })
  @IsOptional()
  userId: string;
}

export class SetPhotoDTO extends PartialType(CreatePhotoDTO) {
  @IsNumber({}, { message: 'Id deve ser um número' })
  id: string;
}

export class UpdatePhotoDTO extends PartialType(CreatePhotoDTO) {
  @IsNumber({}, { message: 'Id deve ser um número' })
  @IsOptional()
  id?: string;
}
