import { Optional } from 'src/common/application/optional/optional';
import { CharacterStatus as CharacterStatusModel } from '../models/status';
import { CharacterStatus } from '../models/character';

export interface CharacterStatusRepository {
  getByName(name: CharacterStatus): Promise<Optional<CharacterStatusModel>>;
}
