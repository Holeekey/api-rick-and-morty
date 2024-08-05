import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { UpdateAppearanceResponse } from '../../../application/commands/update/types/response';
import { UpdateAppearanceDTO } from './dto/update-appearance.dto';
import { APPEARANCE_API_TAG, APPEARANCE_PREFIX } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpException,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { UpdateAppearanceCommand } from 'src/appearance/application/commands/update/update-appearance.command';
import { AppearanceRepositoryPostgres } from '../../repositories/postgres/appearance.repository';
import { CharacterRepositoryByAppearancePostgres } from '../../repositories/postgres/character.repository';
import { EpisodeRepositoryByAppearancePostgres } from '../../repositories/postgres/episode.repository';

@ApiTags(APPEARANCE_API_TAG)
@Controller(APPEARANCE_PREFIX)
export class UpdateAppearanceController
  implements
    ControllerContract<
      [param: string, body: UpdateAppearanceDTO],
      UpdateAppearanceResponse
    >
{
  constructor(
    private appearanceRepository: AppearanceRepositoryPostgres,
    private characterRepository: CharacterRepositoryByAppearancePostgres,
    private episodeRepository: EpisodeRepositoryByAppearancePostgres,
  ) {}

  @Patch(':id')
  async execute(
    @Param('id', ParseUUIDPipe) param: string,
    @Body() body: UpdateAppearanceDTO,
  ): Promise<UpdateAppearanceResponse> {
    const result = await new ErrorDecorator(
      new UpdateAppearanceCommand(
        this.appearanceRepository,
        this.episodeRepository,
        this.characterRepository,
      ),
      (e) => new HttpException(e.message, 400),
    ).execute({
      id: param,
      characterId: body.characterId,
      episodeId: body.episodeId,
      initMinute: body.initMinute,
      initSecond: body.initSecond,
      finishMinute: body.finishMinute,
      finishSecond: body.finishSecond,
    });

    return result.unwrap();
  }
}
