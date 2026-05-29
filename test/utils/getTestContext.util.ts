import { INestApplication, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../src/app.module';

export type TestContext = {
  app: INestApplication<App>;
  request: ReturnType<typeof supertest>;
};
export async function getTestContext(): Promise<TestContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app: TestContext['app'] = moduleFixture.createNestApplication();

  app.setGlobalPrefix('api');
  app.enableVersioning({
    header: 'X-API-Version',
    type: VersioningType.HEADER,
  });

  await app.init();

  const request = supertest(app.getHttpServer());

  return { app, request };
}
