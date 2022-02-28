import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Environment } from '../enums';
import { AppConfigService } from './app-config.service';

describe('UT:AppConfigService', () => {
  const enum should {
    createInstance = 'create instance Properly and set environment to Default.',
    getPort = `Should getPort provided in NODE_ENV.`,
    getOpenApi = `Should getOpenApi provided in NODE_ENV.`,
    getDefaultOpenApi = `Should default value for getOpenApi when not provided in NODE_ENV.`,
  }
  const MockConfigModule = {
    get: jest.fn(),
  };
  let service: AppConfigService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        { provide: ConfigService, useValue: MockConfigModule },
        AppConfigService,
      ],
    }).compile();

    service = module.get(AppConfigService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(AppConfigService);
    expect(service.environment).toEqual(Environment.development);
  });

  it(should.getPort, () => {
    const mockPORT = '3333';
    let port: number = null;

    MockConfigModule.get = jest.fn().mockReturnValue(mockPORT);

    expect(() => (port = service.port)).not.toThrow();
    expect(port).not.toBeNull();
    expect(port).not.toBeNaN();
    expect(port).toEqual(3333);
  });

  it(should.getOpenApi, () => {
    const mockEnv = {
      APP_OPEN_API_PATH: 'fake-path/',
    };

    MockConfigModule.get = jest
      .fn()
      .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

    expect(service.openApiPath).toBe(mockEnv.APP_OPEN_API_PATH);
  });

  it(should.getDefaultOpenApi, () => {
    const mockEnv = {};

    MockConfigModule.get = jest
      .fn()
      .mockImplementation((key: keyof typeof mockEnv) => mockEnv[key]);

    expect(service.openApiPath).toBe('dist/openApi-docs/');
  });
});
