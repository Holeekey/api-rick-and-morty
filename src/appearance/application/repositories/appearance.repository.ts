import { Result } from 'src/common/application/result-handler/result.handler';
import { Appearance } from '../models/appearance';

export interface AppearanceRepository {
  save(appearance: Appearance): Promise<Result<Appearance>>;
  appearanceOverlaps(appearance: Appearance): Promise<boolean>;
}
