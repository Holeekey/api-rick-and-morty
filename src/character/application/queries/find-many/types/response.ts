import {
  CharacterStatus,
  Gender,
} from 'src/character/application/models/character';

export type FindManyCharactersResponse = {
  id: string;
  name: string;
  status: CharacterStatus;
  species: string;
  gender: Gender;
  createdAt: Date;
  appearancesId: string[];
};
