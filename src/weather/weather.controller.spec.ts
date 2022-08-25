import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { City } from './entity/city.entity';
import { lastValueFrom } from 'rxjs';

const createMock = jest.fn((dto: any) => {
  return dto;
});

const saveMock = jest.fn((dto: any) => {
  return dto;
});

const findMock = jest.fn((c_id) => {
  return {
    name: 'Mumbai',
    id: c_id.where.id,
  };
});

const MockRepository = jest.fn().mockImplementation(() => {
  return {
    create: createMock,
    save: saveMock,
    findOne: findMock,
  };
});
const mockRepository = new MockRepository();

describe('WeatherController', () => {
  let controller: WeatherController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [WeatherController],
      providers: [
        WeatherService,
        {
          provide: getRepositoryToken(City),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a object defined', async () => {
    expect(await controller.findOne(1)).toEqual({ name: 'Mumbai', id: 1 });
  });
  it('should return a object defined', async () => {
    expect(lastValueFrom(await controller.getWeatherData(1))).toEqual({
      name: 'Mumbai',
      id: 1,
    });
  });
});
