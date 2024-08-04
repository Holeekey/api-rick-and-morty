import { makeApplicationErrorFactory } from '../../../common/application/error/application.error';

export const EPISODE_CODE_ALREADY_EXISTS =
  'EPISODE CODE ALREADY EXISTS' as const;

export const episodeCodeAlreadyExistsError = makeApplicationErrorFactory({
  name: EPISODE_CODE_ALREADY_EXISTS,
  message: 'There is already an episode with that same code',
});
