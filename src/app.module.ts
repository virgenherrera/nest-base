import { rootConfigModule, typeOrmModuleOptions } from '@core/config';
import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(rootConfigModule),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UserModule,
  ],
  controllers: [],
})
export class AppModule {
  static async bootstrap() {
    const logger = new Logger(`${AppModule.name}|bootstrap`);
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(helmet());
    app.use(compression());
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    );

    await app.listen(3000);

    logger.log(`Server is running at ${await app.getUrl()}`);
  }
}
