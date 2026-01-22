import { NestApplication } from '@nestjs/core';

import { getTestContext, TestContext } from '../../utils/getTestContext.util';

describe(`e2e: GET /health`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    getHealth = `Should GET App health.`,
    getHealthWithUptime = 'Should get App Health with uptime.',
    ignoreUnknownQuery = 'Should ignore unknown query params.',
    getNotFound = 'Should return not found for unknown routes.',
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
    const res = await testCtx.request
      .get('/health')
      .query({ appMeta: true, uptime: true });

    expect(res).toHaveProperty('status', 200);
    expect(res).toHaveProperty('body');
    expect(res.body).toMatchObject({
      ...getHealthMatcher,
      appMeta: expect.stringMatching(/^([\w-]+)@(\d+\.\d+\.\d+)$/),
      uptime: expect.stringMatching(/.{1,}/),
    });
  });

  it(should.ignoreUnknownQuery, async () => {
    const res = await testCtx.request.get('/health').query({ foo: 'bar' });

    expect(res).toHaveProperty('status', 200);
    expect(res.body).toMatchObject(getHealthMatcher);
  });

  it(should.getNotFound, async () => {
    const res = await testCtx.request.get('/missing-route');

    expect(res).toHaveProperty('status', 404);
    expect(res.body).toMatchObject({
      error: 'Not Found',
      message: expect.arrayContaining([expect.stringMatching(/Cannot GET/)]),
      path: '/missing-route',
    });
  });
});
