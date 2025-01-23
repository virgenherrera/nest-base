import { Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { URL } from 'url';
import { AppContext } from '../builders/common-app-factory.builder';

interface getSwaggerDocumentParams {
  app: AppContext['app'];
  appConfig: AppContext['appConfig'];
  logger: Logger;
}

interface setupSwaggerModuleParams extends getSwaggerDocumentParams {
  apiDocsPath?: string;
  swaggerDocument: OpenAPIObject;
}

export function getSwaggerDocument({
  app,
  appConfig,
  logger,
}: getSwaggerDocumentParams): OpenAPIObject {
  logger.log(`preparing Swagger Document`);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setVersion(appConfig.version)
    .setDescription(appConfig.description)
    .setLicense(appConfig.license, '')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  logger.verbose(`successfully created OpenAPI ${swaggerDocument.info.title}`);

  return swaggerDocument;
}

export function setupSwaggerModule({
  apiDocsPath = 'api-docs',
  app,
  logger,
  swaggerDocument,
  appConfig,
}: setupSwaggerModuleParams): void {
  const url = new URL(apiDocsPath, `http://localhost:${appConfig.port}`);
  const jsonDocumentUrl = `${apiDocsPath}/json`;
  const yamlDocumentUrl = `${apiDocsPath}/yaml`;

  logger.log(`settingUp SwaggerDocs`);
  SwaggerModule.setup(apiDocsPath, app, swaggerDocument, {
    jsonDocumentUrl,
    yamlDocumentUrl,
  });

  logger.verbose(`SwaggerDocs available in: ${url.href}`);

  url.pathname = jsonDocumentUrl;

  logger.verbose(`Swagger JSON file available in: ${url.href}`);

  url.pathname = yamlDocumentUrl;

  logger.verbose(`Swagger YAML file available in: ${url.href}`);
}
