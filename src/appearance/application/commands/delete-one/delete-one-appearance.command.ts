import { ApplicationService } from 'src/common/application/service/application.service';
import { DeleteOneAppearanceDTO } from './types/dto';
import { DeleteOneAppearanceResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { AppearanceRepository } from '../../repositories/appearance.repository';
import { appearanceNotFoundError } from '../../errors/appearance.not.found';

export class DeleteOneAppearanceCommand
  implements
    ApplicationService<DeleteOneAppearanceDTO, DeleteOneAppearanceResponse>
{
  constructor(private appearanceRepository: AppearanceRepository) {}

  async execute(
    data: DeleteOneAppearanceDTO,
  ): Promise<Result<DeleteOneAppearanceResponse>> {
    const appearance = await this.appearanceRepository.getOne(data.id);

    if (!appearance) {
      return Result.error(appearanceNotFoundError());
    }

    await this.appearanceRepository.delete(appearance);

    return Result.success(appearance);
  }
}
