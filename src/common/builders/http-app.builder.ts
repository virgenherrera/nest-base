import { NestApplicationOptions, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '../decorators';
import { Environment } from '../enums';
import { EnvironmentService } from '../services';

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

  private environmentService: EnvironmentService;
  private options: NestApplicationOptions = { logger: [] };
  private prefix = 'api';

  private constructor(private buildDocs: boolean) {}

  async bootstrap() {
    await this.setNestAppOptions();
    await this.initApp();
    await this.setEnvironment();
    await this.setGlobalPrefix();
    await this.setVersioning();
    await this.setAppMiddleware();
    await this.setSwaggerDocs();
    await this.setAppPort();
  }

  private async setNestAppOptions() {
    if (this.buildDocs) return;

    const { CreateWinstonLogger } = await import('../../utils');

    const logger = CreateWinstonLogger();

    this.options = { logger };
  }

  private async initApp() {
    const { AppModule } = await import('../../app.module');

    HttpAppBuilder._app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      this.options,
    );
  }

  private setEnvironment() {
    this.logger.log(`getting Environment`);
    this.environmentService = HttpAppBuilder.app.get(EnvironmentService);
  }

  private async setGlobalPrefix() {
    this.logger.log(`setting app prefix: ${this.prefix}`);
    HttpAppBuilder.app.setGlobalPrefix(this.prefix);
  }

  private async setVersioning() {
    this.logger.log(`setting app URI version to 1`);
    HttpAppBuilder.app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
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
    const { port, environment } = this.environmentService;
    const skipSwagger = this.buildDocs || environment == Environment.production;

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

    const { port, environment } = this.environmentService;

    await HttpAppBuilder.app.listen(port);

    this.logger.log(`Server is listening on port: ${port}`);
    this.logger.log(
      `Server is running in "${environment}" environment`,
      HttpAppBuilder.name,
    );
  }
}
