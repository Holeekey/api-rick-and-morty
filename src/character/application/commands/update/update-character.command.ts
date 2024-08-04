import { ApplicationService } from 'src/common/application/service/application.service';
import { UpdateCharacterDTO } from './types/dto';
import { UpdateCharacterResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { CharacterRepository } from '../../repositories/character.repository';
import { characterSpeciesStatusFoundError } from '../../errors/character.exists.by.species.and.status';

export class UpdateCharacterCommand
  implements ApplicationService<UpdateCharacterDTO, UpdateCharacterResponse>
{
  constructor(private characterRepository: CharacterRepository) {}

  async execute(
    data: UpdateCharacterDTO,
  ): Promise<Result<UpdateCharacterResponse>> {
    const character = await this.characterRepository.getOne(data.id);

    character.name = data.name ?? character.name;
    character.gender = data.gender ?? character.gender;
    character.species = data.species ?? character.species;

    if (await this.characterRepository.existsBySpeciesAndStatus(character)) {
      return Result.error(characterSpeciesStatusFoundError());
    }

    await this.characterRepository.save(character);

    return Result.success(character);
  }
}
