import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { FindOneAppearanceResponse } from './types/find-one-appearance.response';
import { APPEARANCE_API_TAG, APPEARANCE_PREFIX } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ErrorDecorator } from 'src/common/application/decorators/error.handler.decorator';
import { FindOneAppearanceQuery } from 'src/appearance/application/queries/find-one/find-one-appearance.query';
import { AppearanceRepositoryPostgres } from '../../repositories/postgres/appearance.repository';
import { durationToString } from 'src/common/infrastruture/utils/duration.to.string';

@ApiTags(APPEARANCE_API_TAG)
@Controller(APPEARANCE_PREFIX)
export class FindOneAppearanceController
  implements ControllerContract<[param: string], FindOneAppearanceResponse>
{
  constructor(private appearanceRepository: AppearanceRepositoryPostgres) {}

  @Get(':id')
  async execute(
    @Param('id', ParseUUIDPipe) param: string,
  ): Promise<FindOneAppearanceResponse> {
    const result = await new ErrorDecorator(
      new FindOneAppearanceQuery(this.appearanceRepository),
      (e) => new HttpException(e.message, 400),
    ).execute({
      id: param,
    });

    const baseUrl = process.env.APP_HOST + ':' + process.env.APP_PORT + '/api/';

    const appearance = result.unwrap();

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
