import { Logger } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

import { getSwaggerDocument, setupSwaggerModule } from '../../utils';
import { UpperEnvironments } from '../constants';
import { CommonAppFactory } from './common-app-factory.builder';

export async function HttpAppBuilder(): Promise<void> {
  const logger = new Logger('AppBootstrap');
  const { app, appConfig, apiPrefix } = await CommonAppFactory();

  logger.log(`mounting App global middlewares`);
  app.use(helmet());
  app.use(compression());
  logger.verbose('Middlewares mounted successfully');

  if (!UpperEnvironments.includes(appConfig.environment)) {
    const swaggerDocument = getSwaggerDocument(app, logger);

    setupSwaggerModule(logger, apiPrefix, app, swaggerDocument);

    logger.verbose(
      `SwaggerDocs available in: http://localhost:${appConfig.port}/${apiPrefix}/`,
    );

    await app.listen(appConfig.port);
    logger.log(
      `HTTP service is running in "${appConfig.environment}" environment`,
    );
  }
}
