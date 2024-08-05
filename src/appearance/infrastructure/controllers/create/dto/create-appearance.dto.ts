import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateAppearanceDTO {
  @ApiProperty()
  @IsString()
  @IsUUID()
  characterId: string;
  @ApiProperty()
  @IsString()
  @IsUUID()
  episodeId: string;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(60)
  initMinute: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(59)
  initSecond: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(60)
  finishMinute: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(59)
  finishSecond: number;
}
