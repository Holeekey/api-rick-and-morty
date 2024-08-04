import { ApplicationService } from 'src/common/application/service/application.service';
import { UpdateEpisodeDTO } from './types/dto';
import { UpdateEpisodeResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { EpisodeRepository } from '../../repositories/episode.repository';
import { EpisodeStatusRepository } from '../../repositories/status.repository';
import { SeasonRepository } from '../../repositories/season.repository';
import { episodeNotFoundError } from '../../errors/episode.not.found';
import { episodeDurationExceededError } from '../../errors/episode.duration.exceeded';
import { episodeAlreadyExistsSeasonError } from '../../errors/episode.already.exists.season';

export class UpdateEpisodeCommand
  implements ApplicationService<UpdateEpisodeDTO, UpdateEpisodeResponse>
{
  constructor(
    private episodeRepository: EpisodeRepository,
    private statusRepository: EpisodeStatusRepository,
    private seasonRepository: SeasonRepository,
  ) {}

  async execute(
    data: UpdateEpisodeDTO,
  ): Promise<Result<UpdateEpisodeResponse>> {
    const possibleEpisode = await this.episodeRepository.getOne(data.id);

    if (!possibleEpisode) {
      return Result.error(episodeNotFoundError());
    }

    possibleEpisode.name = data.name ?? possibleEpisode.name;
    possibleEpisode.code = data.code ?? possibleEpisode.code;
    possibleEpisode.aireDate = data.aireDate ?? possibleEpisode.aireDate;
    possibleEpisode.minutesDuration =
      data.minutesDuration ?? possibleEpisode.minutesDuration;
    possibleEpisode.secondsDuration =
      data.minutesDuration ?? possibleEpisode.secondsDuration;
    possibleEpisode.seasonId = data.season
      ? (await this.seasonRepository.getByName(data.season)).id
      : possibleEpisode.seasonId;

    if (
      possibleEpisode.minutesDuration >= 60 &&
      possibleEpisode.secondsDuration >= 1
    ) {
      return Result.error(episodeDurationExceededError());
    }

    if (await this.episodeRepository.existsBySeason(possibleEpisode)) {
      return Result.error(episodeAlreadyExistsSeasonError());
    }

    await this.episodeRepository.save(possibleEpisode);

    return Result.success({
      id: possibleEpisode.id,
      name: possibleEpisode.name,
      code: possibleEpisode.code,
      aireDate: possibleEpisode.aireDate,
      minutesDuration: possibleEpisode.minutesDuration,
      secondsDuration: possibleEpisode.secondsDuration,
      season: (await this.seasonRepository.getById(possibleEpisode.seasonId))
        .name,
      status: (await this.statusRepository.getById(possibleEpisode.statusId))
        .name,
    });
  }
}
