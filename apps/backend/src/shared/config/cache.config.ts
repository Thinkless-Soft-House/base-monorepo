import { CacheOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { StoreConfig } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { createClient, RedisClientOptions } from 'redis';

export default async function cacheConfig(
  cs: ConfigService,
): Promise<CacheOptions<StoreConfig>> {
  const cache = cs.get('cache');

  if (!cache.cached) {
    console.log('Cache disabled');
    return {};
  }

  if (cache.type === 'redis') {
    const storeConfig: RedisClientOptions & StoreConfig = {
      socket: {
        host: cache.redis.host,
        port: cache.redis.port,
      },

      password: cache.redis.password,
    };

    const client = createClient(storeConfig);

    try {
      await client.connect();
      await client.ping();
      await client.disconnect();

      console.log('Redis connection successful');
      return {
        store: async () => redisStore(storeConfig) as any,
        ttl: cache.ttl,
        max: cache.max,
      };
    } catch (error) {
      console.error(
        'Redis connection failed, falling back to in-memory cache',
        error,
      );
      return {
        ttl: cache.ttl,
        max: cache.max,
      };
    }
  }

  return {
    ttl: cache.ttl,
    max: cache.max,
  };
}
