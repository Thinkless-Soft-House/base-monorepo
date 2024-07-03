import { CacheOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { StoreConfig } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';

export default async function cacheConfig(
  cs: ConfigService,
): Promise<CacheOptions<StoreConfig>> {
  const cache = cs.get('cache');

  if (!cache.cached) {
    console.log('Cache disabled');
    return {};
  }

  if (cache.type === 'redis') {
    const storeConfig = {
      socket: {
        host: cache.redis.host,
        port: cache.redis.port,
      },
      password: cache.redis.password,
    };

    return {
      store: async () => redisStore(storeConfig) as any,
      ttl: cache.ttl, // default TTL in seconds
      max: cache.max, // maximum number of items in cache
    };
  }

  return {
    ttl: cache.ttl, // default TTL in seconds
    max: cache.max, // maximum number of items in cache
  };
}
