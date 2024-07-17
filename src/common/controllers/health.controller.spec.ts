import { HealthCheckService } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe(`UT:${HealthController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should return "up" status.',
  }

  let mockHealthCheckService: HealthCheckService = null;
  let controller: HealthController = null;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = testingModule.get(HealthController);
    controller.onModuleInit();

    mockHealthCheckService = testingModule.get(HealthCheckService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it(should.init, async () => {
    expect(controller).not.toBeNull();
    expect(mockHealthCheckService).not.toBeNull();
    expect(controller).toBeInstanceOf(HealthController);
  });

  it(should.getHealth, async () => {
    const checkSpy = jest
      .spyOn(mockHealthCheckService, 'check')
      .mockImplementation(checkArgs => checkArgs as any);

    const result = await controller.getHealth();

    expect(result).toMatchObject(
      expect.arrayContaining([expect.any(Function)]),
    );

    await expect(result[0]()).resolves.toMatchObject({
      uptime: {
        status: 'up',
        duration: expect.stringContaining('less than a minute'),
      },
    });

    expect(checkSpy).toHaveBeenCalledTimes(1);
  });
});
