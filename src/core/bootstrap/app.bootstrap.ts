import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { OpenAPIObject } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from '../../app.module';
import { AppConfig, ServerConfig, SwaggerConfig } from '../../config';

export interface AppContext {
  apiPrefix: string;
  app: INestApplication;
  appConfig: AppConfig;
  serverConfig: ServerConfig;
  swaggerConfig: SwaggerConfig;
  getSwaggerDocument: () => Promise<OpenAPIObject>;
}

export class AppBootstrap {
  private static readonly logger = new Logger(AppBootstrap.name);

  static async createAppContext(): Promise<AppContext> {
    const apiPrefix = 'api';
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bodyParser: true,
    });

    this.logger.verbose('NestApplication created');

    await ConfigModule.envVariablesLoaded;
    this.logger.verbose('Environment Variables Loaded');

    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>(AppConfig.name);

    if (!appConfig) {
      throw new Error(`Unable to find ${AppConfig.name}`);
    }

    const serverConfig = configService.get<ServerConfig>(ServerConfig.name);

    if (!serverConfig) {
      throw new Error(`Unable to find ${ServerConfig.name}`);
    }

    const swaggerConfig = configService.get<SwaggerConfig>(SwaggerConfig.name);

    if (!swaggerConfig) {
      throw new Error(`Unable to find ${SwaggerConfig.name}`);
    }

    app.useLogger(appConfig.logLevels);
    this.logger.log(
      `Configuring environment "${appConfig.environmentLabel}" with log levels: ${appConfig.logLevels.join(
        ', ',
      )}`,
    );

    this.logger.log(`setting app prefix: ${apiPrefix}`);
    app.setGlobalPrefix(apiPrefix);

    this.logger.log(`setting API versioning to "HEADER"`);
    app.enableVersioning({
      header: 'X-API-Version',
      type: VersioningType.HEADER,
    });

    app.enableShutdownHooks();

    const getSwaggerDocument = async (): Promise<OpenAPIObject> => {
      this.logger.verbose('preparing Swagger Document');
      const { DocumentBuilder, SwaggerModule } =
        await import('@nestjs/swagger');
      const config = new DocumentBuilder()
        .setTitle(appConfig.name)
        .setVersion(appConfig.version)
        .build();
      const swaggerDocument = SwaggerModule.createDocument(app, config);

      this.logger.verbose(
        `successfully created OpenAPI ${swaggerDocument.info.title}`,
      );

      return cleanupOpenApiDoc(swaggerDocument);
    };

    return {
      apiPrefix,
      app,
      appConfig,
      serverConfig,
      swaggerConfig,
      getSwaggerDocument,
    };
  }
}
