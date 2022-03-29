export interface SillyCache<K> {
  getCacheValue<V>(cacheKey: K): Promise<V | undefined>;
  setCacheValue<V>(cacheKey: K, cacheValue: V): Promise<void>;
}
