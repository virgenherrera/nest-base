import { Logger } from '@nestjs/common';
import { AppBootstrap } from './core/bootstrap/app.bootstrap';

class HttpAppMain {
  private static readonly logger = new Logger(HttpAppMain.name);

  static async main(): Promise<void> {
    try {
      await this.bootstrapHttpServer();
      this.registerProcessErrorHandlers();
    } catch (error) {
      this.logFatalAndExit(error);
    }
  }

  private static async bootstrapHttpServer(): Promise<void> {
    const {
      app,
      appConfig,
      serverConfig,
      swaggerConfig,
      apiPrefix,
      getSwaggerDocument,
    } = await AppBootstrap.createAppContext();
    const jsonDocumentUrl = `${apiPrefix}/json`;
    const yamlDocumentUrl = `${apiPrefix}/yaml`;

    this.logger.log('Mounting global middlewares');

    if (serverConfig.enableCors) {
      app.enableCors();
      this.logger.verbose('CORS middleware mounted');
    }

    if (serverConfig.enableHelmet) {
      const { default: helmetMiddleware } = await import('helmet');

      app.use(helmetMiddleware());
      this.logger.verbose('Helmet middleware mounted');
    }

    if (serverConfig.enableCompression) {
      const { default: compressionMiddleware } = await import('compression');

      app.use(compressionMiddleware());
      this.logger.verbose('Compression middleware mounted');
    }

    this.logger.verbose('Middlewares mounted successfully');

    if (swaggerConfig.enabled) {
      this.logger.verbose('Preparing Swagger Document');
      const { SwaggerModule } = await import('@nestjs/swagger');

      const swaggerDocument = await getSwaggerDocument();

      this.logger.verbose('Mounting SwaggerDocs');

      SwaggerModule.setup(apiPrefix, app, swaggerDocument, {
        jsonDocumentUrl,
        yamlDocumentUrl,
      });
    }

    await app.listen(serverConfig.port, serverConfig.hostname);
    const appUrl = await app.getUrl();
    this.logger.log(
      `HTTP service is running in "${appConfig.environmentLabel}" environment`,
    );
    this.logger.log(`Application is running on: ${appUrl}`);

    if (swaggerConfig.enabled) {
      const url = new URL(apiPrefix, appUrl);

      this.logger.log(`SwaggerDocs available in: ${url.href}`);

      url.pathname = jsonDocumentUrl;

      this.logger.verbose(`Swagger JSON file available in: ${url.href}`);

      url.pathname = yamlDocumentUrl;

      this.logger.verbose(`Swagger YAML file available in: ${url.href}`);
    }
  }

  private static registerProcessErrorHandlers(): void {
    process.on('uncaughtException', (error) => {
      this.logFatalAndExit(error);
    });
    process.on('unhandledRejection', (reason) => {
      const error =
        reason instanceof Error ? reason : new Error(String(reason));
      this.logFatalAndExit(error);
    });
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
