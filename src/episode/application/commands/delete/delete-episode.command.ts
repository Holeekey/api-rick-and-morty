import { ApplicationService } from 'src/common/application/service/application.service';
import { DeleteEpisodeDTO } from './types/dto';
import { DeleteEpisodeResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { EpisodeRepository } from '../../repositories/episode.repository';
import { EpisodeStatusRepository } from '../../repositories/status.repository';
import { SeasonRepository } from '../../repositories/season.repository';
import { episodeNotFoundError } from '../../errors/episode.not.found';
import { EpisodeStatus } from '../../models/episode';

export class DeleteEpisodeCommand
  implements ApplicationService<DeleteEpisodeDTO, DeleteEpisodeResponse>
{
  constructor(
    private episodeRepository: EpisodeRepository,
    private statusRepository: EpisodeStatusRepository,
    private seasonRepository: SeasonRepository,
  ) {}

  async execute(
    data: DeleteEpisodeDTO,
  ): Promise<Result<DeleteEpisodeResponse>> {
    const possibleEpisode = await this.episodeRepository.getOne(data.id);

    if (!possibleEpisode) {
      return Result.error(episodeNotFoundError());
    }

    possibleEpisode.statusId = (
      await this.statusRepository.getByName(EpisodeStatus.CANCELLED)
    ).id;

    await this.episodeRepository.save(possibleEpisode);

    return Result.success({
      id: possibleEpisode.id,
      name: possibleEpisode.name,
      code: possibleEpisode.code,
      aireDate: possibleEpisode.aireDate,
      minutesDuration: possibleEpisode.minutesDuration,
      secondsDuration: possibleEpisode.secondsDuration,
      status: EpisodeStatus.CANCELLED,
      season: (await this.seasonRepository.getById(possibleEpisode.seasonId))
        .name,
    });
  }
}
