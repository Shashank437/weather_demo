import { IsNotEmpty } from 'class-validator';

export class weatherInfoDto {
  @IsNotEmpty()
  weather: any;
  @IsNotEmpty()
  main: any;
  @IsNotEmpty()
  visibility: any;
  @IsNotEmpty()
  wind: any;
  @IsNotEmpty()
  clouds: any;
  @IsNotEmpty()
  sys: any;
  @IsNotEmpty()
  name: string;
}
