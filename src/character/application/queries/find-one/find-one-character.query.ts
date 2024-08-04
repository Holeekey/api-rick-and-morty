import { ApplicationService } from 'src/common/application/service/application.service';
import { FindOneCharacterDTO } from './types/dto';
import { FindOneCharacterResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { CharacterRepository } from '../../repositories/character.repository';
import { characterNotFoundError } from '../../errors/character.not.found';

export class FindOneCharacterQuery
  implements ApplicationService<FindOneCharacterDTO, FindOneCharacterResponse>
{
  constructor(private characterRepository: CharacterRepository) {}

  async execute(
    data: FindOneCharacterDTO,
  ): Promise<Result<FindOneCharacterResponse>> {
    const possibleCharacter = await this.characterRepository.getOne(data.id);

    if (!possibleCharacter) {
      return Result.error(characterNotFoundError());
    }

    return Result.success(possibleCharacter);
  }
}
