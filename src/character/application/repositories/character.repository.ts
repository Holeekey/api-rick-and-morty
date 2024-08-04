import { Optional } from 'src/common/application/optional/optional';
import { Character } from '../models/character';
import { Result } from 'src/common/application/result-handler/result.handler';

export interface CharacterRepository {
  getMany(
    page: number,
    perPage: number,
    speciesId?: string,
    statusId?: string,
  ): Promise<Character[]>;
  getOne(id: string): Promise<Optional<Character>>;
  save(character: Character): Promise<Result<Character>>;
  existsBySpeciesAndStatus(character: Character): Promise<boolean>;
}
