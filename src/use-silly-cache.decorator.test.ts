import { UseSillyCache } from './use-silly-cache.decorator';

const cacheKey = 'foo';

describe('Given a decorated method', () => {
  class ClassUnderTest {
    private readonly data: Map<string, any> = new Map([[cacheKey, 42]]);

    @UseSillyCache()
    public expensiveOperation(arg: string): Promise<any> {
      return Promise.resolve(this.data.get(arg));
    }
  }

  let classUnderTest: ClassUnderTest;

  beforeEach(() => {
    classUnderTest = new ClassUnderTest();
  });

  describe('When decorated method is invoked without previously cached value', () => {
    let result: any;
    beforeEach(async () => {
      result = await classUnderTest.expensiveOperation(cacheKey);
    });

    it('Then value is returned from expensive operation', () => {
      expect(result).toEqual(42);
    });
  });
});
