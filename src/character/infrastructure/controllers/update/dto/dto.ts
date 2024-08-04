import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { Gender } from 'src/character/application/models/character';

export class UpdateCharacterDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(1)
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn([Gender.FEMALE, Gender.MALE, Gender.GENDERLESS, Gender.UNKNOWN])
  gender?: Gender;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(1)
  species?: string;
}
