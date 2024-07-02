/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  GetAllServiceReponse,
  GetOptions,
  IsCrudService,
  IsEntityModel,
  Relation,
} from '@definitions/crud.types';
import DatabaseHandler from '@handlers/database.handler';
import { HttpException } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

export class CrudService<
  Entity extends IsEntityModel,
  CreateEntityDTO,
  UpdateEntityDTO,
> implements IsCrudService<Entity>
{
  constructor(
    public table: string,
    private manager: EntityManager,
    private repository: Repository<Entity>,
  ) {}
  async getAll(
    options: GetOptions = {},
  ): Promise<GetAllServiceReponse<Entity>> {
    const getOptions = DatabaseHandler.builderGetOptions(options);
    const pagination = DatabaseHandler.builderPagination(
      getOptions.pagination.page,
      getOptions.pagination.size,
    );

    try {
      let data = this.repository
        .createQueryBuilder(this.table)
        .skip(pagination.offset)
        .take(pagination.limit)
        .orderBy(getOptions.order.field, getOptions.order.direction);

      data = DatabaseHandler.getRelations(
        this.table,
        data,
        getOptions.relations,
      );
      data = DatabaseHandler.applyFilters(data, getOptions.filters);
      data = this.applyCustomFilters(data);
      const res = await data.getMany();

      let count = await this.repository.createQueryBuilder(this.table);
      count = DatabaseHandler.applyFilters(count, getOptions.filters);
      const countRes = await count.getCount();

      return {
        data: res as unknown as Entity[],
        count: countRes as number,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(error, 500);
    }
  }

  async getOne(id: any, relations: Relation[]): Promise<Entity> {
    let data = this.repository
      .createQueryBuilder(this.table)
      .andWhere('id = :id', { id });

    data = DatabaseHandler.getRelations(this.table, data, relations);

    return await data.getOneOrFail();
  }

  async createOne(createDto: CreateEntityDTO): Promise<Entity> {
    return { id: '1', ...createDto } as unknown as Entity;
  }

  async createMany(createManyDto: CreateEntityDTO[]): Promise<Entity[]> {
    return createManyDto as unknown as Entity[];
  }

  async setOne(id: string, setDto: UpdateEntityDTO): Promise<Entity> {
    return { id, ...setDto } as unknown as Entity;
  }

  async setMany(setManyDto: UpdateEntityDTO[]) {
    return setManyDto as unknown as Entity[];
  }

  async updateOne(id: string, updateDto: UpdateEntityDTO): Promise<Entity> {
    return { id, ...updateDto } as unknown as Entity;
  }

  async updateMany(updateManyDto: UpdateEntityDTO[]) {
    return updateManyDto as unknown as Entity[];
  }

  async deleteOne(id: string) {
    return { id } as Entity;
  }

  async deleteMany(ids: string[]) {
    return ids as unknown as Entity[];
  }

  // Target to override in the child class
  public applyCustomFilters(
    query: SelectQueryBuilder<Entity>,
    filterType?: string,
  ): SelectQueryBuilder<Entity> {
    return query;
  }
}
