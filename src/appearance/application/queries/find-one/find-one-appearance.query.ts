import { ApplicationService } from 'src/common/application/service/application.service';
import { FindOneAppearanceDTO } from './types/dto';
import { FindOneAppearanceResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { AppearanceRepository } from '../../repositories/appearance.repository';
import { appearanceNotFoundError } from '../../errors/appearance.not.found';

export class FindOneAppearanceQuery
  implements
    ApplicationService<FindOneAppearanceDTO, FindOneAppearanceResponse>
{
  constructor(private appearancesRepository: AppearanceRepository) {}

  async execute(
    data: FindOneAppearanceDTO,
  ): Promise<Result<FindOneAppearanceResponse>> {
    const possibleAppearance = await this.appearancesRepository.getOne(data.id);

    if (!possibleAppearance) {
      return Result.error(appearanceNotFoundError());
    }

    return Result.success(possibleAppearance);
  }
}
