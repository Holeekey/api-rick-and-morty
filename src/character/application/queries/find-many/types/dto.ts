import { CharacterStatus } from 'src/character/application/models/character';

export type FindManyCharactersDTO = {
  perPage: number;
  page: number;
  status?: CharacterStatus;
  species?: string;
};
