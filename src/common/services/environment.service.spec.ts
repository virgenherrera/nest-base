import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Environment } from '../enums';
import { EnvironmentService } from './environment.service';

describe(`UT:${EnvironmentService.name}`, () => {
  const enum should {
    createInstance = 'create instance Properly and set environment to Default.',
  }

  const mockNodeEnv = {
    NODE_ENV: Environment.test,
    APP_PORT: '3333',
  };
  const mockGetImplementation = (envKey: string) => mockNodeEnv[envKey];

  const MockConfigModule = {
    get: jest.fn().mockImplementation(mockGetImplementation),
  };
  const configServiceProvider = {
    provide: ConfigService,
    useValue: MockConfigModule,
  };
  let service: EnvironmentService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [configServiceProvider, EnvironmentService],
    }).compile();

    service = module.get(EnvironmentService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(EnvironmentService);
    expect(service.environment).toEqual(mockNodeEnv.NODE_ENV);
    expect(service.port).not.toBeNull();
    expect(service.port).not.toBeNaN();
    expect(service.port).toBe(Number(mockNodeEnv.APP_PORT));
  });
});
