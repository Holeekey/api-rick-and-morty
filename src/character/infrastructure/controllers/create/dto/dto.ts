import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MinLength } from 'class-validator';
import { Gender } from 'src/character/application/models/character';

export class CreateCharacterDTO {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsString()
  @IsIn([Gender.FEMALE, Gender.MALE, Gender.GENDERLESS, Gender.UNKNOWN])
  gender: Gender;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  species: string;
}
