import { Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { cwd } from 'node:process';
import { join, resolve } from 'path';

import { getSwaggerDocument } from '../utils';
import { CommonAppFactory } from './common-app-factory.builder';

export async function OpenApiBuilder(
  fileName = 'open-api.json',
): Promise<void> {
  const logger = new Logger('OpenApiBuilder');
  const { app, appConfig } = await CommonAppFactory();

  logger.log(`Setting file paths`);

  const openApiPath = join(resolve(cwd()), 'api-docs/');

  if (!existsSync(openApiPath)) {
    mkdirSync(openApiPath, { recursive: true, mode: 0o755 });
  }

  const swaggerFilePath = join(openApiPath, fileName);

  logger.log(`building Swagger.json file`);

  const swaggerDocument = getSwaggerDocument({ app, appConfig, logger });
  const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

  logger.log(`Writing openOpenAPI file`);

  await writeFile(swaggerFilePath, swaggerFileContent, {
    encoding: 'utf8',
  });

  logger.log(`Closing NestJs application`);
  await app.close();
  logger.verbose(`file: ${swaggerFilePath} built successfully`);
}
