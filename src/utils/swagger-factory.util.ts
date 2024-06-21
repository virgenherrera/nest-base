import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { getPackageMetadata } from './get-package-metadata.util';

export function swaggerFactory(
  app: INestApplication,
  logger: Logger,
): () => OpenAPIObject {
  return function getSwaggerDocument(): OpenAPIObject {
    logger.log(`preparing Swagger Document`);

    const packageJson = getPackageMetadata();
    const swaggerConfig = new DocumentBuilder()
      .setTitle(packageJson.name)
      .setVersion(packageJson.version)
      .setDescription(packageJson.description)
      .setLicense(packageJson.license, null)
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    logger.log(`successfully created OpenAPI ${swaggerDocument.info.title}`);

    return swaggerDocument;
  };
}
