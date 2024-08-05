import { ApplicationService } from 'src/common/application/service/application.service';
import { FindManyAppearancesDTO } from './types/dto';
import { FindManyAppearancesResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { AppearanceRepository } from '../../repositories/appearance.repository';

export class FindManyAppearancesQuery
  implements
    ApplicationService<FindManyAppearancesDTO, FindManyAppearancesResponse[]>
{
  constructor(private appearancesRepository: AppearanceRepository) {}

  async execute(
    data: FindManyAppearancesDTO,
  ): Promise<Result<FindManyAppearancesResponse[]>> {
    const appearances = await this.appearancesRepository.getMany(
      data.page,
      data.perPage,
      data.episodeId,
      data.characterId,
      data.seasonId,
      data.episodeStatusId,
      data.characterStatusId,
    );

    return Result.success(appearances);
  }
}
