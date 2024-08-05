import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { DeleteOneAppearanceResponse } from './types/delete-one-appearance.response';
import { APPEARANCE_API_TAG, APPEARANCE_PREFIX } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  HttpException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { DeleteOneAppearanceCommand } from 'src/appearance/application/commands/delete-one/delete-one-appearance.command';
import { AppearanceRepositoryPostgres } from '../../repositories/postgres/appearance.repository';
import { durationToString } from 'src/common/infrastruture/utils/duration.to.string';

@ApiTags(APPEARANCE_API_TAG)
@Controller(APPEARANCE_PREFIX)
export class DeleteOneAppearanceController
  implements ControllerContract<[param: string], DeleteOneAppearanceResponse>
{
  constructor(private appearanceRepository: AppearanceRepositoryPostgres) {}

  @Delete(':id')
  async execute(
    @Param('id', ParseUUIDPipe) param: string,
  ): Promise<DeleteOneAppearanceResponse> {
    const result = await new ErrorDecorator(
      new DeleteOneAppearanceCommand(this.appearanceRepository),
      (e) => new HttpException(e.message, 400),
    ).execute({ id: param });

    const appearance = result.unwrap();

    const baseUrl = process.env.APP_HOST + ':' + process.env.APP_PORT + '/api/';

    return {
      id: appearance.id,
      characterUrl: baseUrl + 'character/' + appearance.characterId,
      episodeUrl: baseUrl + 'episode/' + appearance.episodeId,
      initMinute: durationToString(
        appearance.initMinute,
        appearance.initSecond,
      ),
      finishMinute: durationToString(
        appearance.finishMinute,
        appearance.finishSecond,
      ),
    };
  }
}
