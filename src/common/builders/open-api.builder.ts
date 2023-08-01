import { Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { getPackageMetadata } from '../../utils';
import { HttpAppBuilder } from './http-app.builder';

export class OpenApiBuilder {
  static async build() {
    return new OpenApiBuilder().bootstrap();
  }

  static swaggerFactory(logger: Logger): () => OpenAPIObject {
    return function getSwaggerDocument(): OpenAPIObject {
      logger.log(`preparing Swagger Document`);

      const packageJson = getPackageMetadata();
      const swaggerConfig = new DocumentBuilder()
        .setTitle(packageJson.name)
        .setVersion(packageJson.version)
        .setDescription(packageJson.description)
        .setLicense(packageJson.license, null)
        .build();
      const swaggerDocument = SwaggerModule.createDocument(
        HttpAppBuilder.app,
        swaggerConfig,
      );

      logger.log(`successfully created OpenAPI ${swaggerDocument.info.title}`);

      return swaggerDocument;
    };
  }

  private openApiPath = join(resolve(process.cwd()), 'api-docs/');
  private swaggerFilePath: string;
  private logger = {
    log: (message: any, context?: string) => {
      process.stdout.write('> ' + message + '\n');
      if (context) process.stdout.write(context + '\n');
    },
  } as Logger;

  async bootstrap() {
    await HttpAppBuilder.buildWithDocs();

    this.ensureApiDocsPath();

    await this.buildSwaggerJson();
  }

  private ensureApiDocsPath() {
    this.logger.log(`Setting file paths`);

    if (!existsSync(this.openApiPath)) {
      mkdirSync(this.openApiPath, { recursive: true, mode: '0777' });
    }

    this.swaggerFilePath = join(this.openApiPath, 'swagger.json');
  }

  private async buildSwaggerJson() {
    this.logger.log(`building Swagger.json file`);

    const swaggerFactory = OpenApiBuilder.swaggerFactory(this.logger);
    const swaggerDocument = swaggerFactory();
    const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

    this.logger.log(`Writing OpenAPI file in path: ${this.swaggerFilePath}`);

    await writeFile(this.swaggerFilePath, swaggerFileContent, {
      encoding: 'utf8',
    });

    this.logger.log(`Closing NestJs application` + '\n');
    HttpAppBuilder.app.close();
  }
}
