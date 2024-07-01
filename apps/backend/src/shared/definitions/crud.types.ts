import { HttpException } from '@nestjs/common';

export interface GetAllServiceReponse<T> {
  data: T[];
  count: number;
}

export interface Response<T> {
  ok: boolean;
  data: T | T[] | GetAllServiceReponse<T>;
  error?: HttpException;
}

export interface IsEntityModel {
  id: string;
}

export interface IsCrudService<Entity> {
  getAll(): GetAllServiceReponse<Entity>;
  getOne(id: string): Entity;
  createOne(createDto: any): Entity;
  createMany(createManyDto: any[]): Entity[];
  setOne(id: string, setDto: any): Entity;
  setMany(setManyDto: any[]): Entity[];
  updateOne(id: string, updateDto: any): Entity;
  updateMany(updateManyDto: any[]): Entity[];
  deleteOne(id: string): Entity;
  deleteMany(ids: string[]): Entity[];
}
