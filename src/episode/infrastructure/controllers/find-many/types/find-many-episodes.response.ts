import { EpisodeStatus } from 'src/episode/application/models/episode';

export type FindManyEpisodesResponse = {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results: {
    id: string;
    name: string;
    code: string;
    aireDate: Date;
    season: string;
    status: EpisodeStatus;
    duration: string;
    url: string;
  }[];
};
