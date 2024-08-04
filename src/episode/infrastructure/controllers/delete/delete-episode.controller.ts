import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { DeleteEpisodeResponse } from 'src/episode/application/commands/delete/types/response';
import { EPISODE_PREFIX, EPISODE_API_TAG } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  HttpException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { DeleteEpisodeCommand } from 'src/episode/application/commands/delete/delete-episode.command';
import { EpisodeRepositoryPostgres } from '../../repositories/episode.repository';
import { EpisodeStatusRepositoryPostgres } from '../../repositories/status.repository';
import { SeasonRepositoryPostgres } from '../../repositories/season.repository';

@ApiTags(EPISODE_API_TAG)
@Controller(EPISODE_PREFIX)
export class DeleteEpisodeController
  implements ControllerContract<[param: string], DeleteEpisodeResponse>
{
  constructor(
    private episodeRepository: EpisodeRepositoryPostgres,
    private statusRepository: EpisodeStatusRepositoryPostgres,
    private seasonRepository: SeasonRepositoryPostgres,
  ) {}

  @Delete(':id')
  async execute(
    @Param('id', ParseUUIDPipe) param: string,
  ): Promise<DeleteEpisodeResponse> {
    const result = await new ErrorDecorator(
      new DeleteEpisodeCommand(
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
