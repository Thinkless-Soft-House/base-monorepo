import { ENTITY_MANAGER_KEY } from '@interceptors/transaction.interceptor';
import { Request } from 'express';
import { DataSource, EntityManager, Repository } from 'typeorm';

export class BaseRepository<T> {
  constructor(
    private dataSource: DataSource,
    private request: Request,
  ) {}

  protected getRepository(entityCls: new () => T): Repository<T> {
    const entityManager: EntityManager =
      this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;

    console.log(
      `Im using the ${this.request[ENTITY_MANAGER_KEY] ? 'Transition' : 'Manager'} to get the repository`,
    );
    return entityManager.getRepository(entityCls);
  }
}
