import { Test, TestingModule } from '@nestjs/testing';
import { SystemHealth } from '../models';
import { HealthService } from './health.service';
import { MockLoggerProvider } from './__mocks__';

describe('UT:HealthService', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getHealth = 'should get SystemHealth.',
  }
  let service: HealthService = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService, MockLoggerProvider],
    }).compile();

    service = module.get(HealthService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(HealthService);
  });

  it(should.getHealth, async () => {
    await expect(service.getHealth()).resolves.toBeInstanceOf(SystemHealth);
  });
});
