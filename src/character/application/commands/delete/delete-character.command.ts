import { ApplicationService } from 'src/common/application/service/application.service';
import { DeleteCharacterDTO } from './types/dto';
import { DeleteCharacterResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { CharacterRepository } from '../../repositories/character.repository';
import { characterNotFoundError } from '../../errors/character.not.found';
import { CharacterStatus } from '../../models/character';

export class DeleteCharacterCommand
  implements ApplicationService<DeleteCharacterDTO, DeleteCharacterResponse>
{
  constructor(private characterRepository: CharacterRepository) {}

  async execute(
    data: DeleteCharacterDTO,
  ): Promise<Result<DeleteCharacterResponse>> {
    const character = await this.characterRepository.getOne(data.id);

    if (!character) {
      return Result.error(characterNotFoundError());
    }

    character.status = CharacterStatus.SUSPENDED;

    await this.characterRepository.save(character);

    return Result.success(character);
  }
}
