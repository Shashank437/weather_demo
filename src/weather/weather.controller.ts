import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CityDto } from './dto/create_city.dto';
import { WeatherService } from './weather.service';

@ApiTags('city')
@Controller('city')
export class WeatherController {
  constructor(private readonly cityService: WeatherService) {}
  @Post()
  create(@Body() cityDto: CityDto) {
    return this.cityService.create(cityDto);
  }

  @Get()
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cityService.findOne(id);
  }

  @Patch(':id')
  update(@Body() cityDto: CityDto, @Param('id') id: number) {
    return this.cityService.update(id, cityDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.cityService.remove(id);
  }

  @Get(':id/weather')
  getWeatherData(@Param('id') id: number) {
    return this.cityService.getWeatherInfo(id);
  }
}
