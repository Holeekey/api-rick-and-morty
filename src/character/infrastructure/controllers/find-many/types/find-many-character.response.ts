import {
  CharacterStatus,
  Gender,
} from 'src/character/application/models/character';

export type FindManyCharactersResponse = {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results: {
    id: string;
    name: string;
    species: string;
    status: CharacterStatus;
    gender: Gender;
    createdAt: Date;
    url: string;
  }[];
};
