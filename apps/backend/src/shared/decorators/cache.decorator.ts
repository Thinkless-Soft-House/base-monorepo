import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache_key';
export const CACHE_TTL_METADATA = 'cache_ttl';
export const CACHE_LIST_METADATA = 'cache_list';
export const NO_CACHE_METADATA = 'no_cache';

export const CacheKey = (key: string) => SetMetadata(CACHE_KEY_METADATA, key);
export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_METADATA, ttl);
export const CacheList = () => SetMetadata(CACHE_LIST_METADATA, true);

export const NoCache = () => SetMetadata(NO_CACHE_METADATA, true);
