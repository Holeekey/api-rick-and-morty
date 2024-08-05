import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class DeleteCharacterAppearancesByEpisodeDTO {
  @ApiProperty()
  @IsString()
  @IsUUID()
  characterId: string;
  @ApiProperty()
  @IsString()
  @IsUUID()
  episodeId: string;
}
