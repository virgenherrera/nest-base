import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { OpenAPIObject } from '@nestjs/swagger';

import { AppModule } from '../../../app.module';
import { AppConfig } from '../../../config';

export interface AppContext {
  apiPrefix: string;
  app: INestApplication;
  appConfig: AppConfig;
  getSwaggerDocument: () => Promise<OpenAPIObject>;
}

export async function CommonAppFactory(): Promise<AppContext> {
  const apiPrefix = 'api';
  const logger = new Logger(CommonAppFactory.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  logger.verbose('NestApplication created');

  await ConfigModule.envVariablesLoaded;
  logger.verbose('Environment Variables Loaded');

  const appConfig = app.get(ConfigService).get<AppConfig>(AppConfig.name);

  if (!appConfig) throw new Error(`Unable to find ${AppConfig.name}`);

  logger.log(`setting app prefix: ${apiPrefix}`);
  app.setGlobalPrefix(apiPrefix);

  logger.log(`setting API versioning to "HEADER"`);
  app.enableVersioning({
    header: 'X-API-Version',
    type: VersioningType.HEADER,
  });

  const getSwaggerDocument = async (): Promise<OpenAPIObject> => {
    logger.verbose('preparing Swagger Document');
    const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setVersion(appConfig.version)
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, config);

    logger.verbose(
      `successfully created OpenAPI ${swaggerDocument.info.title}`,
    );

    return swaggerDocument;
  };

  return {
    apiPrefix,
    app,
    appConfig,
    getSwaggerDocument,
  };
}
