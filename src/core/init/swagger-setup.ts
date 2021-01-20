import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { appRoutes } from 'src/app.routes';

export function swaggerSetup(app: INestApplication) {
  const afterListenLog = {
    swaggerSetup: `Swagger docs available on path: :url/${appRoutes.apiDocs}`,
  };
  const packageJson = JSON.parse(
    readFileSync(join(__dirname, '../../../package.json'), {
      encoding: 'utf8',
      flag: 'r',
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setVersion(packageJson.version)
    .setDescription(packageJson.description)
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(appRoutes.apiDocs, app, swaggerDocument, {
    explorer: true,
  });

  return afterListenLog;
}
