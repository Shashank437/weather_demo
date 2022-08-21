import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { Response } from 'express';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { City } from './entity/city.entity';

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
  let responseObject = {};
  let status;
  const response: Partial<Response> = {
    send: jest.fn().mockImplementation((result) => {
      responseObject = result;
    }),
    status: jest.fn().mockImplementation((result) => {
      status = result;
      send: () => {
        return 'Hello';
      };
    }),
  };

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
});
