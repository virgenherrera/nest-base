import { NestApplication } from '@nestjs/core';
import { CoreRoute } from '../../../src/core/enums';
import { GetHealthMatcher } from '../../matchers/core/get-health.matcher';
import { TestContext } from '../../utils';

const enum should {
  initModule = 'Should init Module Properly.',
  getHealth = `Should GET appHealth get data related process.`,
}

describe(`e2e: (GET)${CoreRoute.health}`, () => {
  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.build()));

  it(should.initModule, async () => {
    expect(testCtx.app).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.getHealth, async () => {
    const matcher = new GetHealthMatcher();
    const { status, body } = await testCtx.request.get(CoreRoute.health);

    expect(status).toBe(200);
    expect(body).toMatchObject(matcher);
  });
});
