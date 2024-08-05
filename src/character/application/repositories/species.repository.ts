import { Optional } from 'src/common/application/optional/optional';
import { Species } from '../models/species';
import { Result } from 'src/common/application/result-handler/result.handler';

export interface SpeciesRepository {
  getByName(name: string): Promise<Optional<Species>>;
  getById(id: string): Promise<Optional<Species>>;
  upsert(name: string): Promise<Result<Species>>;
}
