import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CityDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
