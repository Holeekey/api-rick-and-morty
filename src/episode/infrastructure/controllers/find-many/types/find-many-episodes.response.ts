import { FindManyEpisodesResponse as FindManyEpisodesResponseApp } from 'src/episode/application/queries/find-many/types/response';

export type FindManyEpisodesResponse = {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results: FindManyEpisodesResponseApp[];
};
