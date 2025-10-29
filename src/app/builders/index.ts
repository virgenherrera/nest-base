import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { cwd } from 'node:process';

import { writeFile } from 'node:fs/promises';
import { AppModule } from '../../app.module';
import { AppConfig } from '../../config';

export interface AppContext {
  apiPrefix: string;
  app: INestApplication;
  appConfig: AppConfig;
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

  return {
    apiPrefix,
    app,
    appConfig,
  };
}

export async function HttpAppBuilder(): Promise<void> {
  const logger = new Logger(HttpAppBuilder.name);
  const { app, appConfig, apiPrefix } = await CommonAppFactory();
  const mountSwagger = appConfig.environment === 'DEVELOPMENT';

  logger.log(`TODO:mounting App global middlewares`);

  // TODO: restore global Middlewares
  logger.verbose('Middlewares mounted successfully');

  if (mountSwagger) {
    logger.verbose('preparing Swagger Document');
    const { cleanupOpenApiDoc } = await import('nestjs-zod');
    const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setVersion(appConfig.version)
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, config);

    logger.verbose(
      `successfully created OpenAPI ${swaggerDocument.info.title}`,
    );

    logger.verbose(`mounting SwaggerDocs`);

    const jsonDocumentUrl = `${apiPrefix}/json`;
    const yamlDocumentUrl = `${apiPrefix}/yaml`;
    const cleanDoc = cleanupOpenApiDoc(swaggerDocument);

    SwaggerModule.setup(apiPrefix, app, cleanDoc, {
      jsonDocumentUrl,
      yamlDocumentUrl,
    });
  }

  await app.listen(appConfig.port, appConfig.hostname);
  const appUrl = await app.getUrl();
  logger.log(
    `HTTP service is running in "${appConfig.environment}" environment`,
  );
  logger.log(`Application is running on: ${appUrl}`);

  if (mountSwagger) {
    const url = new URL(apiPrefix, appUrl);
    const jsonDocumentUrl = `${apiPrefix}/json`;
    const yamlDocumentUrl = `${apiPrefix}/yaml`;

    logger.log(`SwaggerDocs available in: ${url.href}`);

    url.pathname = jsonDocumentUrl;

    logger.verbose(`Swagger JSON file available in: ${url.href}`);

    url.pathname = yamlDocumentUrl;

    logger.verbose(`Swagger YAML file available in: ${url.href}`);
  }
}

export async function OpenApiBuilder(): Promise<void> {
  const fileName = 'open-api.json';
  const logger = new Logger(OpenApiBuilder.name);
  const { app, appConfig } = await CommonAppFactory();

  logger.log(`Setting file paths`);

  const openApiPath = join(resolve(cwd()), 'api-docs/');

  if (!existsSync(openApiPath)) {
    mkdirSync(openApiPath, { mode: 0o755, recursive: true });
  }

  const swaggerFilePath = join(openApiPath, fileName);

  logger.log(`building Swagger.json file`);

  const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');
  const config = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setVersion(appConfig.version)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, config);

  logger.verbose(`successfully created OpenAPI ${swaggerDocument.info.title}`);

  const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

  logger.log(`Writing openOpenAPI file`);

  await writeFile(swaggerFilePath, swaggerFileContent, {
    encoding: 'utf8',
  });

  logger.log(`Closing NestJs application`);
  await app.close();
  logger.verbose(`file: ${swaggerFilePath} built successfully`);
}
