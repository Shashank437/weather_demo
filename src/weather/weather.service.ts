import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
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

  create(cityDto: CityDto): Promise<City> {
    const city: City = new City();
    city.city_name = cityDto.name;
    return this.cityRepository.save(city);
  }

  findOne(id: number): Promise<City> {
    return this.cityRepository.findOne({ where: { id } });
  }

  findAll(): Promise<City[]> {
    return this.cityRepository.find();
  }

  async update(id: number, cityDto: CityDto) {
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

  remove(id: number) {
    return this.cityRepository.delete(id);
  }

  findByCity(name: string) {
    return this.cityRepository.findOne({ where: { city_name: name } });
  }

  getWeatherInfo(city: string): Observable<weatherInfoDto> {
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
