import { Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path/posix';
import { cwd } from 'process';

import { getSwaggerDocument } from '../../utils';
import { CommonAppFactory } from './common-app-factory.builder';

export async function OpenApiBuilder(fileName = 'openapi.json'): Promise<void> {
  const logger = new Logger('OpenApiBuilder');
  const { app } = await CommonAppFactory();

  logger.log(`Setting file paths`);

  const openApiPath = join(resolve(cwd()), 'api-docs/');

  if (!existsSync(openApiPath)) {
    mkdirSync(openApiPath, { recursive: true, mode: 0o755 });
  }

  const swaggerFilePath = join(openApiPath, fileName);

  logger.log(`building Swagger.json file`);

  const swaggerDocument = getSwaggerDocument(app, logger);
  const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

  logger.log(`Writing openOpenAPI file`);

  await writeFile(swaggerFilePath, swaggerFileContent, {
    encoding: 'utf8',
  });

  logger.log(`Closing NestJs application`);
  await app.close();
  logger.verbose(`file: ${swaggerFilePath} built successfully`);
}
