import { ApplicationService } from 'src/common/application/service/application.service';
import { FindOneCharacterDTO } from './types/dto';
import { FindOneCharacterResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { CharacterRepository } from '../../repositories/character.repository';
import { characterNotFoundError } from '../../errors/character.not.found';
import { SpeciesRepository } from '../../repositories/species.repository';
import { CharacterStatusRepository } from '../../repositories/status.repository';

export class FindOneCharacterQuery
  implements ApplicationService<FindOneCharacterDTO, FindOneCharacterResponse>
{
  constructor(
    private characterRepository: CharacterRepository,
    private speciesRepository: SpeciesRepository,
    private statusRepository: CharacterStatusRepository,
  ) {}

  async execute(
    data: FindOneCharacterDTO,
  ): Promise<Result<FindOneCharacterResponse>> {
    const possibleCharacter = await this.characterRepository.getOne(data.id);

    if (!possibleCharacter) {
      return Result.error(characterNotFoundError());
    }

    return Result.success({
      id: possibleCharacter.id,
      name: possibleCharacter.name,
      gender: possibleCharacter.gender,
      species: (
        await this.speciesRepository.getById(possibleCharacter.speciesId)
      ).name,
      status: (await this.statusRepository.getById(possibleCharacter.statusId))
        .name,
      createdAt: possibleCharacter.createdAt,
    });
  }
}
