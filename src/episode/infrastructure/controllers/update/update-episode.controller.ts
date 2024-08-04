import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { UpdateEpisodeDTO } from './dto/update-episode.dto';
import { UpdateEpisodeResponse } from 'src/episode/application/commands/update/types/response';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { UpdateEpisodeCommand } from 'src/episode/application/commands/update/update-episode.command';
import { EpisodeRepositoryPostgres } from '../../repositories/episode.repository';
import { EpisodeStatusRepositoryPostgres } from '../../repositories/status.repository';
import { SeasonRepositoryPostgres } from '../../repositories/season.repository';
import {
  Body,
  Controller,
  HttpException,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { EPISODE_PREFIX, EPISODE_API_TAG } from '../prefix';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(EPISODE_API_TAG)
@Controller(EPISODE_PREFIX)
export class UpdateEpisodeController
  implements
    ControllerContract<
      [param: string, body: UpdateEpisodeDTO],
      UpdateEpisodeResponse
    >
{
  constructor(
    private episodeRepository: EpisodeRepositoryPostgres,
    private statusRepository: EpisodeStatusRepositoryPostgres,
    private seasonRepository: SeasonRepositoryPostgres,
  ) {}

  @Patch(':id')
  async execute(
    @Param('id', ParseUUIDPipe) param: string,
    @Body() body: UpdateEpisodeDTO,
  ): Promise<UpdateEpisodeResponse> {
    const result = await new ErrorDecorator(
      new UpdateEpisodeCommand(
        this.episodeRepository,
        this.statusRepository,
        this.seasonRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      id: param,
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
