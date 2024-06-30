import type {
  GetAllServiceReponse,
  IsCrudService,
  IsEntityModel,
} from '@definitions/crud.types';

export class CrudService<
  Entity extends IsEntityModel,
  CreateEntityDTO,
  UpdateEntityDTO,
> implements IsCrudService<Entity>
{
  getAll(): GetAllServiceReponse<Entity> {
    return {
      data: [],
      count: 0,
    };
  }

  getOne(id: string): Entity {
    return { id } as Entity;
  }

  createOne(createDto: CreateEntityDTO): Entity {
    return { id: '1', ...createDto } as unknown as Entity;
  }

  createMany(createManyDto: CreateEntityDTO[]): Entity[] {
    return createManyDto as unknown as Entity[];
  }

  updateOne(id: string, updateDto: UpdateEntityDTO): Entity {
    return { id, ...updateDto } as unknown as Entity;
  }

  updateMany(updateManyDto: UpdateEntityDTO[]) {
    return updateManyDto as unknown as Entity[];
  }

  deleteOne(id: string) {
    return { id } as Entity;
  }

  deleteMany(ids: string[]) {
    return ids as unknown as Entity[];
  }
}
