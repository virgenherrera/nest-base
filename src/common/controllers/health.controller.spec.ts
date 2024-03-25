import { Test } from '@nestjs/testing';
import {
  mockHealthService,
  MockHealthServiceProvider,
} from '../services/__mocks__';
import { HealthController } from './health.controller';

describe(`UT:${HealthController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should getHealth from HealthService.',
  }

  let controller: HealthController = null;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [MockHealthServiceProvider],
    }).compile();

    controller = testingModule.get(HealthController);
  });

  it(should.init, async () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(HealthController);
  });

  it(should.getHealth, async () => {
    const queryArgs = { foo: 'bar', baz: 0 } as any;
    const expectedValue = { foo: 'bar', baz: 0 };
    mockHealthService.getHealth.mockResolvedValue(expectedValue);

    const getHealthSpy = jest.spyOn(mockHealthService, 'getHealth');

    await expect(controller.getHealth(queryArgs)).resolves.toBe(expectedValue);
    expect(getHealthSpy).toHaveBeenCalledWith(queryArgs);
  });
});
