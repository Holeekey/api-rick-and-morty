import { EpisodeStatus } from 'src/episode/application/models/episode';

export type FindManyEpisodesDTO = {
  page: number;
  perPage: number;
  status?: EpisodeStatus;
  season?: string;
};
