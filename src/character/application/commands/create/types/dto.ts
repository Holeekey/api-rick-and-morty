import { Gender } from 'src/character/application/models/character';

export type CreateCharacterDTO = {
  name: string;
  gender: Gender;
  species: string;
};
