import { FindManyCharactersResponse as FindManyCharactersResponseApp } from 'src/character/application/queries/find-many/types/response';

export type FindManyCharactersResponse = {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results: FindManyCharactersResponseApp[];
};
