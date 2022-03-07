import { Test } from '@nestjs/testing';
import { HealthService } from '../services';
import { CoreController } from './core.controller';

describe(`UT: ${CoreController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should getHealth from HealthService.',
  }

  const mockHealthService = {
    getHealth: jest.fn(),
  } as any as HealthService;
  let controller: CoreController = null;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = testingModule.get(CoreController);
  });

  it(should.init, async () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(CoreController);
  });

  it(should.getHealth, async () => {
    const expectedValue = [{}, {}, {}];
    mockHealthService.getHealth = jest.fn().mockResolvedValue(expectedValue);

    const getHealthSpy = jest.spyOn(mockHealthService, 'getHealth');

    await expect(controller.getHealth()).resolves.toBe(expectedValue);
    expect(getHealthSpy).toHaveBeenCalled();
  });
});
