import { SillyCache } from './silly-cache';

export interface SillyCacheWrapper<K, U> extends SillyCache<K> {
  underlyingCache: U;
}
