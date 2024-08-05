import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { DeleteCharacterAppearancesByEpisodeDTO } from './types/delete-character-appearances-by-episode.dto';
import { DeleteCharacterAppearancesByEpisodeResponse } from 'src/appearance/application/commands/delete-character-by-episode/types/response';
import { APPEARANCE_API_TAG, APPEARANCE_PREFIX } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, HttpException } from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { DeleteCharacterAppearancesByEpisodeCommand } from 'src/appearance/application/commands/delete-character-by-episode/delete-character-appearances-by-episode.command';
import { AppearanceRepositoryPostgres } from '../../repositories/postgres/appearance.repository';
import { CharacterRepositoryByAppearancePostgres } from '../../repositories/postgres/character.repository';
import { EpisodeRepositoryByAppearancePostgres } from '../../repositories/postgres/episode.repository';

@ApiTags(APPEARANCE_API_TAG)
@Controller(APPEARANCE_PREFIX)
export class DeleteCharacterAppearancesByEpisodeController
  implements
    ControllerContract<
      [body: DeleteCharacterAppearancesByEpisodeDTO],
      DeleteCharacterAppearancesByEpisodeResponse
    >
{
  constructor(
    private appearanceRepository: AppearanceRepositoryPostgres,
    private characterRepository: CharacterRepositoryByAppearancePostgres,
    private episodeRepository: EpisodeRepositoryByAppearancePostgres,
  ) {}

  @Delete()
  async execute(
    @Body() body: DeleteCharacterAppearancesByEpisodeDTO,
  ): Promise<DeleteCharacterAppearancesByEpisodeResponse> {
    const result = await new ErrorDecorator(
      new DeleteCharacterAppearancesByEpisodeCommand(
        this.appearanceRepository,
        this.episodeRepository,
        this.characterRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      characterId: body.characterId,
      episodeId: body.episodeId,
    });
    return result.unwrap();
  }
}
