export interface SillyLock {
  acquireLock<T>(lockKey: string, executeFunction: () => T): Promise<T>;
}
