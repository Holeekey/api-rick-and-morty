import { ApplicationService } from 'src/common/application/service/application.service';
import { UpdateCharacterDTO } from './types/dto';
import { UpdateCharacterResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { CharacterRepository } from '../../repositories/character.repository';
import { characterSpeciesStatusFoundError } from '../../errors/character.exists.by.species.and.status';
import { SpeciesRepository } from '../../repositories/species.repository';
import { CharacterStatusRepository } from '../../repositories/status.repository';

export class UpdateCharacterCommand
  implements ApplicationService<UpdateCharacterDTO, UpdateCharacterResponse>
{
  constructor(
    private characterRepository: CharacterRepository,
    private speciesRepository: SpeciesRepository,
    private statusRepository: CharacterStatusRepository,
  ) {}

  async execute(
    data: UpdateCharacterDTO,
  ): Promise<Result<UpdateCharacterResponse>> {
    const character = await this.characterRepository.getOne(data.id);

    character.name = data.name ?? character.name;
    character.gender = data.gender ?? character.gender;
    character.speciesId = (
      await this.speciesRepository.upsert(data.species)
    ).unwrap().id;

    if (await this.characterRepository.existsBySpeciesAndStatus(character)) {
      return Result.error(characterSpeciesStatusFoundError());
    }

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
