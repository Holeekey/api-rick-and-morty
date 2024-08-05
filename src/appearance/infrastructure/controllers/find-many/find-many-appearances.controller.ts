import { ControllerContract } from 'src/common/infrastruture/controller/contract/controller.contract';
import { FindManyAppearancesDTO } from './types/find-many-appearances.dto';
import { FindManyAppearancesResponse } from './types/find-many-appearances.response';
import { APPEARANCE_API_TAG, APPEARANCE_PREFIX } from '../prefix';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { FindManyAppearancesQuery } from 'src/appearance/application/queries/find-many/find-many-appearances.query';
import { AppearanceRepositoryPostgres } from '../../repositories/postgres/appearance.repository';
import { durationToString } from 'src/common/infrastruture/utils/duration.to.string';

@ApiTags(APPEARANCE_API_TAG)
@Controller(APPEARANCE_PREFIX)
export class FindManyAppearancesController
  implements
    ControllerContract<
      [query: FindManyAppearancesDTO],
      FindManyAppearancesResponse
    >
{
  constructor(private appearanceRepository: AppearanceRepositoryPostgres) {}

  @Get()
  async execute(
    @Query() query: FindManyAppearancesDTO,
  ): Promise<FindManyAppearancesResponse> {
    const result = await new FindManyAppearancesQuery(
      this.appearanceRepository,
    ).execute({
      perPage: 5,
      ...query,
    });

    const appearances = result.unwrap();

    const baseUrl = process.env.APP_HOST + ':' + process.env.APP_PORT + '/api/';

    const baseUrlWithAppearancePrefix = baseUrl + APPEARANCE_PREFIX + '/';

    const pageQuery = '?page';

    const characterIdQuery = query.characterId
      ? '&characterId=' + query.characterId
      : '';

    const episodeIdQuery = query.episodeId
      ? '&episodeId=' + query.episodeId
      : '';

    const seasonIdQuery = query.seasonId ? '&seasonId=' + query.seasonId : '';

    const characterStatusIdQuery = query.characterStatusId
      ? '&characterStatusId=' + query.characterStatusId
      : '';

    const episodeStatusIdQuery = query.episodeStatusId
      ? '&episodeStatusId=' + query.episodeStatusId
      : '';

    return {
      info: {
        count: 0,
        pages: 0,
        next: null,
        prev: null,
      },
      results: appearances.map((a) => {
        return {
          id: a.id,
          characterUrl: baseUrl + 'character/' + a.characterId,
          episodeUrl: baseUrl + 'episode/' + a.episodeId,
          initMinute: durationToString(a.initMinute, a.initSecond),
          finishMinute: durationToString(a.finishMinute, a.finishSecond),
        };
      }),
    };
  }
}
