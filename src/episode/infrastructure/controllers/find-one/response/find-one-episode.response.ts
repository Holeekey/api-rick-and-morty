import { EpisodeStatus } from 'src/episode/application/models/episode';

export type FindOneEpisodeResponse = {
  id: string;
  name: string;
  code: string;
  aireDate: Date;
  season: string;
  status: EpisodeStatus;
  duration: string;
  appearancesUrl: string[];
};
