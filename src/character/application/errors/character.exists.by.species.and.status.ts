import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const CHARACTER_EXISTS_BY_SPECIES_AND_STATUS =
  'CHARACTER EXISTS BY SPECIES AND STATUS' as const;

export const characterSpeciesStatusFoundError = makeApplicationErrorFactory({
  name: CHARACTER_EXISTS_BY_SPECIES_AND_STATUS,
  message:
    'There is already a character with the same name, status and species',
});
