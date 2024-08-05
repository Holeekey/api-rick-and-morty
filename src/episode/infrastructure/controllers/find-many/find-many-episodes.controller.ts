import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { FindManyEpisodesDTO } from './types/find-many-episodes.dto';
import { FindManyEpisodesResponse } from './types/find-many-episodes.response';
import { EPISODE_PREFIX, EPISODE_API_TAG } from '../prefix';
import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { FindManyEpisodesQuery } from 'src/episode/application/queries/find-many/find-many-episodes.query';
import { EpisodeRepositoryPostgres } from '../../repositories/episode.repository';
import { SeasonRepositoryPostgres } from '../../repositories/season.repository';
import { EpisodeStatusRepositoryPostgres } from '../../repositories/status.repository';
import { durationToString } from 'src/common/infrastruture/utils/duration.to.string';

@ApiTags(EPISODE_API_TAG)
@Controller(EPISODE_PREFIX)
export class FindManyEpisodesController
  implements
    ControllerContract<[query: FindManyEpisodesDTO], FindManyEpisodesResponse>
{
  constructor(
    private episodeRepository: EpisodeRepositoryPostgres,
    private statusRepository: EpisodeStatusRepositoryPostgres,
    private seasonRepository: SeasonRepositoryPostgres,
  ) {}

  @Get()
  async execute(
    @Query() query: FindManyEpisodesDTO,
  ): Promise<FindManyEpisodesResponse> {
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

    const count = await this.episodeRepository.count(
      query.season,
      query.status,
    );

    const pages = Math.ceil(count / 5);

    const nextPage = query.page + 1;
    const prevPage = query.page - 1;

    const baseUrl =
      process.env.APP_HOST + ':' + process.env.APP_PORT + '/api/episode/';

    const pageQuery = '?page';

    const seasonQuery = query.season ? '&season=' + query.season : '';
    const statusQuery = query.status ? '&status=' + query.status : '';

    const episodes = result.unwrap();

    return {
      info: {
        count: count,
        pages: pages,
        next:
          nextPage > pages
            ? null
            : baseUrl +
              pageQuery +
              (query.page + 1) +
              seasonQuery +
              statusQuery,
        prev:
          prevPage <= 0
            ? null
            : baseUrl +
              pageQuery +
              (query.page - 1) +
              seasonQuery +
              statusQuery,
      },
      results: episodes.map((e) => {
        return {
          id: e.id,
          name: e.name,
          code: e.code,
          aireDate: e.aireDate,
          season: e.season,
          status: e.status,
          duration: durationToString(e.minutesDuration, e.secondsDuration),
          url: baseUrl + e.id,
        };
      }),
    };
  }
}
