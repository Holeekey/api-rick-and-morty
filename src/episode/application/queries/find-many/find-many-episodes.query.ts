import { ApplicationService } from 'src/common/application/service/application.service';
import { FindManyEpisodesDTO } from './types/dto';
import { FindManyEpisodesResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { EpisodeRepository } from '../../repositories/episode.repository';
import { EpisodeStatusRepository } from '../../repositories/status.repository';
import { SeasonRepository } from '../../repositories/season.repository';
import { seasonNotFoundError } from '../../errors/species.not.found';
import { statusNotFoundError } from '../../errors/status.not.found';
import { Season } from '../../models/season';
import { EpisodeStatus } from '../../models/status';

export class FindManyEpisodesQuery
  implements
    ApplicationService<FindManyEpisodesDTO, FindManyEpisodesResponse[]>
{
  constructor(
    private episodeRepository: EpisodeRepository,
    private statusRepository: EpisodeStatusRepository,
    private seasonRepository: SeasonRepository,
  ) {}

  async execute(
    data: FindManyEpisodesDTO,
  ): Promise<Result<FindManyEpisodesResponse[]>> {
    let possibleSeason: Season;

    if (data.season) {
      possibleSeason = await this.seasonRepository.getByName(data.season);
      if (!possibleSeason) {
        return Result.error(seasonNotFoundError());
      }
    }

    let possibleStatus: EpisodeStatus;

    if (data.status) {
      possibleStatus = await this.statusRepository.getByName(data.status);
      if (!possibleStatus) {
        return Result.error(statusNotFoundError());
      }
    }

    const episodesRepo = await this.episodeRepository.getMany(
      data.page,
      data.perPage,
      possibleSeason?.id,
      possibleStatus?.id,
    );

    const episodes = await Promise.all(
      episodesRepo.map(async (e) => {
        const season = await this.seasonRepository.getById(e.seasonId);
        const status = await this.statusRepository.getById(e.statusId);

        return {
          id: e.id,
          name: e.name,
          code: e.code,
          aireDate: e.aireDate,
          minutesDuration: e.minutesDuration,
          secondsDuration: e.secondsDuration,
          season: season.name,
          status: status.name,
          appearancesId: e.appearancesId,
        } as FindManyEpisodesResponse;
      }),
    );

    return Result.success(episodes);
  }
}
