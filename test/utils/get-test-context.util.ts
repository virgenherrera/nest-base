import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';
import { MockEnvConfigProvider } from '../../src/core/services/__mocks__';

export type TestApp = INestApplication;
export type SuperRequest = supertest.SuperTest<supertest.Test>;

export class TestContext {
  app: TestApp = null;
  request: SuperRequest = null;

  static async build() {
    const instance = new TestContext();

    return await instance.build();
  }

  async build() {
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
