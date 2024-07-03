import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';

import { AppModule } from '../../src/app.module';

export class TestContext {
  private static instance: TestContext = null;

  static async getInstance() {
    if (TestContext.instance) return TestContext.instance;

    const instance = new TestContext();

    try {
      TestContext.instance = await instance.initContext();
    } catch (error) {
      console.error('Failed to initialize test context:', error);
      throw error;
    }

    return TestContext.instance;
  }

  static async destroyInstance() {
    if (TestContext.instance) {
      try {
        await TestContext.instance.destroyContext();
      } catch (error) {
        console.error('Failed to destroy test context:', error);
      }
    }
  }

  private _app: INestApplication = null;
  private _request: ReturnType<typeof supertest> = null;

  get app() {
    return this._app;
  }

  get request() {
    return this._request;
  }

  private async initContext() {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this._app = testingModule.createNestApplication();

    await this._app.init();

    this._request = supertest(this.app.getHttpServer());

    return this;
  }

  private async destroyContext() {
    if (this._app) await this._app.close();

    this._request = null;
  }
}
