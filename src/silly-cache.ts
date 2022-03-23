export interface SillyCache {
  getCacheValue<T>(cacheKey: string): Promise<T>;
  setCacheValue<T>(cacheKey: string, cacheValue: T): Promise<void>;
}
