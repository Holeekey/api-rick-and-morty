import { EpisodeStatus } from '../../../models/episode';

export type FindManyEpisodesResponse = {
  id: string;
  name: string;
  code: string;
  season: string;
  aireDate: Date;
  status: EpisodeStatus;
  minutesDuration: number;
  secondsDuration: number;
};
