import { NestApplication } from '@nestjs/core';

import { CommonRoute } from '../../../src/common/enums';
import { TestContext } from '../../utils';

describe(`e2e: (GET)${CommonRoute.health}`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    getHealth = `Should GET appHealth params.`,
  }

  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.getInstance()));

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.getHealth, async () => {
    const { body } = await testCtx.request.get(CommonRoute.health);

    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('info');
    expect(body).toHaveProperty('error');
    expect(body).toHaveProperty('details');
  });
});
