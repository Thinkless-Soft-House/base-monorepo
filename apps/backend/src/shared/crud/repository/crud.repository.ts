import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Request } from 'express';

import { BaseRepository } from './base.repository';
import {
  GetAllServiceReponse,
  GetOptions,
  IsUpdateEntityDTO,
  Relation,
} from '@definitions/crud.types';
import DatabaseHandler from '@handlers/database.handler';
import { MyBaseEntity } from '@database/base.modal';

export class CrudRepository<
  Entity extends MyBaseEntity,
  CreateEntityDTO,
  SetEntityDTO extends IsUpdateEntityDTO,
  UpdateEntityDTO extends IsUpdateEntityDTO,
> extends BaseRepository<Entity> {
  constructor(
    dataSource: DataSource,
    request: Request,
    private table: string,
    private entity: new () => Entity,
    private options: any = {},
  ) {
    super(dataSource, request);
    if (!options.id) options.id = 'id';
  }
  async getAll(
    options: GetOptions = {},
  ): Promise<GetAllServiceReponse<Entity>> {
    const getOptions = DatabaseHandler.builderGetOptions(options);
    const pagination = DatabaseHandler.builderPagination(
      getOptions.pagination.page,
      getOptions.pagination.size,
    );

    try {
      let data = this.getRepository(this.entity)
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

      let count = await this.getRepository(
        this.entity as any,
      ).createQueryBuilder(this.table);
      count = DatabaseHandler.applyFilters(count, getOptions.filters);
      const countRes = await count.getCount();

      return {
        data: res as unknown as Entity[],
        count: countRes as number,
      };
    } catch (error) {
      throw DatabaseHandler.builderErrorHandler(error);
    }
  }

  async getOne(id: any, relations: Relation[]): Promise<Entity> {
    try {
      console.log('Hit here!');
      let data = this.getRepository(this.entity)
        .createQueryBuilder(this.table)
        .andWhere(`${this.table}.${this.options.id} = :id`, { id });

      data = DatabaseHandler.getRelations(this.table, data, relations);

      const ret = await data.getOne();
      if (!ret) {
        throw DatabaseHandler.builderErrorHandler({
          message: 'Entity not found',
          statusCode: 404,
        });
      }

      return { ...ret } as unknown as Entity;
    } catch (error) {
      throw DatabaseHandler.builderErrorHandler(error);
    }
  }

  async createOne(createDto: CreateEntityDTO): Promise<Entity> {
    try {
      const rep = await this.getRepository(this.entity);
      const data = await rep.save(createDto as any);

      return { ...data } as unknown as Entity;
    } catch (error: any) {
      throw DatabaseHandler.builderErrorHandler(error);
    }
  }

  async createMany(createManyDto: CreateEntityDTO[]): Promise<Entity[]> {
    try {
      const rep = await this.getRepository(this.entity);
      const data = await rep.save(createManyDto as any);

      return data as unknown as Entity[];
    } catch (error: any) {
      console.error(error);
      throw DatabaseHandler.builderErrorHandler(error);
    }
  }

  async setOne(setDto: SetEntityDTO): Promise<Entity> {
    try {
      let action = 'CREATE';
      if (setDto.id) {
        action = 'UPDATE';
      }

      let item = { ...setDto };
      if (action === 'UPDATE') {
        const find = await this.getRepository(this.entity).findOne({
          where: { id: setDto.id as any },
          relations: this.getRelations(),
        });

        if (!find) {
          throw DatabaseHandler.builderErrorHandler({
            message: 'Entity not found',
            statusCode: 404,
          });
        }

        // Identificar e remover relações ausentes
        // const entityRelations = this.getRelations();
        // for (const relation of entityRelations) {
        //   const currentRelationItems = find[relation];
        //   const updatedRelationItems = setDto[relation];

        //   if (
        //     Array.isArray(currentRelationItems) &&
        //     Array.isArray(updatedRelationItems)
        //   ) {
        //     const itemsToRemove = currentRelationItems.filter(
        //       (currentItem) =>
        //         !updatedRelationItems.some(
        //           (updatedItem) => updatedItem.id === currentItem.id,
        //         ),
        //     );

        //     if (itemsToRemove.length > 0) {
        //       const relationRepository = this.getRepository(
        //         this.getRelationEntity(relation),
        //       );
        //       await relationRepository.remove(itemsToRemove);
        //     }
        //   }
        // }

        item = { ...find, ...setDto };
      }

      const data = await this.getRepository(this.entity).save(item as any);
      return { ...data } as unknown as Entity;
    } catch (error: any) {
      throw DatabaseHandler.builderErrorHandler(error);
    }
  }

  async setMany(setManyDto: SetEntityDTO[]) {
    const p$ = setManyDto.map((item) => this.setOne(item));
    const items = await Promise.all(p$);

    return items as unknown as Entity[];
  }

  async updateOne(id: number, updateDto: UpdateEntityDTO): Promise<Entity> {
    try {
      let item = await this.getRepository(this.entity).findOne({
        where: {
          id: id as any,
        },
      });

      await this.getRepository(this.entity).save({
        ...item,
        ...updateDto,
      } as any);

      item = await this.getRepository(this.entity).findOne({
        where: {
          id: id as any,
        },
        relations: this.getRelations(),
      });

      return { ...item } as unknown as Entity;
    } catch (error) {
      console.error('Error on Update One => ', error);
      throw DatabaseHandler.builderErrorHandler(error);
    }
  }

  async updateMany(updateManyDto: UpdateEntityDTO[]) {
    const p$ = updateManyDto.map((item) => this.updateOne(item.id, item));
    const items = await Promise.all(p$);

    return items as unknown as Entity[];
  }

  async deleteOne(id: number) {
    await this.getRepository(this.entity).delete(id as any);
    return { id } as Entity;
  }

  async deleteMany(ids: number[]) {
    const p$ = ids.map((id) => this.deleteOne(id));
    const items = await Promise.all(p$);

    return items as unknown as Entity[];
  }

  // Used to create new queries with so system rules and filters
  protected getHandler(relations: Relation[]): SelectQueryBuilder<Entity> {
    let data = this.getRepository(this.entity as any).createQueryBuilder(
      this.table,
    );
    data = DatabaseHandler.getRelations(this.table, data, relations);

    return data;
  }

  private getRelations(): string[] {
    const relations = [];
    const entityMetadata = this.getRepository(this.entity).metadata;
    entityMetadata.relations.forEach((relation) => {
      if (relation.isOneToMany) {
        relations.push(relation.propertyName);
      }
    });
    return relations;
  }

  // Função para obter a entidade de uma relação
  private getRelationEntity(relation: string): any {
    const entityMetadata = this.getRepository(this.entity).metadata;
    const relationMetadata = entityMetadata.relations.find(
      (r) => r.propertyName === relation,
    );
    return relationMetadata.type;
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
