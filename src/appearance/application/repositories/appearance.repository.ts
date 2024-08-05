import { Result } from 'src/common/application/result-handler/result.handler';
import { Appearance } from '../models/appearance';
import { Optional } from 'src/common/application/optional/optional';

export interface AppearanceRepository {
  getOne(id: string): Promise<Optional<Appearance>>;
  save(appearance: Appearance): Promise<Result<Appearance>>;
  appearanceOverlaps(appearance: Appearance): Promise<boolean>;
}
