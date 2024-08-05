import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class UpdateAppearanceDTO {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsOptional()
  characterId?: string;
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsOptional()
  episodeId?: string;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(60)
  @IsOptional()
  initMinute?: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(59)
  @IsOptional()
  initSecond?: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(60)
  @IsOptional()
  finishMinute?: number;
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(59)
  @IsOptional()
  finishSecond?: number;
}
