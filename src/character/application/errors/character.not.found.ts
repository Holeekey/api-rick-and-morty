import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const CHARACTER_NOT_FOUND = 'CHARACTER NOT FOUND' as const;

export const characterNotFoundError = makeApplicationErrorFactory({
  name: CHARACTER_NOT_FOUND,
  message: 'The character does not exists',
});
