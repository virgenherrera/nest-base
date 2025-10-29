import { NestApplication } from '@nestjs/core';

import { getTestContext, TestContext } from '../../utils/getTestContext.util';

describe(`e2e: GET /health`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    getHealth = `Should GET App health.`,
    getHealthWithUptime = 'Should get App Health with uptime.',
  }

  const getHealthMatcher = { status: 'OK' };

  let testCtx: TestContext;

  beforeAll(async () => (testCtx = await getTestContext()));

  it(should.initTestContext, () => {
    expect(testCtx).toBeDefined();
    expect(testCtx.request).toBeDefined();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.getHealth, async () => {
    const res = await testCtx.request.get('/health');

    expect(res).toHaveProperty('status', 200);
    expect(res).toHaveProperty('body');
    expect(res.body).toMatchObject(getHealthMatcher);
  });

  it(should.getHealth, async () => {
    const res = await testCtx.request.get('/health').query({ uptime: true });

    expect(res).toHaveProperty('status', 200);
    expect(res).toHaveProperty('body');
    expect(res.body).toMatchObject({
      ...getHealthMatcher,
      uptime: expect.stringMatching(/.{1,}/),
    });
  });
});
