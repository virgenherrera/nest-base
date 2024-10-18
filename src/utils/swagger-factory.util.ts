import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { getPackageMetadata } from './get-package-metadata.util';

export function getSwaggerDocument(
  app: INestApplication,
  logger: Logger,
): OpenAPIObject {
  logger.log(`preparing Swagger Document`);

  const packageJson = getPackageMetadata();
  const swaggerConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setVersion(packageJson.version)
    .setDescription(packageJson.description)
    .setLicense(packageJson.license, null)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  logger.verbose(`successfully created OpenAPI ${swaggerDocument.info.title}`);

  return swaggerDocument;
}

export function setupSwaggerModule(
  logger: Logger,
  apiPrefix: string,
  app,
  swaggerDocument,
) {
  logger.log(`Mounting SwaggerDocs in: ${apiPrefix}/ path`);
  SwaggerModule.setup(apiPrefix, app, swaggerDocument);
}
