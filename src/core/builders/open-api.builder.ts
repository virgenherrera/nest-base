import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { getPackageMetadata } from '@utils';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { AppConfigService } from '../services';
import { AppBuilder } from './app-bootstrap.builder';

export class OpenApiBuilder {
  static async exec() {
    return new OpenApiBuilder().exec();
  }

  private app: NestExpressApplication;
  private swaggerConfig: Omit<OpenAPIObject, 'paths'>;
  private appConfigService: AppConfigService;
  private logger = new Logger(this.constructor.name);
  private rootPath: string;
  private openApiPath: string;
  private swaggerFilePath: string;

  async exec() {
    this.app = await AppBuilder.bootstrap(true);

    this.setServices();
    this.setFilePaths();
    await this.buildSwaggerJson();
  }

  private setServices() {
    this.appConfigService = this.app.get(AppConfigService);
  }

  private setFilePaths() {
    this.logger.log(`Setting file paths`);

    this.rootPath = resolve(process.cwd());
    const { openApiPath } = this.appConfigService;
    this.openApiPath = join(this.rootPath, openApiPath);

    if (!existsSync(this.openApiPath)) {
      mkdirSync(this.openApiPath, { recursive: true, mode: '0777' });
    }

    this.swaggerFilePath = join(this.openApiPath, 'swagger.json');
  }

  private async buildSwaggerJson() {
    this.logger.log(`building Swagger.json file`);

    const packageJson = getPackageMetadata();
    this.swaggerConfig = new DocumentBuilder()
      .setTitle(packageJson.name)
      .setVersion(packageJson.version)
      .setDescription(packageJson.description)
      .setLicense(packageJson.license, null)
      .build();
    const swaggerDocument = SwaggerModule.createDocument(
      this.app,
      this.swaggerConfig,
    );
    const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

    this.logger.log(
      `Writing OpenAPI file in path: ${this.swaggerFilePath}`,
      OpenApiBuilder.name,
    );
    writeFileSync(this.swaggerFilePath, swaggerFileContent, {
      encoding: 'utf8',
    });

    this.logger.log(`closing NestJs application`);
    this.app.close();
  }
}

OpenApiBuilder.exec();
