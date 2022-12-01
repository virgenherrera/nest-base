import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { getPackageMetadata } from '../../utils';
import { EnvConfigService } from '../services';
import { HttpAppBuilder } from './http-app.builder';

export class OpenApiBuilder {
  static async build() {
    return new OpenApiBuilder().bootstrap();
  }

  private swaggerConfig: Omit<OpenAPIObject, 'paths'>;
  private appConfigService: EnvConfigService;
  private rootPath: string;
  private openApiPath: string;
  private swaggerFilePath: string;

  async bootstrap() {
    await HttpAppBuilder.build(true);

    this.setServices();
    this.setFilePaths();

    await this.buildSwaggerJson();
  }

  private logger(messages: any) {
    process.stdout.write('> ' + messages + '\n');
  }

  private setServices() {
    this.appConfigService = HttpAppBuilder.app.get(EnvConfigService);
  }

  private setFilePaths() {
    this.logger(`Setting file paths`);

    this.rootPath = resolve(process.cwd());
    const { openApiPath } = this.appConfigService;
    this.openApiPath = join(this.rootPath, openApiPath);

    if (!existsSync(this.openApiPath)) {
      mkdirSync(this.openApiPath, { recursive: true, mode: '0777' });
    }

    this.swaggerFilePath = join(this.openApiPath, 'swagger.json');
  }

  private async buildSwaggerJson() {
    this.logger(`building Swagger.json file`);

    const packageJson = getPackageMetadata();
    this.swaggerConfig = new DocumentBuilder()
      .setTitle(packageJson.name)
      .setVersion(packageJson.version)
      .setDescription(packageJson.description)
      .setLicense(packageJson.license, null)
      .build();
    const swaggerDocument = SwaggerModule.createDocument(
      HttpAppBuilder.app,
      this.swaggerConfig,
    );
    const swaggerFileContent = JSON.stringify(swaggerDocument, null, 2);

    this.logger(`Writing OpenAPI file in path: ${this.swaggerFilePath}`);

    await writeFile(this.swaggerFilePath, swaggerFileContent, {
      encoding: 'utf8',
    });

    this.logger(`Closing NestJs application` + '\n');
    HttpAppBuilder.app.close();
  }
}
