import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { stdout } from 'node:process';
import * as supertest from 'supertest';

import { AppModule } from '../../src/app.module';

export class TestContext {
  private static instance: TestContext;

  static async getInstance() {
    if (TestContext.instance) return TestContext.instance;

    const instance = new TestContext();

    TestContext.instance = await instance.initContext();

    return TestContext.instance;
  }

  static async destruct() {
    if (TestContext.instance) await TestContext.instance.destroyContext();
  }

  private _app: INestApplication;
  private _request: ReturnType<typeof supertest>;

  get app() {
    return this._app;
  }

  get request() {
    return this._request;
  }

  private async initContext() {
    stdout.write(`${'\n'}Initializing E2E ${this.constructor.name}`);

    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this._app = testingModule.createNestApplication();

    await this._app.init();

    this._request = supertest(this._app.getHttpServer());

    return this;
  }

  private async destroyContext() {
    stdout.write(`${'\n'}destroying E2E ${this.constructor.name}`);

    if (this._app) await this._app.close();

    Object.assign(this, { _app: null, _request: null });
  }
}
