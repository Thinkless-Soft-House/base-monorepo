import type {
  GetAllServiceReponse,
  GetOptions,
  IsCrudService,
  IsEntityModel,
  IsRepositoryEntity,
  IsUpdateEntityDTO,
  Relation,
} from '@definitions/crud.types';
export class CrudService<
  Entity extends IsEntityModel,
  CreateEntityDTO,
  UpdateEntityDTO extends IsUpdateEntityDTO,
  RepositoryEntity extends IsRepositoryEntity<Entity>,
> implements IsCrudService<Entity>
{
  constructor(
    public table: string,
    private repository: RepositoryEntity,
    protected options: any = {},
  ) {}
  async getAll(
    options: GetOptions = {},
  ): Promise<GetAllServiceReponse<Entity>> {
    return this.repository.getAll(options);
  }

  async getOne(id: number, relations: Relation[]): Promise<Entity> {
    return this.repository.getOne(id, relations);
  }

  async createOne(createDto: CreateEntityDTO): Promise<Entity> {
    return this.repository.createOne(createDto);
  }

  async createMany(createManyDto: CreateEntityDTO[]): Promise<Entity[]> {
    return this.repository.createMany(createManyDto);
  }

  async setOne(setDto: CreateEntityDTO): Promise<Entity> {
    return this.repository.setOne(setDto);
  }

  async setMany(setManyDto: CreateEntityDTO[]): Promise<Entity[]> {
    return this.repository.setMany(setManyDto);
  }

  async updateOne(id: number, updateDto: UpdateEntityDTO): Promise<Entity> {
    return this.repository.updateOne(id, updateDto);
  }

  async updateMany(updateManyDto: UpdateEntityDTO[]): Promise<Entity[]> {
    return this.repository.updateMany(updateManyDto);
  }

  async deleteOne(id: number): Promise<Entity> {
    return this.repository.deleteOne(id);
  }

  async deleteMany(ids: number[]): Promise<Entity[]> {
    return this.repository.deleteMany(ids);
  }
}
