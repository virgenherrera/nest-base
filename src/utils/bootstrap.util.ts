import { TransformApiResponse } from '@core/interceptors';
import { APP_CONFIG } from '@core/tokens';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { AppModule } from 'src/app.module';

export async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const { port, useDocs } = configService.get(APP_CONFIG);
  const afterListenLogs: Record<string, string> = {
    'App bootstrap': 'Server is running at :url',
  };

  app.use(helmet());
  app.use(compression());
  app.useGlobalInterceptors(new TransformApiResponse());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  if (useDocs) {
    const { swaggerSetup } = await import('./swagger-setup.util');
    const afterMountLog = swaggerSetup(app);

    Object.assign(afterListenLogs, afterMountLog);
  }

  await app.listen(port);

  const url = await app.getUrl();

  Object.keys(afterListenLogs).forEach(logContext => {
    logger.setContext(logContext);
    logger.log(afterListenLogs[logContext].replace(':url', url));
  });
}
