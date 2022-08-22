import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { MockEnvConfigProvider } from '../../src/core/services/__mocks__';

export class TestContext {
  private static instance: TestContext = null;

  static async getInstance() {
    if (TestContext.instance) return TestContext.instance;

    const instance = new TestContext();

    TestContext.instance = await instance.initContext();

    return TestContext.instance;
  }

  app: INestApplication = null;
  request: supertest.SuperTest<supertest.Test> = null;

  private async initContext() {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MockEnvConfigProvider.provide)
      .useValue(MockEnvConfigProvider.useValue)
      .compile();

    this.app = testingModule.createNestApplication();

    await this.app.init();

    this.request = supertest(this.app.getHttpServer());

    Object.freeze(this);
    Object.seal(this);

    return this;
  }
}
