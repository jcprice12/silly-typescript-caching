import NodeCache = require('node-cache');
import { SillyCacheWrapper } from './silly-cache-wrapper';

export class SillyNodeCacheWrapper implements SillyCacheWrapper<NodeCache> {
  constructor(public readonly underlyingCache: NodeCache) {}
  public getCacheValue<T>(cacheKey: string): Promise<T | undefined> {
    const cacheValue = this.underlyingCache.get<T>(cacheKey);
    return Promise.resolve(cacheValue);
  }
  public async setCacheValue<T>(
    cacheKey: string,
    cacheValue: T
  ): Promise<void> {
    this.underlyingCache.set(cacheKey, cacheValue);
  }
}
