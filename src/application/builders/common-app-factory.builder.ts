import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '../../app.module';
import { AppConfig } from '../../config';

export interface AppContext {
  app: INestApplication;
  appConfig: AppConfig;
  apiPrefix: string;
}

export async function CommonAppFactory(apiPrefix = 'api'): Promise<AppContext> {
  const logger = new Logger('AppFactory');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  logger.log('NestApplication created');

  await ConfigModule.envVariablesLoaded;
  logger.log('Environment Variables Loaded');

  const appConfig = app.get(ConfigService).get<AppConfig>(AppConfig.name);

  if (!appConfig) throw new Error('Unable to find AppConfig');

  logger.log(`setting app prefix: ${apiPrefix}`);
  app.setGlobalPrefix(apiPrefix);

  logger.log(`setting API versioning to "HEADER"`);
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'X-API-Version',
  });

  return { app, appConfig, apiPrefix };
}
