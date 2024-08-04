import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, Min } from 'class-validator';
import { CharacterStatus } from 'src/character/application/models/character';

export class FindManyCharactersDTO {
  @ApiProperty()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  species?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn([CharacterStatus.ACTIVE, CharacterStatus.SUSPENDED])
  status?: CharacterStatus;
}
