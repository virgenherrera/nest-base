import { Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { cwd } from 'process';

import { CommonAppFactory } from '../common';

export async function OpenApiFactory(): Promise<void> {
  const fileName = 'open-api.json';
  const logger = new Logger(OpenApiFactory.name);
  const { app, getSwaggerDocument } = await CommonAppFactory();

  logger.log(`Setting file paths`);

  const openApiPath = join(resolve(cwd()), 'api-docs/');

  if (!existsSync(openApiPath)) {
    mkdirSync(openApiPath, { mode: 0o755, recursive: true });
  }

  const swaggerFilePath = join(openApiPath, fileName);

  logger.log(`building '${fileName}' file`);

  const swaggerDocument = getSwaggerDocument();
  const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

  logger.log(`Writing openOpenAPI file`);

  await writeFile(swaggerFilePath, swaggerFileContent, {
    encoding: 'utf8',
  });

  logger.log(`Closing NestJs application`);
  await app.close();
  logger.verbose(`file: ${swaggerFilePath} built successfully`);
}
