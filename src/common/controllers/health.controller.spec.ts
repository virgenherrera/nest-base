import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { CpuHealthIndicator, UptimeHealthIndicator } from '../indicators';
import {} from '../services/__mocks__';
import { HealthController } from './health.controller';

describe(`UT:${HealthController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should check health.',
  }

  let testingModule: TestingModule = null;
  let controller: HealthController = null;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: { check: jest.fn() },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: { checkHeap: jest.fn() },
        },
        {
          provide: CpuHealthIndicator,
          useValue: { check: jest.fn() },
        },
        {
          provide: UptimeHealthIndicator,
          useValue: { check: jest.fn() },
        },
      ],
    }).compile();

    controller = testingModule.get(HealthController);
  });

  it(should.init, async () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(HealthController);
  });

  it(should.getHealth, async () => {
    const expectedValue = { status: 'ok' } as any;

    const healthCheckService = testingModule.get(HealthCheckService);

    jest.spyOn(healthCheckService, 'check').mockResolvedValue(expectedValue);

    await expect(controller.getHealth()).resolves.toEqual(expectedValue);

    expect(healthCheckService.check).toHaveBeenCalledTimes(1);
  });
});
