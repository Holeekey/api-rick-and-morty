import { Optional } from 'src/common/application/optional/optional';
import { EpisodeStatus } from '../models/episode';
import { EpisodeStatus as EpisodeStatusModel } from '../models/status';

export interface EpisodeStatusRepository {
  getById(id: string): Promise<Optional<EpisodeStatusModel>>;
  getByName(name: EpisodeStatus): Promise<Optional<EpisodeStatusModel>>;
}
