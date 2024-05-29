import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe(`UT:${HealthController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should return "up" status.',
  }

  let testingModule: TestingModule = null;
  let controller: HealthController = null;
  let mockHealthCheckService: jest.Mocked<HealthCheckService>;

  beforeAll(async () => {
    mockHealthCheckService = {
      check: jest.fn(),
    } as any;

    testingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
      ],
    }).compile();

    controller = testingModule.get(HealthController);
    controller.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(should.init, async () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(HealthController);
  });

  it(should.getHealth, async () => {
    const mockResult: HealthCheckResult = {
      status: 'ok',
      details: {
        uptime: {
          status: 'up',
          duration: 'unknown',
        },
      },
    };
    mockHealthCheckService.check.mockResolvedValue(mockResult);

    const result = await controller.getHealth();

    expect(result.details.uptime.status).toEqual('up');
    expect(mockHealthCheckService.check).toHaveBeenCalledTimes(1);
  });
});
