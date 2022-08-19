import { NestApplication } from '@nestjs/core';
import { CoreRoute } from '../../../src/core/enums';
import {
  BaseGetHealthMatcher,
  GetHealthMatcher,
} from '../../matchers/core/get-health.matcher';
import { TestContext } from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throw400 = 'Should throw 400 when receiving invalid query-params.',
  getBaseHealth = `Should GET basic appHealth params.`,
  getFullHealth = `Should GET basic appHealth including cpuUsage and memoryUsage params.`,
}

describe(`e2e: (GET)${CoreRoute.health}`, () => {
  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.getInstance()));

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throw400, async () => {
    const queryParams = { foo: true, bar: { baz: 'buz' }, arr: [1, 2, 3] };
    const { status, body } = await testCtx.request
      .get(CoreRoute.health)
      .query(queryParams);

    expect(status).toBe(400);
    expect(body).toMatchObject({
      code: 'bad-request-error',
      message: 'Bad Request',
      details: [
        [
          'property foo should not exist',
          'property bar should not exist',
          'property arr should not exist',
        ],
      ],
    });
  });

  it(should.getBaseHealth, async () => {
    const { status, body } = await testCtx.request.get(CoreRoute.health);

    expect(status).toBe(200);
    expect(body).toMatchObject(BaseGetHealthMatcher);
  });

  it(should.getFullHealth, async () => {
    const { status, body } = await testCtx.request
      .get(CoreRoute.health)
      .query({ cpuUsage: true, memoryUsage: true });

    expect(status).toBe(200);
    expect(body).toMatchObject(GetHealthMatcher);
  });
});
