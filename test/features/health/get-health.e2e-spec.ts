import { NestApplication } from '@nestjs/core';

import { TestContext } from '../../utils';

describe(`e2e: GET /health`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    getHealth = `Should GET App health.`,
    getHealthWithUptime = 'Should get App Health with uptime.',
  }

  const getHealthMatcher = { status: 'OK' };

  let testCtx: TestContext;

  beforeAll(async () => (testCtx = await TestContext.getInstance()));

  it(should.initTestContext, () => {
    expect(testCtx).toBeDefined();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.getHealth, async () => {
    const { status, body } = await testCtx.request.get('/health');

    expect(status).toBe(200);
    expect(body).toMatchObject(getHealthMatcher);
  });

  it(should.getHealth, async () => {
    const { status, body } = await testCtx.request
      .get('/health')
      .query({ uptime: true });

    expect(status).toBe(200);
    expect(body).toMatchObject({
      ...getHealthMatcher,
      uptime: expect.any(String),
    });
  });
});
