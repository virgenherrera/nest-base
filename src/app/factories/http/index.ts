import { Logger } from '@nestjs/common';

import { CommonAppFactory } from '../common';

export async function HttpAppFactory(): Promise<void> {
  const logger = new Logger(HttpAppFactory.name);
  const { app, appConfig, apiPrefix, getSwaggerDocument } =
    await CommonAppFactory();
  const mountSwagger = appConfig.environment === 'DEVELOPMENT';

  logger.log(`mounting App global middlewares`);
  app.enableCors();
  logger.verbose('Middlewares mounted successfully');

  if (mountSwagger) {
    logger.verbose('preparing Swagger Document');
    const { SwaggerModule } = await import('@nestjs/swagger');

    const swaggerDocument = await getSwaggerDocument();

    logger.verbose(`mounting SwaggerDocs`);

    const jsonDocumentUrl = `${apiPrefix}/json`;
    const yamlDocumentUrl = `${apiPrefix}/yaml`;

    SwaggerModule.setup(apiPrefix, app, swaggerDocument, {
      jsonDocumentUrl,
      yamlDocumentUrl,
    });
  }

  await app.listen(appConfig.port, appConfig.hostname);
  const appUrl = await app.getUrl();
  logger.log(
    `HTTP service is running in "${appConfig.environment}" environment`,
  );
  logger.log(`Application is running on: ${appUrl}`);

  if (mountSwagger) {
    const url = new URL(apiPrefix, appUrl);
    const jsonDocumentUrl = `${apiPrefix}/json`;
    const yamlDocumentUrl = `${apiPrefix}/yaml`;

    logger.log(`SwaggerDocs available in: ${url.href}`);

    url.pathname = jsonDocumentUrl;

    logger.verbose(`Swagger JSON file available in: ${url.href}`);

    url.pathname = yamlDocumentUrl;

    logger.verbose(`Swagger YAML file available in: ${url.href}`);
  }
}
