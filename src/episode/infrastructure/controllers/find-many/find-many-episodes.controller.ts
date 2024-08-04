import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { FindManyEpisodesDTO } from './dto/find-many-episodes.dto';
import { FindManyEpisodesResponse } from 'src/episode/application/queries/find-many/types/response';
import { EPISODE_PREFIX, EPISODE_API_TAG } from '../prefix';
import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { FindManyEpisodesQuery } from 'src/episode/application/queries/find-many/find-many-episodes.query';
import { EpisodeRepositoryPostgres } from '../../repositories/episode.repository';
import { SeasonRepositoryPostgres } from '../../repositories/season.repository';
import { EpisodeStatusRepositoryPostgres } from '../../repositories/status.repository';

@ApiTags(EPISODE_API_TAG)
@Controller(EPISODE_PREFIX)
export class FindManyEpisodesController
  implements
    ControllerContract<
      [query: FindManyEpisodesDTO],
      FindManyEpisodesResponse[]
    >
{
  constructor(
    private episodeRepository: EpisodeRepositoryPostgres,
    private statusRepository: EpisodeStatusRepositoryPostgres,
    private seasonRepository: SeasonRepositoryPostgres,
  ) {}

  @Get()
  async execute(
    @Query() query: FindManyEpisodesDTO,
  ): Promise<FindManyEpisodesResponse[]> {
    const result = await new ErrorDecorator(
      new FindManyEpisodesQuery(
        this.episodeRepository,
        this.statusRepository,
        this.seasonRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      page: query.page,
      perPage: 5,
      season: query.season,
      status: query.status,
    });

    return result.unwrap();
  }
}
