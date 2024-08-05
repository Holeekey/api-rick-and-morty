import { ApplicationService } from 'src/common/application/service/application.service';
import { DeleteCharacterAppearancesByEpisodeDTO } from './types/dto';
import { DeleteCharacterAppearancesByEpisodeResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { AppearanceRepository } from '../../repositories/appearance.repository';
import { EpisodeRepository } from '../../repositories/episode.repository';
import { CharacterRepository } from '../../repositories/character.repository';
import { characterNotFoundError } from '../../errors/character.not.found';
import { episodeNotFoundError } from '../../errors/episode.not.found';

export class DeleteCharacterAppearancesByEpisodeCommand
  implements
    ApplicationService<
      DeleteCharacterAppearancesByEpisodeDTO,
      DeleteCharacterAppearancesByEpisodeResponse
    >
{
  constructor(
    private appearanceRepository: AppearanceRepository,
    private episodeRepository: EpisodeRepository,
    private characterRepository: CharacterRepository,
  ) {}

  async execute(
    data: DeleteCharacterAppearancesByEpisodeDTO,
  ): Promise<Result<DeleteCharacterAppearancesByEpisodeResponse>> {
    if (!(await this.characterRepository.existsById(data.characterId))) {
      return Result.error(characterNotFoundError());
    }

    const possibleEpisode = await this.episodeRepository.getById(
      data.episodeId,
    );

    if (!possibleEpisode) {
      return Result.error(episodeNotFoundError());
    }

    const appearancesDeleted =
      await this.appearanceRepository.deleteCharacterAppearancesByEpisode(
        data.characterId,
        data.episodeId,
      );

    return Result.success({ appearancesDeleted: appearancesDeleted });
  }
}
