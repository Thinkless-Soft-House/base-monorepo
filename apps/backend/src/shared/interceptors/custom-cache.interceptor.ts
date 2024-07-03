import {
  CACHE_KEY_METADATA,
  CACHE_LIST_METADATA,
  CACHE_TTL_METADATA,
  NO_CACHE_METADATA,
} from '@decorators/cache.decorator';
import { SuccessHandlerResponse } from '@definitions/http.types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { Observable, from, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
  private cacheMap: Map<string, string> = new Map();
  private cacheOptions = {
    ttl: 60000,
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(ConfigService) private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (!this.configService.get('cache').cached) {
      console.log('Cache disabled');
      return next.handle();
    }
    if (this.reflector.get<boolean>(NO_CACHE_METADATA, context.getHandler()))
      return next.handle();
    if (this.reflector.get<boolean>(NO_CACHE_METADATA, context.getClass()))
      return next.handle();

    if (this.cacheMap.size === 0) {
      this.flushCache();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url, params, query } = request;

    if (method !== 'GET') {
      console.log('context =>', context.getClass().name);
      this.invalidateListCaches(context);
      return next.handle();
    }

    let { cacheKey } = this.getCustomTtlAndCacheKey(
      context.getHandler(),
      context.getClass(),
    );
    const isListRoute = this.reflector.get<boolean>(
      CACHE_LIST_METADATA,
      context.getHandler(),
    );

    // Create cache information on cache manager
    if (!cacheKey)
      cacheKey = `${isListRoute ? 'list-' + context.getClass().name + '-' : ''}${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(
        query,
      )}`;
    console.log('cacheKey', cacheKey);

    // Check if cache exists
    return from(this.cacheManager.get<string>(cacheKey)).pipe(
      switchMap((cached) => {
        if (cached) {
          console.log('Cache exists, returning => ', cached);

          return of(
            plainToInstance(SuccessHandlerResponse, JSON.parse(cached)),
          );
        } else {
          if (this.cacheMap.has(cacheKey)) this.cacheMap.delete(cacheKey);
          return next.handle().pipe(
            tap(async (response) => {
              // Create new cache
              console.log('Cache does not exist, creating...');
              await this.cacheManager.set(
                cacheKey,
                JSON.stringify(response),
                20000,
              );
              // Add on cacheMap
              this.cacheMap.set(`${cacheKey}`, cacheKey);
            }),
          );
        }
      }),
    );
  }

  private flushCache() {
    this.cacheManager.reset();
  }

  private getCustomTtlAndCacheKey(handler: any, controller: any) {
    const cacheKey =
      this.reflector.get<string>(CACHE_KEY_METADATA, handler) ||
      this.reflector.get<string>(CACHE_KEY_METADATA, controller);
    const cacheTtl =
      this.reflector.get<number>(CACHE_TTL_METADATA, handler) ||
      this.reflector.get<number>(CACHE_TTL_METADATA, controller);

    return {
      cacheKey,
      cacheTtl,
    };
  }

  private invalidateListCaches(context: ExecutionContext) {
    const controller = context.getClass().name;
    this.cacheMap.forEach((value, key) => {
      if (key.startsWith(`list-${controller}`)) {
        this.cacheManager.del(value);
        this.cacheMap.delete(key);
      }
    });
  }
}
