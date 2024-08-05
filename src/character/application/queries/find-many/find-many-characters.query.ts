import { ApplicationService } from 'src/common/application/service/application.service';
import { FindManyCharactersDTO } from './types/dto';
import { FindManyCharactersResponse } from './types/response';
import { Result } from 'src/common/application/result-handler/result.handler';
import { CharacterRepository } from '../../repositories/character.repository';
import { SpeciesRepository } from '../../repositories/species.repository';
import { speciesNotFoundError } from '../../errors/species.not.found';
import { CharacterStatusRepository } from '../../repositories/status.repository';
import { CharacterStatus } from '../../models/status';
import { Species } from '../../models/species';
import { statusNotFoundError } from '../../errors/status.not.found';

export class FindManyCharactersQuery
  implements
    ApplicationService<FindManyCharactersDTO, FindManyCharactersResponse[]>
{
  constructor(
    private characterRepository: CharacterRepository,
    private speciesRepository: SpeciesRepository,
    private statusRepository: CharacterStatusRepository,
  ) {}

  async execute(
    data: FindManyCharactersDTO,
  ): Promise<Result<FindManyCharactersResponse[]>> {
    let possibleSpecies: Species;

    if (data.species) {
      possibleSpecies = await this.speciesRepository.getByName(data.species);
      if (!possibleSpecies) return Result.error(speciesNotFoundError());
    }

    let possibleStatus: CharacterStatus;

    if (data.status) {
      possibleStatus = await this.statusRepository.getByName(data.status);
      if (!possibleStatus) return Result.error(statusNotFoundError());
    }

    const characters = await this.characterRepository.getMany(
      data.page,
      data.perPage,
      possibleSpecies?.id,
      possibleStatus?.id,
    );

    return Result.success(
      await Promise.all(
        characters.map(async (c) => {
          return {
            id: c.id,
            name: c.name,
            species: (await this.speciesRepository.getById(c.speciesId)).name,
            status: (await this.statusRepository.getById(c.statusId)).name,
            gender: c.gender,
            createdAt: c.createdAt,
            appearancesId: c.appearancesId,
          } as FindManyCharactersResponse;
        }),
      ),
    );
  }
}
