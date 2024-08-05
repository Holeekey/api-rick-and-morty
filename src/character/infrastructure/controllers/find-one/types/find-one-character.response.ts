import {
  CharacterStatus,
  Gender,
} from 'src/character/application/models/character';

export type FindOneCharacterResponse = {
  id: string;
  name: string;
  species: string;
  status: CharacterStatus;
  gender: Gender;
  createdAt: Date;
  appearancesUrl: string[];
};
