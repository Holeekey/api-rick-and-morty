import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class FindManyAppearancesDTO {
  @ApiProperty({
    required: false,
  })
  @Min(1)
  @Type(() => Number)
  page: number = 1;
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  episodeId?: string;
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  seasonId?: string;
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  characterId?: string;
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  characterStatusId?: string;
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  episodeStatusId?: string;
}
