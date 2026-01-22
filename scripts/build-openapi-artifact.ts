import { Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { cwd, env } from 'node:process';

import { AppBootstrap } from '../src/app/bootstrap/app.bootstrap';

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
      APP_PORT: 0,
    });
  }

  private static async buildOpenApiArtifact(): Promise<void> {
    const fileName = 'open-api.json';
    const { app, appConfig, getSwaggerDocument } =
      await AppBootstrap.createAppContext();

    this.logger.log(
      `Preparing OpenAPI build for environment label "${appConfig.environmentLabel}"`,
    );

    const openApiPath = join(resolve(cwd()), 'api-docs');

    if (!existsSync(openApiPath)) {
      mkdirSync(openApiPath, { mode: 0o755, recursive: true });
    }

    const swaggerFilePath = join(openApiPath, fileName);

    this.logger.log(`Building '${fileName}' file`);

    const swaggerDocument = await getSwaggerDocument();
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
