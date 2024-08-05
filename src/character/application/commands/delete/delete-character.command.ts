import { ApplicationService } from 'src/common/application/service/application.service';
import { DeleteCharacterDTO } from './types/dto';
import { DeleteCharacterResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { CharacterRepository } from '../../repositories/character.repository';
import { characterNotFoundError } from '../../errors/character.not.found';
import { CharacterStatus } from '../../models/character';
import { CharacterStatusRepository } from '../../repositories/status.repository';
import { SpeciesRepository } from '../../repositories/species.repository';

export class DeleteCharacterCommand
  implements ApplicationService<DeleteCharacterDTO, DeleteCharacterResponse>
{
  constructor(
    private characterRepository: CharacterRepository,
    private speciesRepository: SpeciesRepository,
    private statusRepository: CharacterStatusRepository,
  ) {}

  async execute(
    data: DeleteCharacterDTO,
  ): Promise<Result<DeleteCharacterResponse>> {
    const character = await this.characterRepository.getOne(data.id);

    if (!character) {
      return Result.error(characterNotFoundError());
    }

    character.statusId = (
      await this.statusRepository.getByName(CharacterStatus.SUSPENDED)
    ).id;

    await this.characterRepository.save(character);

    return Result.success({
      id: character.id,
      name: character.name,
      species: (await this.speciesRepository.getById(character.speciesId)).name,
      status: (await this.statusRepository.getById(character.statusId)).name,
      gender: character.gender,
      createdAt: character.createdAt,
    });
  }
}
