import { rootConfigModule, typeOrmModuleOptions } from '@core/config';
import {
  INestApplication,
  Logger,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as compression from 'compression';
import { readFileSync } from 'fs';
import * as helmet from 'helmet';
import { join } from 'path';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(rootConfigModule),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UserModule,
  ],
})
export class AppModule {
  static async bootstrap() {
    const logger = new Logger(`${AppModule.name}|bootstrap`);
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const message = AppModule.initSwagger(app);

    app.use(helmet());
    app.use(compression());
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    );

    await app.listen(3000);

    const url = await app.getUrl();

    logger.log(`Server is running at ${url}`);
    logger.log(message.replace(':url', url));
  }

  static initSwagger(app: INestApplication) {
    const swaggerPath = 'api/docs';
    const logger = new Logger(`${AppModule.name}|initSwagger`);
    const fileContent = readFileSync(join(__dirname, '../package.json'), {
      encoding: 'utf8',
    });
    const packageJson = JSON.parse(fileContent);
    const swaggerConfig = new DocumentBuilder()
      .setTitle(packageJson.name)
      .setVersion(packageJson.version)
      .setDescription(packageJson.description)
      // .addBearerAuth()
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, swaggerDocument);
    logger.log('SwaggerModule setup completed');

    return `Swagger is running at :url/${swaggerPath}`;
  }
}
