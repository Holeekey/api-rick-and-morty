import { Optional } from 'src/common/application/optional/optional';
import { Result } from 'src/common/application/result-handler/result.handler';
import { Episode } from '../models/episode';

export interface EpisodeRepository {
  getMany(
    page: number,
    perPage: number,
    seasonId?: string,
    statusId?: string,
  ): Promise<Episode[]>;
  getOne(id: string): Promise<Optional<Episode>>;
  save(episode: Episode): Promise<Result<Episode>>;
  existsBySeason(episode: Episode): Promise<boolean>;
}
