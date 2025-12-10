import { Logger } from '@nestjs/common';
import { CommonAppFactory } from './common.factory';

export async function HttpAppFactory(): Promise<void> {
  const logger = new Logger(HttpAppFactory.name);
  const { app, appConfig, apiPrefix, getSwaggerDocument } =
    await CommonAppFactory();
  const jsonDocumentUrl = `${apiPrefix}/json`;
  const yamlDocumentUrl = `${apiPrefix}/yaml`;

  logger.log('Mounting global middlewares');

  if (appConfig.enableCors) {
    app.enableCors();
    logger.verbose(`CORS middleware mounted`);
  }

  if (appConfig.enableHelmet) {
    const helmetModule = await import('helmet');
    const helmet =
      (helmetModule as Record<string, unknown>).default ?? helmetModule;

    app.use(helmet as unknown as (...args: unknown[]) => unknown);
    logger.verbose('Helmet middleware mounted');
  }

  if (appConfig.enableCompression) {
    const compressionModule = await import('compression');
    const compression =
      (compressionModule as Record<string, unknown>).default ??
      compressionModule;
    app.use(compression as unknown as (...args: unknown[]) => unknown);
    logger.verbose('Compression middleware mounted');
  }

  logger.verbose('Middlewares mounted successfully');

  if (appConfig.enableSwagger) {
    logger.verbose('Preparing Swagger Document');
    const { SwaggerModule } = await import('@nestjs/swagger');

    const swaggerDocument = await getSwaggerDocument();

    logger.verbose('Mounting SwaggerDocs');

    SwaggerModule.setup(apiPrefix, app, swaggerDocument, {
      jsonDocumentUrl,
      yamlDocumentUrl,
    });
  }

  await app.listen(appConfig.port, appConfig.hostname);
  const appUrl = await app.getUrl();
  logger.log(
    `HTTP service is running in "${appConfig.environmentLabel}" environment`,
  );
  logger.log(`Application is running on: ${appUrl}`);

  if (appConfig.enableSwagger) {
    const url = new URL(apiPrefix, appUrl);

    logger.log(`SwaggerDocs available in: ${url.href}`);

    url.pathname = jsonDocumentUrl;

    logger.verbose(`Swagger JSON file available in: ${url.href}`);

    url.pathname = yamlDocumentUrl;

    logger.verbose(`Swagger YAML file available in: ${url.href}`);
  }
}
