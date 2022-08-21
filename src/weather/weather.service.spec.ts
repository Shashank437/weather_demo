import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { City } from './entity/city.entity';
import { WeatherService } from './weather.service';

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

describe('WeatherService', () => {
  let service: WeatherService;
  let cityRepository: Repository<City>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        WeatherService,
        {
          provide: getRepositoryToken(City),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return second data', () => {
    expect(service.findOne(2)).toEqual({
      name: 'Mumbai',
      id: 2,
    });
  });
});
