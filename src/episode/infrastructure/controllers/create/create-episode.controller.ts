import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { CreateEpisodeDTO } from './dto/create-episode.dto';
import { CreateEpisodeResponse } from 'src/episode/application/commands/create/types/response';
import { EpisodeRepositoryPostgres } from '../../repositories/episode.repository';
import { EpisodeStatusRepositoryPostgres } from '../../repositories/status.repository';
import { SeasonRepositoryPostgres } from '../../repositories/season.repository';
import { ConcreteUUIDGenerator } from 'src/common/infrastruture/uuid/concrete.uuid.generator';
import { ConcreteDateProvider } from 'src/common/infrastruture/date/date.provider';
import { EPISODE_PREFIX, EPISODE_API_TAG } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { CreateEpisodeCommand } from 'src/episode/application/commands/create/create-episode.command';

@ApiTags(EPISODE_API_TAG)
@Controller(EPISODE_PREFIX)
export class CreateEpisodeController
  implements
    ControllerContract<[body: CreateEpisodeDTO], CreateEpisodeResponse>
{
  constructor(
    private idGenerator: ConcreteUUIDGenerator,
    private dateProvider: ConcreteDateProvider,
    private episodeRepository: EpisodeRepositoryPostgres,
    private statusRepository: EpisodeStatusRepositoryPostgres,
    private seasonRepository: SeasonRepositoryPostgres,
  ) {}

  @Post()
  async execute(
    @Body() body: CreateEpisodeDTO,
  ): Promise<CreateEpisodeResponse> {
    await this.episodeRepository.upsertSeason(body.season);

    const result = await new ErrorDecorator(
      new CreateEpisodeCommand(
        this.idGenerator,
        this.dateProvider,
        this.episodeRepository,
        this.statusRepository,
        this.seasonRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      name: body.name,
      code: body.code,
      aireDate: body.aireDate,
      season: body.season,
      minutesDuration: body.minutesDuration,
      secondsDuration: body.secondsDuration,
    });

    return result.unwrap();
  }
}
