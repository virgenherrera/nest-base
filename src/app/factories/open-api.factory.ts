import { Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { cwd } from 'process';

import { CommonAppFactory } from './common.factory';

export async function OpenApiFactory(): Promise<void> {
  const fileName = 'open-api.json';
  const logger = new Logger(OpenApiFactory.name);
  const { app, appConfig, getSwaggerDocument } = await CommonAppFactory();

  logger.log(
    `Preparing OpenAPI build for environment label "${appConfig.environmentLabel}"`,
  );

  const openApiPath = join(resolve(cwd()), 'api-docs/');

  if (!existsSync(openApiPath)) {
    mkdirSync(openApiPath, { mode: 0o755, recursive: true });
  }

  const swaggerFilePath = join(openApiPath, fileName);

  logger.log(`Building '${fileName}' file`);

  const swaggerDocument = getSwaggerDocument();
  const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

  logger.verbose(`Writing OpenAPI file to ${swaggerFilePath}`);

  await writeFile(swaggerFilePath, swaggerFileContent, {
    encoding: 'utf8',
  });

  logger.log(
    `Closing NestJs application after OpenAPI build for "${appConfig.environmentLabel}"`,
  );
  await app.close();
  logger.verbose(`file: ${swaggerFilePath} built successfully`);
}
