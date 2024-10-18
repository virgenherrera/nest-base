import { INestApplication, Logger } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { getPackageMetadata } from './get-package-metadata.util';
import { getSwaggerDocument, setupSwaggerModule } from './swagger-factory.util';

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn().mockReturnValue({
    setTitle: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setLicense: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue('swaggerConfig'),
  }),
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue({
      info: { title: 'mock-title' },
    }),
    setup: jest.fn(),
  },
}));

jest.mock('./get-package-metadata.util', () => ({
  getPackageMetadata: jest.fn().mockReturnValue({
    name: 'test-name',
    version: '1.0.0',
    description: 'test-description',
    license: 'test-license',
  }),
}));

describe(`UT:${getSwaggerDocument.name}`, () => {
  let app: INestApplication;
  let logger: Logger;

  beforeEach(() => {
    app = {} as INestApplication;
    logger = {
      log: jest.fn(),
      verbose: jest.fn(),
    } as unknown as Logger;
  });

  it('should create Swagger document', () => {
    let result: OpenAPIObject = null;

    expect(() => (result = getSwaggerDocument(app, logger))).not.toThrow();
    expect(result).not.toBeNull();

    expect(getPackageMetadata).toHaveBeenCalledTimes(1);
    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(
      app,
      'swaggerConfig',
    );
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.verbose).toHaveBeenCalledTimes(1);
  });
});

describe(`UT:${setupSwaggerModule.name}`, () => {
  let logger: Logger;
  let app: INestApplication;
  let swaggerDocument: any;

  beforeEach(() => {
    app = {} as INestApplication;
    swaggerDocument = {};
    logger = {
      log: jest.fn(),
    } as unknown as Logger;
  });

  it('should set up Swagger module', () => {
    const apiPrefix = 'api';

    expect(() =>
      setupSwaggerModule(logger, apiPrefix, app, swaggerDocument),
    ).not.toThrow();

    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      apiPrefix,
      app,
      swaggerDocument,
    );
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(
      'Mounting SwaggerDocs in: api/ path',
    );
  });
});
