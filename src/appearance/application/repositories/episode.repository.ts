import { Optional } from 'src/common/application/optional/optional';
import { Episode } from '../models/episode';

export interface EpisodeRepository {
  getById(id: string): Promise<Optional<Episode>>;
}
