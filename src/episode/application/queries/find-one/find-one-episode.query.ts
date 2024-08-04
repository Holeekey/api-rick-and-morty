import { ApplicationService } from 'src/common/application/service/application.service';
import { FindOneEpisodeDTO } from './types/dto';
import { FindOneEpisodeResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { EpisodeRepository } from '../../repositories/episode.repository';
import { EpisodeStatusRepository } from '../../repositories/status.repository';
import { SeasonRepository } from '../../repositories/season.repository';
import { episodeNotFoundError } from '../../errors/episode.not.found';

export class FindOneEpisodeQuery
  implements ApplicationService<FindOneEpisodeDTO, FindOneEpisodeResponse>
{
  constructor(
    private episodeRepository: EpisodeRepository,
    private statusRepository: EpisodeStatusRepository,
    private seasonRepository: SeasonRepository,
  ) {}

  async execute(
    data: FindOneEpisodeDTO,
  ): Promise<Result<FindOneEpisodeResponse>> {
    const episode = await this.episodeRepository.getOne(data.id);

    if (!episode) {
      return Result.error(episodeNotFoundError());
    }

    return Result.success({
      id: episode.id,
      name: episode.name,
      code: episode.code,
      aireDate: episode.aireDate,
      season: (await this.seasonRepository.getById(episode.seasonId)).name,
      status: (await this.statusRepository.getById(episode.statusId)).name,
      minutesDuration: episode.minutesDuration,
      secondsDuration: episode.secondsDuration,
    });
  }
}
