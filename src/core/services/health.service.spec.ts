import { Test, TestingModule } from '@nestjs/testing';
import { GetHealthQueryDto } from '../dto';
import { SystemHealth } from '../models';
import { HealthService } from './health.service';
import { MockLoggerProvider } from './__mocks__';

describe('UT:HealthService', () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getBasicHealth = 'should get basic SystemHealth.',
    getFullHealth = 'should get full SystemHealth.',
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

  it(should.getBasicHealth, async () => {
    const queryArgs: GetHealthQueryDto = {
      uptime: false,
      uptimeSince: false,
      cpuUsage: false,
      memoryUsage: false,
    };

    await expect(service.getHealth(queryArgs)).resolves.toBeInstanceOf(
      SystemHealth,
    );
  });

  it(should.getFullHealth, async () => {
    const queryArgs: GetHealthQueryDto = {
      cpuUsage: true,
      memoryUsage: true,
      uptime: true,
      uptimeSince: true,
    };

    await expect(service.getHealth(queryArgs)).resolves.toBeInstanceOf(
      SystemHealth,
    );
  });
});
