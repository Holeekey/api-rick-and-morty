import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const EPISODE_NOT_FOUND = 'EPISODE NOT FOUND' as const;

export const episodeNotFoundError = makeApplicationErrorFactory({
  name: EPISODE_NOT_FOUND,
  message: 'The episode does not exists',
});
