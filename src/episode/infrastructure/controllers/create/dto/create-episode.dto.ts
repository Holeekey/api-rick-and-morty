import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEpisodeDTO {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;
  @ApiProperty()
  @IsDateString()
  aireDate: Date;
  @ApiProperty()
  @IsString()
  @MinLength(6)
  code: string;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(60)
  minutesDuration: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(59)
  secondsDuration: number;
  @ApiProperty()
  @IsString()
  @MinLength(3)
  season: string;
}
