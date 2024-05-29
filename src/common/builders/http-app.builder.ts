import { VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppConfig } from '../../config';
import { Logger } from '../decorators';

export class HttpAppBuilder {
  private static _app: NestExpressApplication = null;

  static get app() {
    return HttpAppBuilder._app;
  }

  static async build() {
    const httpAppBuilder = new HttpAppBuilder(false);

    await httpAppBuilder.bootstrap();

    return HttpAppBuilder.app;
  }

  static async buildWithDocs() {
    const httpAppBuilder = new HttpAppBuilder(true);

    await httpAppBuilder.bootstrap();

    return HttpAppBuilder.app;
  }

  @Logger() private logger: Logger;

  private appConfig: AppConfig = null;
  private prefix = 'api';

  private constructor(private buildDocs: boolean) {}

  async bootstrap() {
    await this.initApp();
    await ConfigModule.envVariablesLoaded;

    this.appConfig = HttpAppBuilder.app.get(ConfigService).get(AppConfig.name);

    await this.setGlobalPrefix();
    await this.setVersioning();
    await this.setAppMiddleware();
    await this.setSwaggerDocs();
    await this.setAppPort();
  }

  private async initApp() {
    const { AppModule } = await import('../../app.module');

    HttpAppBuilder._app =
      await NestFactory.create<NestExpressApplication>(AppModule);
  }

  private async setGlobalPrefix() {
    this.logger.log(`setting app prefix: ${this.prefix}`);
    HttpAppBuilder.app.setGlobalPrefix(this.prefix);
  }

  private async setVersioning() {
    this.logger.log(`setting API versioning to "HEADER"`);
    HttpAppBuilder.app.enableVersioning({
      type: VersioningType.HEADER,
      header: 'X-API-Version',
    });
  }

  private async setAppMiddleware() {
    if (this.buildDocs) return;

    const { default: helmet } = await import('helmet');
    const compression = await import('compression');

    HttpAppBuilder.app.use(helmet());
    HttpAppBuilder.app.use(compression());
  }

  private async setSwaggerDocs() {
    const { port, environment } = this.appConfig;
    const skipSwagger = this.buildDocs || environment === 'PROD';

    if (skipSwagger) return;

    const { OpenApiBuilder } = await import('./open-api.builder');
    const getSwaggerDocument = OpenApiBuilder.swaggerFactory(this.logger);
    const swaggerDocument = getSwaggerDocument();
    const { SwaggerModule } = await import('@nestjs/swagger');

    this.logger.log(`Mounting SwaggerDocs in: ${this.prefix}/`);
    SwaggerModule.setup(this.prefix, HttpAppBuilder.app, swaggerDocument);

    this.logger.log(
      `SwaggerDocs available in: http://localhost:${port}/${this.prefix}/`,
    );
  }

  private async setAppPort() {
    if (this.buildDocs) return;

    const { port, environment } = this.appConfig;

    await HttpAppBuilder.app.listen(port);

    this.logger.log(
      `HTTP service is running in "${environment}" environment`,
      HttpAppBuilder.name,
    );
  }
}
