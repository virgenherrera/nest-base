import { Logger, VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { cwd, env } from 'node:process';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from '../src/app.module';
import { AppConfig } from '../src/config';

class OpenApiArtifactBuilder {
  private static readonly logger = new Logger(OpenApiArtifactBuilder.name);

  static async main(): Promise<void> {
    try {
      this.applyBuildEnvironment();
      await this.buildOpenApiArtifact();
      this.exitProcess(0);
    } catch (error) {
      this.logFatalAndExit(error);
    }
  }

  private static applyBuildEnvironment(): void {
    Object.assign(env, {
      APP_ENV: 'BUILD-API-DOCS',
      APP_LOG_LEVELS: '',
      SERVER_PORT: '0',
    });
  }

  private static async buildOpenApiArtifact(): Promise<void> {
    const fileName = 'open-api.json';
    const apiPrefix = 'api';
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    await ConfigModule.envVariablesLoaded;

    app.setGlobalPrefix(apiPrefix);
    app.enableVersioning({
      header: 'X-API-Version',
      type: VersioningType.HEADER,
    });

    const appConfig = app.get(ConfigService).get<AppConfig>(AppConfig.name);

    if (!appConfig) {
      throw new Error(`Unable to find ${AppConfig.name}`);
    }

    this.logger.log(
      `Preparing OpenAPI build for environment label "${appConfig.environmentLabel}"`,
    );

    const openApiPath = join(resolve(cwd()), 'api-docs');

    if (!existsSync(openApiPath)) {
      mkdirSync(openApiPath, { mode: 0o755, recursive: true });
    }

    const swaggerFilePath = join(openApiPath, fileName);

    this.logger.log(`Building '${fileName}' file`);

    const config = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setVersion(appConfig.version)
      .build();
    const swaggerDocument = cleanupOpenApiDoc(
      SwaggerModule.createDocument(app, config),
    );
    const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

    this.logger.verbose(`Writing OpenAPI file to ${swaggerFilePath}`);

    await writeFile(swaggerFilePath, swaggerFileContent, {
      encoding: 'utf8',
    });

    this.logger.log(
      `Closing NestJs application after OpenAPI build for "${appConfig.environmentLabel}"`,
    );
    await app.close();
    this.logger.verbose(`file: ${swaggerFilePath} built successfully`);
  }

  private static logFatalAndExit(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    this.logger.error('Failed to build OpenAPI artifact', err.stack);
    this.exitProcess(1);
  }

  private static exitProcess(code: number): void {
    this.logger.log(`Process exiting with code ${code}`);
    process.exit(code);
  }
}

void OpenApiArtifactBuilder.main();
