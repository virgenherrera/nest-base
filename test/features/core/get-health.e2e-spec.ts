import { NestApplication } from '@nestjs/core';

import { TestContext } from '../../utils';

describe(`e2e: (GET) /health`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    getHealth = `Should GET appUptime.`,
  }

  let testCtx: TestContext = null;

  beforeAll(async () => (testCtx = await TestContext.getInstance()));

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.getHealth, async () => {
    const { status, body } = await testCtx.request.get('/health');

    expect(status).toBe(200);
    expect(body).toHaveProperty('uptime');
  });
});
