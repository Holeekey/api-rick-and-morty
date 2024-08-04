import { Optional } from 'src/common/application/optional/optional';
import { Season } from '../models/season';

export interface SeasonRepository {
  getById(id: string): Promise<Optional<Season>>;
  getByName(name: string): Promise<Optional<Season>>;
}
