import { EpisodeStatus } from 'src/episode/application/models/episode';

export type UpdateEpisodeResponse = {
  id: string;
  name: string;
  aireDate: Date;
  code: string;
  minutesDuration: number;
  secondsDuration: number;
  season: string;
  status: EpisodeStatus;
};
