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
  getAll(options: GetOptions): Promise<GetAllServiceReponse<Entity>>;
  getOne(id: string, relations: Relation[]): Promise<Entity>;
  createOne(createDto: any): Promise<Entity>;
  createMany(createManyDto: any[]): Promise<Entity[]>;
  setOne(setDto: any): Promise<Entity>;
  setMany(setManyDto: any[]): Promise<Entity[]>;
  updateOne(id: string, updateDto: any): Promise<Entity>;
  updateMany(updateManyDto: any[]): Promise<Entity[]>;
  deleteOne(id: string): Promise<Entity>;
  deleteMany(ids: string[]): Promise<Entity[]>;
}

export type GetOptions = {
  pagination?: Pagination;
  order?: Order;
  filters?: Filter[];
  // relationpath:relationname query
  relations?: Relation[];
};

export type Pagination = {
  page: number;
  size: number;
};

export type Order = {
  field: string;
  direction: 'ASC' | 'DESC';
};

export type Filter = {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'in';
  value: any;
};

export type Relation = {
  path: string;
  name: string;
};
