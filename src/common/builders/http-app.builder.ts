import { Logger, NestApplicationOptions, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvConfigService } from '../services';

export class HttpAppBuilder {
  private static _app: NestExpressApplication = null;

  static get app() {
    return HttpAppBuilder._app;
  }

  static async build(buildDocs = false) {
    const httpAppBuilder = new HttpAppBuilder(buildDocs);

    await httpAppBuilder.bootstrap();

    return HttpAppBuilder.app;
  }

  private logger = new Logger(this.constructor.name);
  private options: NestApplicationOptions = { logger: [] };
  private prefix = 'api';

  constructor(private buildDocs: boolean) {}

  async bootstrap() {
    await this.setLogger();
    await this.initApp();
    await this.setGlobalPrefix();
    await this.setVersioning();
    await this.setAppMiddleware();
    await this.setAppPort();
  }

  private async setLogger() {
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

  private async setAppPort() {
    if (this.buildDocs) return;

    const { port, environment } = HttpAppBuilder.app.get(EnvConfigService);

    await HttpAppBuilder.app.listen(port);

    this.logger.log(`Server is listening on port: ${port}`);
    this.logger.log(
      `Server is running in "${environment}" environment`,
      HttpAppBuilder.name,
    );
  }
}
