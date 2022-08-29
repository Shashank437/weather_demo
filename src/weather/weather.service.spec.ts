import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityDto } from './dto/create_city.dto';
import { weatherInfoDto } from './dto/weather.dto';
import { City } from './entity/city.entity';
import { WeatherService } from './weather.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('WeatherService', () => {
  let service: WeatherService;
  let repo: Repository<City>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        WeatherService,
        {
          provide: getRepositoryToken(City),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<WeatherService>(WeatherService);
    repo = module.get<Repository<City>>(getRepositoryToken(City));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for findAll', async () => {
    const testPhoto: City = {
      id: 1,
      city_name: 'Mumbai',
    };
    jest.spyOn(repo, 'find').mockResolvedValueOnce([testPhoto]);
    expect(await service.findAll()).toEqual([testPhoto]);
  });

  it('should return for findOne', async () => {
    const id = 1;
    const testCity: City = {
      id: 1,
      city_name: 'Mumbai',
    };
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testCity);
    expect(await service.findOne(id)).toEqual(testCity);
    expect(repo.findOne).toBeCalledWith({ where: { id } });
  });

  it('should return error for findOne', async () => {
    const id = 1;
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    expect(service.findOne(id)).rejects.toThrowError(HttpException);
  });

  it('should return created city for create', async () => {
    const testCity: City = {
      id: 1,
      city_name: 'Mumbai',
    };
    const cityBody: CityDto = {
      name: 'Mumbai',
    };
    jest.spyOn(repo, 'save').mockResolvedValueOnce(testCity);
    jest.spyOn(service, 'findByCity').mockResolvedValueOnce(null);
    expect(await service.create(cityBody)).toEqual(testCity);
    expect(service.findByCity).toBeCalledWith('Mumbai');
    expect(repo.save).toBeCalledWith({ city_name: 'Mumbai' });
  });

  it('should return error (no data) for create', async () => {
    jest.spyOn(repo, 'save').mockResolvedValueOnce(null);
    jest.spyOn(service, 'findByCity').mockResolvedValueOnce(null);

    expect(service.create(null)).rejects.toThrowError(HttpException);
    expect(service.create(null)).rejects.toThrow('plzz provide data');
    expect(service.findByCity).toBeCalledTimes(0);
    expect(repo.save).toBeCalledTimes(0);
  });

  it('should return error already exist create', async () => {
    const testCity: City = {
      id: 1,
      city_name: 'Mumbai',
    };
    const cityBody: CityDto = {
      name: 'Mumbai',
    };
    jest.spyOn(repo, 'save');
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testCity);
    jest.spyOn(service, 'findByCity');
    expect(service.create(cityBody)).rejects.toThrowError(HttpException);
    expect(service.findByCity).toBeCalledWith('Mumbai');
    expect(repo.save).toBeCalledTimes(0);
  });

  it('should return update error for not found', async () => {
    const id = 1;
    const cityBody: CityDto = {
      name: 'Mumbai',
    };
    jest.spyOn(repo, 'createQueryBuilder');
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    expect(service.update(id, cityBody)).rejects.toThrowError(HttpException);
    expect(repo.createQueryBuilder).toBeCalledTimes(0);
  });

  it('should return update error empty data', async () => {
    const id = 1;
    const cityBody = null;
    jest.spyOn(repo, 'createQueryBuilder');
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    expect(service.update(id, cityBody)).rejects.toThrowError(HttpException);
    expect(repo.createQueryBuilder).toBeCalledTimes(0);
    expect(repo.findOne).toBeCalledTimes(1);
  });

  it('should return updated city', async () => {
    const id = 1;
    const testCity: City = {
      id: 1,
      city_name: 'Mumbai',
    };
    const cityBody: CityDto = {
      name: 'Mumbai',
    };
    const createQueryBuilder: any = {
      update: () => createQueryBuilder,
      where: () => createQueryBuilder,
      groupBy: () => createQueryBuilder,
      returning: () => createQueryBuilder,
      updateEntity: () => createQueryBuilder,
      execute: () => {
        return {
          raw: [testCity],
        };
      },
    };

    jest
      .spyOn(repo, 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilder);
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testCity);
    jest.spyOn(createQueryBuilder, 'update');

    expect(await service.update(id, cityBody)).toEqual(testCity);
    expect(createQueryBuilder.update).toBeCalledWith(City, {
      city_name: 'Mumbai',
    });
  });

  it('should return weather data', async () => {
    const id = 1;
    const testCity: City = {
      id: 1,
      city_name: 'Mumbai',
    };
    const weatherInfo: weatherInfoDto = {
      weather: [
        {
          id: 721,
          main: 'Haze',
          description: 'haze',
          icon: '50n',
        },
      ],
      main: {
        temp: 26.99,
        feels_like: 30.6,
        temp_min: 26.99,
        temp_max: 26.99,
        pressure: 1007,
        humidity: 89,
      },
      visibility: 3000,
      wind: {
        speed: 3.6,
        deg: 230,
      },
      clouds: {
        all: 75,
      },
      sys: {
        type: 1,
        id: 9052,
        country: 'IN',
        sunrise: 1661475151,
        sunset: 1661520539,
      },
      name: 'Mumbai',
    };
    const result: AxiosResponse = {
      data: weatherInfo,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testCity);
    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));

    (await service.getWeatherInfo(id)).subscribe((res) => {
      expect(res).toEqual(result.data);
    });
  });
});
