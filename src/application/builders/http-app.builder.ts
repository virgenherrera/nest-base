import { Logger } from '@nestjs/common';

import { UpperEnvironments } from '../constants';
import { CommonAppFactory } from './common-app-factory.builder';

export async function HttpAppBuilder(): Promise<void> {
  const logger = new Logger('AppBootstrap');
  const { app, appConfig } = await CommonAppFactory();

  logger.log(`mounting App global middlewares`);

  // TODO: restore global Middlewares
  //logger.verbose('Middlewares mounted successfully');

  if (!UpperEnvironments.includes(appConfig.environment)) {
    const { getSwaggerDocument, setupSwaggerModule } = await import('../utils');
    const swaggerDocument = getSwaggerDocument({ app, appConfig, logger });

    setupSwaggerModule({ app, logger, swaggerDocument, appConfig });
  }

  await app.listen(appConfig.port);
  logger.log(
    `HTTP service is running in "${appConfig.environment}" environment`,
  );
}
