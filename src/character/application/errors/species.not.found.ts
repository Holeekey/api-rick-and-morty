import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const SPECIES_NOT_FOUND = 'SPECIES NOT FOUND' as const;

export const speciesNotFoundError = makeApplicationErrorFactory({
  name: SPECIES_NOT_FOUND,
  message: 'The species name does not exists',
});
