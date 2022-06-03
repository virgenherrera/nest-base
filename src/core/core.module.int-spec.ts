import { INestApplication } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { CoreModule } from './core.module';
import { CoreRoute } from './enums';
import {
  MockEnvConfigProvider,
  MockLoggerProvider,
} from './services/__mocks__';

describe(`Integration ${CoreModule.name}`, () => {
  const enum should {
    initModule = 'Should init Module Properly.',
    getHealth = `Should GET appHealth.`,
  }

  let app: INestApplication = null;

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [MockLoggerProvider],
    })
      .overrideProvider(MockEnvConfigProvider.provide)
      .useValue(MockEnvConfigProvider.useValue)
      .compile();

    app = testingModule.createNestApplication();
    await app.init();
  });

  it(should.initModule, async () => {
    expect(app).not.toBeNull();
    expect(app).toBeInstanceOf(NestApplication);
  });

  it(should.getHealth, async () => {
    const { status, body } = await supertest(app.getHttpServer()).get(
      CoreRoute.health,
    );
    const bodyMatcher = {
      cpuUsage: expect.any(String),
      memoryUsage: expect.any(String),
      uptime: expect.any(String),
      uptimeSince: expect.any(String),
    };

    expect(status).toBe(200);
    expect(body).toMatchObject(bodyMatcher);
  });
});
