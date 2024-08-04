import { Optional } from 'src/common/application/optional/optional';
import { Species } from '../models/species';

export interface SpeciesRepository {
  getByName(name: string): Promise<Optional<Species>>;
}
