import { SillyCache } from './silly-cache';
import { UseSillyCacheForPromise } from './use-silly-cache.decorator';

const cacheKey = 'foo';
const originalMethodReturnValue = 42;

describe('Given a silly cache implementation', () => {
  class MySillyCache implements SillyCache {
    private readonly data = new Map<string, any>();
    public getCacheValue<T>(cacheKey: string): Promise<T> {
      const val = this.data.get(cacheKey);
      return Promise.resolve(val);
    }
    public async setCacheValue<T>(
      cacheKey: string,
      cacheValue: T
    ): Promise<void> {
      this.data.set(cacheKey, cacheValue);
    }
  }

  let cache: MySillyCache;

  beforeEach(() => {
    cache = new MySillyCache();
  });

  describe(`Given a decorated method in which the original implementation will yield "${originalMethodReturnValue}"`, () => {
    class ClassUnderTest {
      constructor(private readonly cache: SillyCache) {}

      private readonly data: Map<string, any> = new Map([
        [cacheKey, originalMethodReturnValue]
      ]);

      @UseSillyCacheForPromise<ClassUnderTest>(
        (metadata) => metadata.thiz.cache,
        (_metadata, arg) => arg
      )
      public expensiveOperation(arg: string): Promise<any> {
        return Promise.resolve(this.data.get(arg));
      }
    }

    let classUnderTest: ClassUnderTest;

    beforeEach(() => {
      classUnderTest = new ClassUnderTest(cache);
    });

    describe('When decorated method is invoked without previously cached value', () => {
      let result: any;
      beforeEach(async () => {
        result = await classUnderTest.expensiveOperation(cacheKey);
      });

      it('Then original method return value is yielded', () => {
        expect(result).toEqual(originalMethodReturnValue);
      });

      it('Then original method return value is cached', async () => {
        const cachedVal = await cache.getCacheValue(cacheKey);
        expect(cachedVal).toEqual(originalMethodReturnValue);
      });
    });

    describe.each`
      cacheValue   | expectedReturnValue
      ${undefined} | ${originalMethodReturnValue}
      ${null}      | ${originalMethodReturnValue}
      ${0}         | ${0}
      ${false}     | ${false}
      ${''}        | ${''}
      ${[]}        | ${[]}
      ${{}}        | ${{}}
      ${true}      | ${true}
      ${43}        | ${43}
    `(
      'Given "$cacheValue" exists in the cache',
      ({ cacheValue, expectedReturnValue }) => {
        beforeEach(async () => {
          await cache.setCacheValue(cacheKey, cacheValue);
        });

        describe('When decorated method is invoked', () => {
          let result: any;
          beforeEach(async () => {
            result = await classUnderTest.expensiveOperation(cacheKey);
          });

          it(`Then "${expectedReturnValue}" is returned`, () => {
            expect(result).toEqual(expectedReturnValue);
          });

          it(`Then "${expectedReturnValue}" exists in cache`, async () => {
            const cachedVal = await cache.getCacheValue(cacheKey);
            expect(cachedVal).toEqual(expectedReturnValue);
          });
        });
      }
    );
  });
});
