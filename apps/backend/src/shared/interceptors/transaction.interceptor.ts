import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    // get request object
    const req = context.switchToHttp().getRequest<Request>();
    // start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // attach query manager with transaction to the request
    req[ENTITY_MANAGER_KEY] = queryRunner.manager;

    return next.handle().pipe(
      // concatMap gets called when route handler completes successfully
      concatMap(async (data) => {
        console.log('committing transaction, data:', data);
        await queryRunner.commitTransaction();
        return data;
      }),
      // catchError gets called when route handler throws an exception
      catchError(async (e) => {
        console.log('rolling back transaction, error:', e);
        await queryRunner.rollbackTransaction();
        throw e;
      }),
      // always executed, even if catchError method throws an exception
      finalize(async () => {
        console.log('releasing queryRunner');
        await queryRunner.release();
      }),
    );
  }
}
