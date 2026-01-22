import { INestApplication, Logger } from '@nestjs/common';
import { CommonAppFactory } from './app/factories/common.factory';

class HttpAppMain {
  private static readonly logger = new Logger(HttpAppMain.name);
  private static app?: INestApplication;

  static async main(): Promise<void> {
    try {
      await this.bootstrapHttpServer();
      this.registerShutdownHooks();
    } catch (error) {
      this.logFatalAndExit(error);
    }
  }

  private static async bootstrapHttpServer(): Promise<void> {
    const { app, appConfig, apiPrefix, getSwaggerDocument } =
      await CommonAppFactory();
    this.app = app;
    const jsonDocumentUrl = `${apiPrefix}/json`;
    const yamlDocumentUrl = `${apiPrefix}/yaml`;

    this.logger.log('Mounting global middlewares');

    if (appConfig.enableCors) {
      app.enableCors();
      this.logger.verbose('CORS middleware mounted');
    }

    if (appConfig.enableHelmet) {
      const { default: helmetMiddleware } = await import('helmet');

      app.use(helmetMiddleware());
      this.logger.verbose('Helmet middleware mounted');
    }

    if (appConfig.enableCompression) {
      const { default: compressionMiddleware } = await import('compression');

      app.use(compressionMiddleware());
      this.logger.verbose('Compression middleware mounted');
    }

    this.logger.verbose('Middlewares mounted successfully');

    if (appConfig.enableSwagger) {
      this.logger.verbose('Preparing Swagger Document');
      const { SwaggerModule } = await import('@nestjs/swagger');

      const swaggerDocument = await getSwaggerDocument();

      this.logger.verbose('Mounting SwaggerDocs');

      SwaggerModule.setup(apiPrefix, app, swaggerDocument, {
        jsonDocumentUrl,
        yamlDocumentUrl,
      });
    }

    await app.listen(appConfig.port, appConfig.hostname);
    const appUrl = await app.getUrl();
    this.logger.log(
      `HTTP service is running in "${appConfig.environmentLabel}" environment`,
    );
    this.logger.log(`Application is running on: ${appUrl}`);

    if (appConfig.enableSwagger) {
      const url = new URL(apiPrefix, appUrl);

      this.logger.log(`SwaggerDocs available in: ${url.href}`);

      url.pathname = jsonDocumentUrl;

      this.logger.verbose(`Swagger JSON file available in: ${url.href}`);

      url.pathname = yamlDocumentUrl;

      this.logger.verbose(`Swagger YAML file available in: ${url.href}`);
    }
  }

  private static registerShutdownHooks(): void {
    process.on('SIGTERM', () => {
      void this.shutdown('SIGTERM');
    });
    process.on('SIGINT', () => {
      void this.shutdown('SIGINT');
    });
  }

  private static async shutdown(signal: string): Promise<void> {
    try {
      this.logger.log(`Received ${signal}, shutting down`);
      await this.app?.close();
      this.logger.log('Shutdown complete');
      this.exitProcess(0);
    } catch (error) {
      this.logFatalAndExit(error);
    }
  }

  private static logFatalAndExit(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    this.logger.error('Failed to start application', err.stack);
    this.exitProcess(1);
  }

  private static exitProcess(code: number): void {
    this.logger.log(`Process exiting with code ${code}`);
    process.exit(code);
  }
}

void HttpAppMain.main();
