import { Test } from '@nestjs/testing';
import {
  mockHealthService,
  MockHealthServiceProvider,
} from '../services/__mocks__';
import { CoreController } from './core.controller';

describe(`UT: ${CoreController.name}`, () => {
  const enum should {
    init = 'Should be initialized properly.',
    getHealth = 'Should getHealth from HealthService.',
  }

  let controller: CoreController = null;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [MockHealthServiceProvider],
    }).compile();

    controller = testingModule.get(CoreController);
  });

  it(should.init, async () => {
    expect(controller).not.toBeNull();
    expect(controller).toBeInstanceOf(CoreController);
  });

  it(should.getHealth, async () => {
    const queryArgs = { foo: 'bar', baz: 0 } as any;
    const expectedValue = { foo: 'bar', baz: 0 };
    mockHealthService.getHealth = jest.fn().mockResolvedValue(expectedValue);

    const getHealthSpy = jest.spyOn(mockHealthService, 'getHealth');

    await expect(controller.getHealth(queryArgs)).resolves.toBe(expectedValue);
    expect(getHealthSpy).toHaveBeenCalledWith(queryArgs);
  });
});
