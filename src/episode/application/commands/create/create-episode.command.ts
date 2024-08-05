import { ApplicationService } from 'src/common/application/service/application.service';
import { CreateEpisodeDTO } from './types/dto';
import { CreateEpisodeResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { EpisodeRepository } from '../../repositories/episode.repository';
import { EpisodeStatusRepository } from '../../repositories/status.repository';
import { SeasonRepository } from '../../repositories/season.repository';
import { IDGenerator } from 'src/common/application/ID/ID.generator';
import { DateProvider } from 'src/common/application/date/date.provider';
import { Episode, EpisodeStatus } from '../../models/episode';
import { episodeAlreadyExistsSeasonError } from '../../errors/episode.already.exists.season';
import { episodeDurationExceededError } from '../../errors/episode.duration.exceeded';

export class CreateEpisodeCommand
  implements ApplicationService<CreateEpisodeDTO, CreateEpisodeResponse>
{
  constructor(
    private idGenerator: IDGenerator<string>,
    private dateProvider: DateProvider,
    private episodeRepository: EpisodeRepository,
    private statusRepository: EpisodeStatusRepository,
    private seasonRepository: SeasonRepository,
  ) {}

  async execute(
    data: CreateEpisodeDTO,
  ): Promise<Result<CreateEpisodeResponse>> {
    const episode = {
      id: this.idGenerator.generate(),
      name: data.name,
      aireDate: data.aireDate,
      code: data.code,
      seasonId: (await this.seasonRepository.getByName(data.season)).id,
      statusId: (await this.statusRepository.getByName(EpisodeStatus.ACTIVE))
        .id,
      minutesDuration: data.minutesDuration,
      secondsDuration: data.secondsDuration,
      appearancesId: [],
    } as Episode;

    if (episode.minutesDuration >= 60 && episode.secondsDuration >= 1) {
      return Result.error(episodeDurationExceededError());
    }

    if (await this.episodeRepository.existsBySeason(episode)) {
      return Result.error(episodeAlreadyExistsSeasonError());
    }

    await this.episodeRepository.save(episode);

    return Result.success({
      id: episode.id,
    });
  }
}
