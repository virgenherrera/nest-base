import { NestApplication } from '@nestjs/core';

import { getTestContext, TestContext } from '../../utils/getTestContext.util';

describe(`e2e: GET /health`, () => {
  class GetHealthTestCase {
    static readonly initTestContext =
      'Should test Context be properly initialized.';
    static readonly getHealth = `Should GET App health.`;
    static readonly getHealthWithUptime = 'Should get App Health with uptime.';
    static readonly ignoreUnknownQuery = 'Should ignore unknown query params.';
    static readonly getNotFound = 'Should return not found for unknown routes.';
  }

  const getHealthMatcher = { status: 'OK' };

  let testCtx: TestContext;

  beforeAll(async () => (testCtx = await getTestContext()));

  afterAll(async () => {
    await testCtx.app.close();
  });

  it(GetHealthTestCase.initTestContext, () => {
    expect(testCtx).toBeDefined();
    expect(testCtx.request).toBeDefined();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(GetHealthTestCase.getHealth, async () => {
    const res = await testCtx.request.get('/health');

    expect(res).toHaveProperty('status', 200);
    expect(res).toHaveProperty('body');
    expect(res.body).toMatchObject(getHealthMatcher);
  });

  it(GetHealthTestCase.getHealthWithUptime, async () => {
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

  it(GetHealthTestCase.ignoreUnknownQuery, async () => {
    const res = await testCtx.request.get('/health').query({ foo: 'bar' });

    expect(res).toHaveProperty('status', 200);
    expect(res.body).toMatchObject(getHealthMatcher);
  });

  it(GetHealthTestCase.getNotFound, async () => {
    const res = await testCtx.request.get('/missing-route');

    expect(res).toHaveProperty('status', 404);
    expect(res.body).toMatchObject({
      error: 'Not Found',
      message: expect.arrayContaining([expect.stringMatching(/Cannot GET/)]),
      path: '/missing-route',
    });
  });
});
