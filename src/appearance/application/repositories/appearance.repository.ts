import { Result } from 'src/common/application/result-handler/result.handler';
import { Appearance } from '../models/appearance';
import { Optional } from 'src/common/application/optional/optional';

export interface AppearanceRepository {
  getMany(
    page: number,
    perPage: number,
    episodeId?: string,
    characterId?: string,
    seasonId?: string,
    episodeStatusId?: string,
    characterStatusId?: string,
  ): Promise<Appearance[]>;
  getOne(id: string): Promise<Optional<Appearance>>;
  save(appearance: Appearance): Promise<Result<Appearance>>;
  appearanceOverlaps(appearance: Appearance): Promise<boolean>;
  delete(appearance: Appearance): Promise<Result<Appearance>>;
  deleteCharacterAppearancesByEpisode(
    characterId: string,
    episodeId: string,
  ): Promise<number>;
}
