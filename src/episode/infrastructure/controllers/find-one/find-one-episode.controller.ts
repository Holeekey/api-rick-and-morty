import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { FindOneEpisodeResponse } from 'src/episode/application/queries/find-one/types/response';
import { EpisodeRepositoryPostgres } from '../../repositories/episode.repository';
import { EpisodeStatusRepositoryPostgres } from '../../repositories/status.repository';
import { SeasonRepositoryPostgres } from '../../repositories/season.repository';
import { EPISODE_PREFIX, EPISODE_API_TAG } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { FindOneEpisodeQuery } from 'src/episode/application/queries/find-one/find-one-episode.query';

@ApiTags(EPISODE_API_TAG)
@Controller(EPISODE_PREFIX)
export class FindOneEpisodeController
  implements ControllerContract<[param: string], FindOneEpisodeResponse>
{
  constructor(
    private episodeRepository: EpisodeRepositoryPostgres,
    private statusRepository: EpisodeStatusRepositoryPostgres,
    private seasonRepository: SeasonRepositoryPostgres,
  ) {}

  @Get(':id')
  async execute(
    @Param('id', ParseUUIDPipe) param: string,
  ): Promise<FindOneEpisodeResponse> {
    const result = await new ErrorDecorator(
      new FindOneEpisodeQuery(
        this.episodeRepository,
        this.statusRepository,
        this.seasonRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      id: param,
    });

    return result.unwrap();
  }
}
