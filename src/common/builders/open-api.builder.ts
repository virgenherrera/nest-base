import { INestApplication, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { cwd, stdout } from 'node:process';
import { join, resolve } from 'path';

import { swaggerFactory } from '../../utils';

export class OpenApiBuilder {
  static async build(): Promise<void> {
    await new OpenApiBuilder().init();
  }

  private app: INestApplication = null;
  private openApiPath = join(resolve(cwd()), 'api-docs/');
  private swaggerFilePath: string;
  private logger = {
    log: (message: any) => {
      stdout.write('> ' + message + '\n');
    },
  } as Logger;

  private async init() {
    const { HttpAppBuilder } = await import('./http-app.builder');

    this.app = await HttpAppBuilder.buildWithDocs();

    this.ensureApiDocsPath();

    await this.buildSwaggerJson();
  }

  private ensureApiDocsPath() {
    this.logger.log(`Setting file paths`);

    if (!existsSync(this.openApiPath)) {
      mkdirSync(this.openApiPath, { recursive: true, mode: '0777' });
    }

    this.swaggerFilePath = join(this.openApiPath, 'openapi.json');
  }

  private async buildSwaggerJson() {
    this.logger.log(`building Swagger.json file`);

    const factory = swaggerFactory(this.app, this.logger);
    const swaggerDocument = factory();
    const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

    this.logger.log(`Writing OpenAPI file in path: ${this.swaggerFilePath}`);

    await writeFile(this.swaggerFilePath, swaggerFileContent, {
      encoding: 'utf8',
    });

    this.logger.log(`Closing NestJs application` + '\n');
    await this.app.close();
    this.logger.log(`Swagger.json file built successfully` + '\n');
  }
}
