import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const APPEARANCE_NOT_FOUND = 'APPEARANCE NOT FOUND' as const;

export const appearanceNotFoundError = makeApplicationErrorFactory({
  name: APPEARANCE_NOT_FOUND,
  message: 'This appearance id does not exists',
});
