export interface SillyCache {
  getCacheValue<T>(cacheKey: string): Promise<T | undefined>;
  setCacheValue<T>(cacheKey: string, cacheValue: T): Promise<void>;
}
