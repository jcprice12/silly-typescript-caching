import { SillyCache } from './silly-cache';

export interface SillyCacheWrapper<T> extends SillyCache {
  underlyingCache: T;
}
