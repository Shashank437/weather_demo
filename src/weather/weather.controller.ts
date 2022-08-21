import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CityDto } from './dto/create_city.dto';
import { WeatherService } from './weather.service';

@ApiTags('city')
@Controller('city')
export class WeatherController {
  constructor(private readonly cityService: WeatherService) {}
  @Post()
  async create(@Body() cityDto: CityDto, @Res() res: Response) {
    const oldCity = await this.cityService.findByCity(cityDto.name);
    if (oldCity == null) {
      if (cityDto == null) {
        res.status(HttpStatus.BAD_REQUEST).send();
      } else {
        res.status(HttpStatus.OK).send(await this.cityService.create(cityDto));
      }
    } else {
      res.status(HttpStatus.CONFLICT).send();
    }
  }
  @Get()
  findAll() {
    return this.cityService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const data = await this.cityService.findOne(id);
    if (data == null) {
      res.status(HttpStatus.NOT_FOUND).send();
    } else {
      res.status(HttpStatus.OK).send(data);
    }
  }
  @Patch(':id')
  async update(
    @Body() cityDto: CityDto,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const oldCity = await this.cityService.findOne(id);
    if (oldCity != null) {
      res
        .status(HttpStatus.OK)
        .send(await this.cityService.update(id, cityDto));
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.cityService.remove(id);
  }
}
