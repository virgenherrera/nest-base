import { Logger, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from '../../app.module';
import { EnvConfigService } from '../services';

export class AppBuilder {
  static async bootstrap(buildDocs = false) {
    const instance = new AppBuilder();

    await instance.bootstrap(buildDocs);

    return instance.app;
  }

  private app: NestExpressApplication;
  private logger = new Logger(this.constructor.name);
  private options: NestApplicationOptions = { logger: [] };
  private prefix = 'api/v1';

  async bootstrap(buildDocs: boolean) {
    await this.setLogger(buildDocs);

    this.app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      this.options,
    );

    this.logger.log(`setting app prefix: ${this.prefix}`, AppBuilder.name);
    this.app.setGlobalPrefix(this.prefix);

    if (!buildDocs) this.setExecutionContext();
  }

  private async setLogger(buildDocs: boolean) {
    if (!buildDocs) {
      const { CreateWinstonLogger } = await import('../../utils');

      const logger = CreateWinstonLogger();

      this.options = { logger };
    }
  }

  private async setExecutionContext() {
    const { port, environment } = this.app.get(EnvConfigService);

    this.app.use(helmet());
    this.app.use(compression());

    await this.app.listen(port);

    this.logger.log(`Server is listening on port: ${port}`, AppBuilder.name);
    this.logger.log(
      `Server is running in ${environment} environment`,
      AppBuilder.name,
    );
  }
}
