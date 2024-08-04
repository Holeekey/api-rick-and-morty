import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const SEASON_NOT_FOUND = 'SEASON NOT FOUND' as const;

export const seasonNotFoundError = makeApplicationErrorFactory({
  name: SEASON_NOT_FOUND,
  message: 'The season name does not exists',
});
