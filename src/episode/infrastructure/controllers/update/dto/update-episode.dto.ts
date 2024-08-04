import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateEpisodeDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  aireDate?: Date;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  code?: string;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  minutesDuration?: number;
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(59)
  secondsDuration?: number;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(3)
  season?: string;
}
