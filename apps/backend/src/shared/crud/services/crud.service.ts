import type {
  GetAllServiceReponse,
  GetOptions,
  IsCrudService,
  IsEntityModel,
  IsUpdateEntityDTO,
  Relation,
} from '@definitions/crud.types';
import DatabaseHandler from '@handlers/database.handler';
import { HttpException } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

export class CrudService<
  Entity extends IsEntityModel,
  CreateEntityDTO,
  UpdateEntityDTO extends IsUpdateEntityDTO,
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
    try {
      const data = await this.repository
        .createQueryBuilder(this.table)
        .insert()
        .values([createDto as any])
        .execute();

      console.log('insert result', data);
      console.log('insert result createDTO', createDto);

      return { ...createDto } as unknown as Entity;
    } catch (error: any) {
      throw DatabaseHandler.builderErrorHandler(error);
    }
  }

  async createMany(createManyDto: CreateEntityDTO[]): Promise<Entity[]> {
    try {
      await this.repository
        .createQueryBuilder(this.table)
        .insert()
        .values(createManyDto as any[])
        .execute();

      return [...createManyDto] as unknown as Entity[];
    } catch (error: any) {
      console.error(error);
      throw DatabaseHandler.builderErrorHandler(error);
    }
  }

  async setOne(setDto: UpdateEntityDTO): Promise<Entity> {
    try {
      let action = 'CREATE';
      if (setDto.id) {
        action = 'UPDATE';
      }

      let item = { ...setDto };
      if (action === 'UPDATE') {
        const find = await this.repository
          .createQueryBuilder(this.table)
          .where('id = :id', { id: setDto.id })
          .getOneOrFail();

        item = { ...find, ...setDto };
      }
      console.log('item', item);

      if (action === 'UPDATE')
        await this.repository
          .createQueryBuilder(this.table)
          .update()
          .set({ ...(item as any), updatedAt: new Date() })
          .where('id = :id', { id: item.id })
          .execute();
      if (action === 'CREATE')
        await this.repository
          .createQueryBuilder(this.table)
          .insert()
          .values([item as any])
          .execute();

      return { ...item } as unknown as Entity;
    } catch (error: any) {
      throw DatabaseHandler.builderErrorHandler(error);
    }
  }

  async setMany(setManyDto: UpdateEntityDTO[]) {
    const p$ = setManyDto.map((item) => this.setOne(item));
    const items = await Promise.all(p$);

    return items as unknown as Entity[];
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

  protected getHandler(relations: Relation[]): SelectQueryBuilder<Entity> {
    let data = this.repository.createQueryBuilder(this.table);
    data = DatabaseHandler.getRelations(this.table, data, relations);

    return data;
  }

  // Target to override in the child class to create custom filters
  protected applyCustomFilters(
    query: SelectQueryBuilder<Entity>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filterType?: string,
  ): SelectQueryBuilder<Entity> {
    return query;
  }
}
