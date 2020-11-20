import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';

export function swaggerSetup(app: INestApplication) {
  const swaggerRoutePath = 'api-docs';
  const afterListenLog = {
    swaggerSetup: `Swagger docs available on path: :url/${swaggerRoutePath}`,
  };
  const fileContent = readFileSync(join(__dirname, '../../package.json'), {
    encoding: 'utf8',
    flag: 'r',
  });
  const packageJson = JSON.parse(fileContent);
  const swaggerConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setVersion(packageJson.version)
    .setDescription(packageJson.description)
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerRoutePath, app, swaggerDocument, {
    explorer: true,
  });

  return afterListenLog;
}
