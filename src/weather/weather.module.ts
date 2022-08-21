import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entity/city.entity';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    TypeOrmModule.forFeature([City]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
