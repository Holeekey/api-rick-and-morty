import { EpisodeStatus } from 'src/episode/application/models/episode';

export type FindOneEpisodeResponse = {
  id: string;
  name: string;
  code: string;
  season: string;
  aireDate: Date;
  status: EpisodeStatus;
  minutesDuration: number;
  secondsDuration: number;
};
