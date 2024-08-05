import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, Min } from 'class-validator';
import { EpisodeStatus } from 'src/episode/application/models/episode';

export class FindManyEpisodesDTO {
  @ApiProperty()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  season?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn([EpisodeStatus.ACTIVE, EpisodeStatus.CANCELLED])
  status?: EpisodeStatus;
}
