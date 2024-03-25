import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';

import { AppModule } from '../../src/app.module';
import { EnvironmentService } from '../../src/common/services';
import {
  MockEnvironmentProvider,
  mockEnvironmentService,
} from '../../src/common/services/__mocks__';
import { mockConfigService } from './e2e-env.util';

export class TestContext {
  private static instance: TestContext = null;

  static async getInstance() {
    if (TestContext.instance) return TestContext.instance;

    const instance = new TestContext();

    TestContext.instance = await instance.initContext();

    return TestContext.instance;
  }

  app: INestApplication = null;
  request: ReturnType<typeof supertest> = null;

  private async initContext() {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EnvironmentService)
      .useValue(mockEnvironmentService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(MockEnvironmentProvider.provide)
      .useValue(MockEnvironmentProvider.useValue)
      .compile();

    this.app = testingModule.createNestApplication();

    await this.app.init();

    this.request = supertest(this.app.getHttpServer());

    Object.freeze(this);
    Object.seal(this);

    return this;
  }
}
