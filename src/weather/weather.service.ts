import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CityDto } from './dto/create_city.dto';
import { weatherInfoDto } from './dto/weather.dto';
import { City } from './entity/city.entity';

@Injectable()
export class WeatherService {
  private apiKey = process.env.API_KEY;
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(cityDto: CityDto): Promise<City> {
    if (!cityDto) {
      throw new HttpException('plzz provide data', HttpStatus.BAD_REQUEST);
    } else if (await this.findByCity(cityDto.name)) {
      throw new HttpException(
        'the required city already exists',
        HttpStatus.CONFLICT,
      );
    } else {
      const city: City = new City();
      city.city_name = cityDto.name;
      return await this.cityRepository.save(city);
    }
  }

  async findOne(id: number): Promise<City> {
    const data = await this.cityRepository.findOne({ where: { id } });
    if (!data) {
      throw new HttpException(
        'the required city is not found!',
        HttpStatus.NOT_FOUND,
      );
    }
    return data;
  }

  async findAll(): Promise<City[]> {
    return this.cityRepository.find();
  }

  async update(id: number, cityDto: CityDto) {
    const old_data = await this.cityRepository.findOne({ where: { id } });
    if (!old_data) {
      throw new HttpException(
        'the required city is not found!',
        HttpStatus.NOT_FOUND,
      );
    } else if (!cityDto) {
      throw new HttpException('plzz provide data', HttpStatus.BAD_REQUEST);
    } else {
      const city: City = new City();
      city.city_name = cityDto.name;
      const updatedCity = await this.cityRepository
        .createQueryBuilder()
        .update(City, city)
        .where('city.id = :id', { id: id })
        .returning('*')
        .updateEntity(true)
        .execute();
      return updatedCity.raw[0];
    }
  }

  async remove(id: number) {
    const data = await this.cityRepository.delete(id);
    if (data.affected == 0) {
      throw new HttpException(
        'Trying to delete something which not exists',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return data;
    }
  }

  async findByCity(name: string): Promise<City> {
    const data = await this.cityRepository.findOne({
      where: { city_name: name },
    });
    return data;
  }

  async getWeatherInfo(id: number): Promise<Observable<weatherInfoDto>> {
    const old_data = await this.cityRepository.findOne({ where: { id } });
    if (!old_data) {
      throw new HttpException(
        'weather data of the required city is not found!',
        HttpStatus.NOT_FOUND,
      );
    } else {
      const city = old_data.city_name;
      const res = this.httpService
        .get(
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`,
        )
        .pipe(map((response) => response.data))
        .pipe(
          map((data) => {
            return {
              weather: data.weather,
              name: data.name,
              main: data.main,
              visibility: data.visibility,
              wind: data.wind,
              clouds: data.clouds,
              sys: data.sys,
            };
          }),
        );
      return res;
    }
  }
}
