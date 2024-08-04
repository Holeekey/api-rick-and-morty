import { Gender } from 'src/character/application/models/character';

export type UpdateCharacterDTO = {
  id: string;
  name?: string;
  gender?: Gender;
  species?: string;
};
